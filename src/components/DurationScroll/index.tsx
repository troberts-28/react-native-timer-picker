import React, {
    useRef,
    useCallback,
    forwardRef,
    useImperativeHandle,
    useState,
    useEffect,
    useMemo,
} from "react";

import { View, Text, FlatList as RNFlatList } from "react-native";
import type {
    ViewabilityConfigCallbackPairs,
    ViewToken,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";

import { colorToRgba } from "../../utils/colorToRgba";
import {
    generate12HourNumbers,
    generateNumbers,
} from "../../utils/generateNumbers";
import { getAdjustedLimit } from "../../utils/getAdjustedLimit";
import { getDurationAndIndexFromScrollOffset } from "../../utils/getDurationAndIndexFromScrollOffset";
import { getInitialScrollIndex } from "../../utils/getInitialScrollIndex";

import type { DurationScrollProps, DurationScrollRef } from "./types";

const DurationScroll = forwardRef<DurationScrollRef, DurationScrollProps>(
    (props, ref) => {
        const {
            aggressivelyGetLatestDuration,
            allowFontScaling = false,
            amLabel,
            Audio,
            clickSoundAsset,
            disableInfiniteScroll = false,
            FlatList = RNFlatList,
            Haptics,
            initialValue = 0,
            interval,
            is12HourPicker,
            isDisabled,
            label,
            limit,
            LinearGradient,
            MaskedView,
            maximumValue,
            onDurationChange,
            padNumbersWithZero = false,
            padWithNItems,
            pickerFeedback,
            pickerGradientOverlayProps,
            pmLabel,
            repeatNumbersNTimes = 3,
            repeatNumbersNTimesNotExplicitlySet,
            styles,
            testID,
        } = props;

        const numberOfItems = useMemo(() => {
            // guard against negative maximum values
            if (maximumValue < 0) {
                return 1;
            }

            return Math.floor(maximumValue / interval) + 1;
        }, [interval, maximumValue]);

        const safeRepeatNumbersNTimes = useMemo(() => {
            // do not repeat numbers if there is only one option
            if (numberOfItems === 1) {
                return 1;
            }

            if (!disableInfiniteScroll && repeatNumbersNTimes < 2) {
                return 2;
            } else if (repeatNumbersNTimes < 1 || isNaN(repeatNumbersNTimes)) {
                return 1;
            }

            // if this variable is not explicitly set, we calculate a reasonable value based on
            // the number of items in the picker, avoiding regular jumps up/down the list
            // whilst avoiding rendering too many items in the picker
            if (repeatNumbersNTimesNotExplicitlySet) {
                return Math.max(Math.round(180 / numberOfItems), 1);
            }

            return Math.round(repeatNumbersNTimes);
        }, [
            disableInfiniteScroll,
            numberOfItems,
            repeatNumbersNTimes,
            repeatNumbersNTimesNotExplicitlySet,
        ]);

        const numbersForFlatList = useMemo(() => {
            if (is12HourPicker) {
                return generate12HourNumbers({
                    padNumbersWithZero,
                    repeatNTimes: safeRepeatNumbersNTimes,
                    disableInfiniteScroll,
                    padWithNItems,
                    interval,
                });
            }

            return generateNumbers(numberOfItems, {
                padNumbersWithZero,
                repeatNTimes: safeRepeatNumbersNTimes,
                disableInfiniteScroll,
                padWithNItems,
                interval,
            });
        }, [
            disableInfiniteScroll,
            is12HourPicker,
            interval,
            numberOfItems,
            padNumbersWithZero,
            padWithNItems,
            safeRepeatNumbersNTimes,
        ]);

        const initialScrollIndex = useMemo(
            () =>
                getInitialScrollIndex({
                    disableInfiniteScroll,
                    interval,
                    numberOfItems,
                    padWithNItems,
                    repeatNumbersNTimes: safeRepeatNumbersNTimes,
                    value: initialValue,
                }),
            [
                disableInfiniteScroll,
                initialValue,
                interval,
                numberOfItems,
                padWithNItems,
                safeRepeatNumbersNTimes,
            ]
        );

        const adjustedLimited = useMemo(
            () => getAdjustedLimit(limit, numberOfItems, interval),
            [interval, limit, numberOfItems]
        );

        const numberOfItemsToShow = 1 + padWithNItems * 2;

        // keep track of the latest duration as it scrolls
        const latestDuration = useRef(0);
        // keep track of the last index scrolled past for haptic/audio feedback
        const lastFeedbackIndex = useRef(0);

        const flatListRef = useRef<RNFlatList | null>(null);

        const [clickSound, setClickSound] = useState<
            | {
                  replayAsync: () => Promise<void>;
                  unloadAsync: () => Promise<void>;
              }
            | undefined
        >();

        // Preload the sound when the component mounts
        useEffect(() => {
            const loadSound = async () => {
                if (Audio) {
                    const { sound } = await Audio.Sound.createAsync(
                        clickSoundAsset ?? {
                            // use a hosted sound as a fallback (do not use local asset due to loader issues
                            // in some environments when including mp3 in library)
                            uri: "https://drive.google.com/uc?export=download&id=10e1YkbNsRh-vGx1jmS1Nntz8xzkBp4_I",
                        },
                        { shouldPlay: false }
                    );
                    setClickSound(sound);
                }
            };

            loadSound();

            // Unload sound when component unmounts
            return () => {
                clickSound?.unloadAsync();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [Audio]);

        const renderItem = useCallback(
            ({ item }: { item: string }) => {
                let stringItem = item;
                let intItem: number;
                let isAm: boolean | undefined;

                if (!is12HourPicker) {
                    intItem = parseInt(item);
                } else {
                    isAm = item.includes("AM");
                    stringItem = item.replace(/\s[AP]M/g, "");
                    intItem = parseInt(stringItem);
                }

                return (
                    <View
                        key={item}
                        style={styles.pickerItemContainer}
                        testID="picker-item">
                        <Text
                            allowFontScaling={allowFontScaling}
                            style={[
                                styles.pickerItem,
                                intItem > adjustedLimited.max ||
                                intItem < adjustedLimited.min
                                    ? styles.disabledPickerItem
                                    : {},
                            ]}>
                            {stringItem}
                        </Text>
                        {is12HourPicker ? (
                            <View
                                pointerEvents="none"
                                style={styles.pickerAmPmContainer}>
                                <Text
                                    allowFontScaling={allowFontScaling}
                                    style={[styles.pickerAmPmLabel]}>
                                    {isAm ? amLabel : pmLabel}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                );
            },
            [
                adjustedLimited.max,
                adjustedLimited.min,
                allowFontScaling,
                amLabel,
                is12HourPicker,
                pmLabel,
                styles.disabledPickerItem,
                styles.pickerAmPmContainer,
                styles.pickerAmPmLabel,
                styles.pickerItem,
                styles.pickerItemContainer,
            ]
        );

        const onScroll = useCallback(
            (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                // this function is only used when the picker is in a modal and/or has Haptic/Audio feedback
                // it is used to ensure that the modal gets the latest duration on clicking
                // the confirm button, even if the scrollview is still scrolling
                if (
                    !aggressivelyGetLatestDuration &&
                    !Haptics &&
                    !Audio &&
                    !pickerFeedback
                ) {
                    return;
                }

                if (aggressivelyGetLatestDuration) {
                    const newValues = getDurationAndIndexFromScrollOffset({
                        disableInfiniteScroll,
                        interval,
                        itemHeight: styles.pickerItemContainer.height,
                        numberOfItems,
                        padWithNItems,
                        yContentOffset: e.nativeEvent.contentOffset.y,
                    });

                    if (newValues.duration !== latestDuration.current) {
                        // check limits
                        if (newValues.duration > adjustedLimited.max) {
                            newValues.duration = adjustedLimited.max;
                        } else if (newValues.duration < adjustedLimited.min) {
                            newValues.duration = adjustedLimited.min;
                        }

                        latestDuration.current = newValues.duration;
                    }
                }

                if (Haptics || Audio || pickerFeedback) {
                    const feedbackIndex = Math.round(
                        (e.nativeEvent.contentOffset.y +
                            styles.pickerItemContainer.height / 2) /
                            styles.pickerItemContainer.height
                    );

                    if (feedbackIndex !== lastFeedbackIndex.current) {
                        // this check stops the feedback firing when the component mounts
                        if (lastFeedbackIndex.current) {
                            // fire haptic feedback if available
                            try {
                                Haptics?.selectionAsync();
                            } catch {
                                // do nothing
                            }

                            // play click sound if available
                            try {
                                clickSound?.replayAsync();
                            } catch {
                                // do nothing
                            }

                            // fire custom feedback if available
                            try {
                                pickerFeedback?.();
                            } catch {
                                // do nothing
                            }
                        }

                        lastFeedbackIndex.current = feedbackIndex;
                    }
                }
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [
                adjustedLimited.max,
                adjustedLimited.min,
                aggressivelyGetLatestDuration,
                clickSound,
                disableInfiniteScroll,
                interval,
                numberOfItems,
                padWithNItems,
                styles.pickerItemContainer.height,
            ]
        );

        const onMomentumScrollEnd = useCallback(
            (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                const newValues = getDurationAndIndexFromScrollOffset({
                    disableInfiniteScroll,
                    interval,
                    itemHeight: styles.pickerItemContainer.height,
                    numberOfItems,
                    padWithNItems,
                    yContentOffset: e.nativeEvent.contentOffset.y,
                });

                // check limits
                if (newValues.duration > adjustedLimited.max) {
                    const targetScrollIndex =
                        newValues.index -
                        (newValues.duration - adjustedLimited.max);
                    flatListRef.current?.scrollToIndex({
                        animated: true,
                        index:
                            // guard against scrolling beyond end of list
                            targetScrollIndex >= 0
                                ? targetScrollIndex
                                : adjustedLimited.max - 1,
                    }); // scroll down to max
                    newValues.duration = adjustedLimited.max;
                } else if (newValues.duration < adjustedLimited.min) {
                    const targetScrollIndex =
                        newValues.index +
                        (adjustedLimited.min - newValues.duration);
                    flatListRef.current?.scrollToIndex({
                        animated: true,
                        index:
                            // guard against scrolling beyond end of list
                            targetScrollIndex <= numbersForFlatList.length - 1
                                ? targetScrollIndex
                                : adjustedLimited.min,
                    }); // scroll up to min
                    newValues.duration = adjustedLimited.min;
                }

                onDurationChange(newValues.duration);
            },
            [
                disableInfiniteScroll,
                interval,
                styles.pickerItemContainer.height,
                numberOfItems,
                padWithNItems,
                adjustedLimited.max,
                adjustedLimited.min,
                onDurationChange,
                numbersForFlatList.length,
            ]
        );

        const onViewableItemsChanged = useCallback(
            ({ viewableItems }: { viewableItems: ViewToken[] }) => {
                if (numberOfItems === 1) {
                    return;
                }

                if (
                    viewableItems[0]?.index &&
                    viewableItems[0].index < numberOfItems * 0.5
                ) {
                    flatListRef.current?.scrollToIndex({
                        animated: false,
                        index: viewableItems[0].index + numberOfItems,
                    });
                } else if (
                    viewableItems[0]?.index &&
                    viewableItems[0].index >=
                        numberOfItems * (safeRepeatNumbersNTimes - 0.5)
                ) {
                    flatListRef.current?.scrollToIndex({
                        animated: false,
                        index: viewableItems[0].index - numberOfItems,
                    });
                }
            },
            [numberOfItems, safeRepeatNumbersNTimes]
        );

        const [
            viewabilityConfigCallbackPairs,
            setViewabilityConfigCallbackPairs,
        ] = useState<ViewabilityConfigCallbackPairs | undefined>(
            !disableInfiniteScroll
                ? [
                      {
                          viewabilityConfig: {
                              viewAreaCoveragePercentThreshold: 0,
                          },
                          onViewableItemsChanged: onViewableItemsChanged,
                      },
                  ]
                : undefined
        );

        const [flatListRenderKey, setFlatListRenderKey] = useState(0);

        const initialRender = useRef(true);

        useEffect(() => {
            // don't run on first render
            if (initialRender.current) {
                initialRender.current = false;
                return;
            }

            // if the onViewableItemsChanged callback changes, we need to update viewabilityConfigCallbackPairs
            // which requires the FlatList to be remounted, hence the increase of the FlatList key
            setFlatListRenderKey((prev) => prev + 1);
            setViewabilityConfigCallbackPairs(
                !disableInfiniteScroll
                    ? [
                          {
                              viewabilityConfig: {
                                  viewAreaCoveragePercentThreshold: 0,
                              },
                              onViewableItemsChanged: onViewableItemsChanged,
                          },
                      ]
                    : undefined
            );
        }, [disableInfiniteScroll, onViewableItemsChanged]);

        const getItemLayout = useCallback(
            (_: ArrayLike<string> | null | undefined, index: number) => ({
                length: styles.pickerItemContainer.height,
                offset: styles.pickerItemContainer.height * index,
                index,
            }),
            [styles.pickerItemContainer.height]
        );

        useImperativeHandle(ref, () => ({
            reset: (options) => {
                flatListRef.current?.scrollToIndex({
                    animated: options?.animated ?? false,
                    index: initialScrollIndex,
                });
            },
            setValue: (value, options) => {
                flatListRef.current?.scrollToIndex({
                    animated: options?.animated ?? false,
                    index: getInitialScrollIndex({
                        disableInfiniteScroll,
                        interval,
                        numberOfItems,
                        padWithNItems,
                        repeatNumbersNTimes: safeRepeatNumbersNTimes,
                        value: value,
                    }),
                });
            },
            latestDuration: latestDuration,
        }));

        const renderContent = useMemo(() => {
            return (
                <>
                    <FlatList
                        key={flatListRenderKey}
                        ref={flatListRef}
                        contentContainerStyle={
                            styles.durationScrollFlatListContentContainer
                        }
                        data={numbersForFlatList}
                        decelerationRate={0.88}
                        getItemLayout={getItemLayout}
                        initialScrollIndex={initialScrollIndex}
                        keyExtractor={(_, index) => index.toString()}
                        nestedScrollEnabled
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        onScroll={onScroll}
                        renderItem={renderItem}
                        scrollEnabled={!isDisabled}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                        snapToAlignment="start"
                        // used in place of snapToInterval due to bug on Android
                        snapToOffsets={[
                            ...Array(numbersForFlatList.length),
                        ].map((_, i) => i * styles.pickerItemContainer.height)}
                        style={styles.durationScrollFlatList}
                        testID="duration-scroll-flatlist"
                        viewabilityConfigCallbackPairs={
                            viewabilityConfigCallbackPairs
                        }
                        windowSize={numberOfItemsToShow}
                    />
                    <View
                        pointerEvents="none"
                        style={styles.pickerLabelContainer}>
                        {typeof label === "string" ? (
                            <Text
                                allowFontScaling={allowFontScaling}
                                style={styles.pickerLabel}>
                                {label}
                            </Text>
                        ) : (
                            label ?? null
                        )}
                    </View>
                </>
            );
        }, [
            FlatList,
            allowFontScaling,
            flatListRenderKey,
            getItemLayout,
            initialScrollIndex,
            isDisabled,
            label,
            numberOfItemsToShow,
            numbersForFlatList,
            onMomentumScrollEnd,
            onScroll,
            renderItem,
            styles.durationScrollFlatList,
            styles.durationScrollFlatListContentContainer,
            styles.pickerItemContainer.height,
            styles.pickerLabel,
            styles.pickerLabelContainer,
            viewabilityConfigCallbackPairs,
        ]);

        const renderLinearGradient = useMemo(() => {
            if (!LinearGradient) {
                return null;
            }

            let colors: string[];

            if (MaskedView) {
                // if using masked view, we only care about the opacity
                colors = [
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,1)",
                    "rgba(0,0,0,1)",
                    "rgba(0,0,0,0)",
                ];
            } else {
                const backgroundColor =
                    styles.pickerContainer.backgroundColor ?? "white";
                const transparentBackgroundColor = colorToRgba({
                    color: backgroundColor,
                    opacity: 0,
                });
                colors = [
                    backgroundColor,
                    transparentBackgroundColor,
                    transparentBackgroundColor,
                    backgroundColor,
                ];
            }

            // calculate the gradient height to cover the top item and bottom item
            const gradientHeight =
                padWithNItems > 0 ? 1 / (padWithNItems * 2 + 1) : 0.3;

            return (
                <LinearGradient
                    colors={colors}
                    locations={[0, gradientHeight, 1 - gradientHeight, 1]}
                    pointerEvents="none"
                    style={styles.pickerGradientOverlay}
                    {...pickerGradientOverlayProps}
                />
            );
        }, [
            LinearGradient,
            MaskedView,
            padWithNItems,
            pickerGradientOverlayProps,
            styles.pickerContainer.backgroundColor,
            styles.pickerGradientOverlay,
        ]);

        return (
            <View
                pointerEvents={isDisabled ? "none" : undefined}
                style={[
                    styles.durationScrollFlatListContainer,
                    {
                        height:
                            styles.pickerItemContainer.height *
                            numberOfItemsToShow,
                    },
                    isDisabled && styles.disabledPickerContainer,
                ]}
                testID={testID}>
                {MaskedView ? (
                    <MaskedView
                        maskElement={renderLinearGradient}
                        style={[styles.maskedView]}>
                        {renderContent}
                    </MaskedView>
                ) : (
                    <>
                        {renderContent}
                        {renderLinearGradient}
                    </>
                )}
            </View>
        );
    }
);

export default React.memo(DurationScroll);
