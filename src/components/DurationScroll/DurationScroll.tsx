import React, {
    useRef,
    useCallback,
    forwardRef,
    useImperativeHandle,
    useState,
    useEffect,
    useMemo,
} from "react";

import {
    View,
    Text,
    FlatList as RNFlatList,
    AccessibilityInfo,
} from "react-native";
import type {
    ViewabilityConfigCallbackPairs,
    FlatListProps,
} from "react-native";

import { colorToRgba } from "../../utils/colorToRgba";
import {
    generate12HourNumbers,
    generateNumbers,
} from "../../utils/generateNumbers";
import { getAdjustedLimit } from "../../utils/getAdjustedLimit";
import { getDurationAndIndexFromScrollOffset } from "../../utils/getDurationAndIndexFromScrollOffset";
import { getInitialScrollIndex } from "../../utils/getInitialScrollIndex";
import PickerItem from "../PickerItem";

import type {
    DurationScrollProps,
    DurationScrollRef,
    ExpoAvAudioInstance,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const keyExtractor = (item: any, index: number) => index.toString();

const DurationScroll = forwardRef<DurationScrollRef, DurationScrollProps>(
    (props, ref) => {
        const {
            accessibilityHint,
            accessibilityLabel,
            aggressivelyGetLatestDuration,
            allowFontScaling = false,
            amLabel,
            Audio,
            clickSoundAsset,
            decelerationRate = 0.88,
            disableInfiniteScroll = false,
            FlatList = RNFlatList,
            formatValue,
            Haptics,
            initialValue = 0,
            interval,
            is12HourPicker,
            isDisabled,
            isScreenReaderEnabled = false,
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
            selectedValue,
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

        const [clickSound, setClickSound] =
            useState<ExpoAvAudioInstance | null>(null);

        useEffect(() => {
            // Audio prop deprecated in v2.2.0 (use pickerFeedback instead) - will be removed in a future version

            // preload the sound when the component mounts
            let soundInstance: ExpoAvAudioInstance | null = null;

            const loadSound = async () => {
                if (!Audio) {
                    return;
                }

                try {
                    const { sound: newSound } = await Audio.Sound.createAsync(
                        clickSoundAsset ?? {
                            // use a hosted sound as a fallback (do not use local asset due to loader issues
                            // in some environments when including mp3 in library)
                            uri: "https://drive.google.com/uc?export=download&id=10e1YkbNsRh-vGx1jmS1Nntz8xzkBp4_I",
                        },
                        { shouldPlay: false }
                    );
                    soundInstance = newSound;
                    setClickSound(newSound);
                } catch (error) {
                    console.warn("Failed to load click sound:", error);
                }
            };

            loadSound();

            return () => {
                // unload sound when component unmounts
                soundInstance?.unloadAsync();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [Audio]);

        const playClickSound = useCallback(async () => {
            if (!clickSound) return;

            try {
                await clickSound.replayAsync();
            } catch (error) {
                console.warn("Failed to play click sound:", error);
            }
        }, [clickSound]);

        const renderItem = useCallback<
            NonNullable<FlatListProps<string>["renderItem"]>
        >(
            ({ item }) => (
                <PickerItem
                    adjustedLimitedMax={adjustedLimited.max}
                    adjustedLimitedMin={adjustedLimited.min}
                    allowFontScaling={allowFontScaling}
                    amLabel={amLabel}
                    is12HourPicker={is12HourPicker}
                    item={item}
                    pmLabel={pmLabel}
                    selectedValue={selectedValue}
                    styles={styles}
                />
            ),
            [
                adjustedLimited.max,
                adjustedLimited.min,
                allowFontScaling,
                amLabel,
                is12HourPicker,
                pmLabel,
                selectedValue,
                styles,
            ]
        );

        const onScroll = useCallback<
            NonNullable<FlatListProps<string>["onScroll"]>
        >(
            (e) => {
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

                if (pickerFeedback || Haptics || Audio) {
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
                                playClickSound();
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
                playClickSound,
                disableInfiniteScroll,
                interval,
                numberOfItems,
                padWithNItems,
                styles.pickerItemContainer.height,
            ]
        );

        const onMomentumScrollEnd = useCallback<
            NonNullable<FlatListProps<string>["onMomentumScrollEnd"]>
        >(
            (e) => {
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

        const onViewableItemsChanged = useCallback<
            NonNullable<FlatListProps<string>["onViewableItemsChanged"]>
        >(
            ({ viewableItems }) => {
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

        const getItemLayout = useCallback<
            NonNullable<FlatListProps<string>["getItemLayout"]>
        >(
            (_, index) => ({
                length: styles.pickerItemContainer.height,
                offset: styles.pickerItemContainer.height * index,
                index,
            }),
            [styles.pickerItemContainer.height]
        );

        const handleAccessibilityAction = useCallback(
            (event: { nativeEvent: { actionName: string } }) => {
                const { actionName } = event.nativeEvent;

                if (actionName === "increment") {
                    let newValue = latestDuration.current + interval;

                    // Wrap around to minimum if exceeding maximum
                    if (newValue > adjustedLimited.max) {
                        newValue = adjustedLimited.min;
                    }

                    flatListRef.current?.scrollToIndex({
                        animated: true,
                        index: getInitialScrollIndex({
                            disableInfiniteScroll,
                            interval,
                            numberOfItems,
                            padWithNItems,
                            repeatNumbersNTimes: safeRepeatNumbersNTimes,
                            value: newValue,
                        }),
                    });
                    latestDuration.current = newValue;

                    // Announce the new value to screen readers
                    const announcement = formatValue
                        ? formatValue(newValue)
                        : String(newValue);
                    AccessibilityInfo.announceForAccessibilityWithOptions(
                        announcement,
                        {
                            queue: false,
                        }
                    );
                } else if (actionName === "decrement") {
                    let newValue = latestDuration.current - interval;

                    // Wrap around to maximum if going below minimum
                    if (newValue < adjustedLimited.min) {
                        newValue = adjustedLimited.max;
                    }

                    flatListRef.current?.scrollToIndex({
                        animated: true,
                        index: getInitialScrollIndex({
                            disableInfiniteScroll,
                            interval,
                            numberOfItems,
                            padWithNItems,
                            repeatNumbersNTimes: safeRepeatNumbersNTimes,
                            value: newValue,
                        }),
                    });
                    latestDuration.current = newValue;

                    // Announce the new value to screen readers
                    const announcement = formatValue
                        ? formatValue(newValue)
                        : String(newValue);
                    AccessibilityInfo.announceForAccessibility(announcement);
                }
            },
            [
                adjustedLimited.max,
                adjustedLimited.min,
                disableInfiniteScroll,
                formatValue,
                interval,
                numberOfItems,
                padWithNItems,
                safeRepeatNumbersNTimes,
            ]
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
                    <View
                        accessibilityActions={
                            isScreenReaderEnabled
                                ? [{ name: "increment" }, { name: "decrement" }]
                                : undefined
                        }
                        accessibilityHint={
                            isScreenReaderEnabled
                                ? accessibilityHint
                                : undefined
                        }
                        accessibilityLabel={
                            isScreenReaderEnabled
                                ? accessibilityLabel
                                : undefined
                        }
                        accessibilityRole={
                            isScreenReaderEnabled ? "adjustable" : undefined
                        }
                        accessibilityValue={
                            isScreenReaderEnabled
                                ? {
                                      text: formatValue
                                          ? formatValue(latestDuration.current)
                                          : String(latestDuration.current),
                                  }
                                : undefined
                        }
                        accessible={isScreenReaderEnabled ? true : false}
                        onAccessibilityAction={handleAccessibilityAction}>
                        <FlatList
                            key={flatListRenderKey}
                            ref={flatListRef}
                            accessible={
                                isScreenReaderEnabled ? false : undefined
                            }
                            contentContainerStyle={
                                styles.durationScrollFlatListContentContainer
                            }
                            data={numbersForFlatList}
                            decelerationRate={decelerationRate}
                            getItemLayout={getItemLayout}
                            importantForAccessibility={
                                isScreenReaderEnabled
                                    ? "no-hide-descendants"
                                    : undefined
                            }
                            initialScrollIndex={initialScrollIndex}
                            keyExtractor={keyExtractor}
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
                            ].map(
                                (_, i) => i * styles.pickerItemContainer.height
                            )}
                            style={styles.durationScrollFlatList}
                            testID="duration-scroll-flatlist"
                            viewabilityConfigCallbackPairs={
                                viewabilityConfigCallbackPairs
                            }
                            windowSize={numberOfItemsToShow}
                        />
                    </View>
                    <View
                        accessibilityElementsHidden={isScreenReaderEnabled}
                        accessible={false}
                        importantForAccessibility={
                            isScreenReaderEnabled ? "no-hide-descendants" : "no"
                        }
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
            accessibilityHint,
            accessibilityLabel,
            allowFontScaling,
            decelerationRate,
            flatListRenderKey,
            formatValue,
            getItemLayout,
            handleAccessibilityAction,
            initialScrollIndex,
            isDisabled,
            isScreenReaderEnabled,
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