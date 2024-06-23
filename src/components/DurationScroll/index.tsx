import React, {
    useRef,
    useCallback,
    forwardRef,
    useImperativeHandle,
    useState,
    useEffect,
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
import { getScrollIndex } from "../../utils/getScrollIndex";

import type { DurationScrollProps, DurationScrollRef } from "./types";

const DurationScroll = forwardRef<DurationScrollRef, DurationScrollProps>(
    (props, ref) => {
        const {
            aggressivelyGetLatestDuration,
            allowFontScaling = false,
            amLabel,
            Audio,
            bottomPickerGradientOverlayProps,
            clickSoundAsset,
            disableInfiniteScroll = false,
            FlatList = RNFlatList,
            Haptics,
            initialValue = 0,
            is12HourPicker,
            isDisabled,
            label,
            limit,
            LinearGradient,
            numberOfItems,
            onDurationChange,
            padNumbersWithZero = false,
            padWithNItems,
            pickerGradientOverlayProps,
            pmLabel,
            styles,
            testID,
            topPickerGradientOverlayProps,
        } = props;

        const data = !is12HourPicker
            ? generateNumbers(numberOfItems, {
                  padNumbersWithZero,
                  repeatNTimes: 3,
                  disableInfiniteScroll,
                  padWithNItems,
              })
            : generate12HourNumbers({
                  padNumbersWithZero,
                  repeatNTimes: 3,
                  disableInfiniteScroll,
                  padWithNItems,
              });

        const numberOfItemsToShow = 1 + padWithNItems * 2;

        const adjustedLimited = getAdjustedLimit(limit, numberOfItems);

        const initialScrollIndex = getScrollIndex({
            value: initialValue,
            numberOfItems,
            padWithNItems,
            disableInfiniteScroll,
        });

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
                    index: getScrollIndex({
                        value: value,
                        numberOfItems,
                        padWithNItems,
                        disableInfiniteScroll,
                    }),
                });
            },
            latestDuration: latestDuration,
        }));

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
                if (!aggressivelyGetLatestDuration && !Haptics && !Audio) {
                    return;
                }

                if (aggressivelyGetLatestDuration) {
                    const newIndex = Math.round(
                        e.nativeEvent.contentOffset.y /
                            styles.pickerItemContainer.height
                    );
                    let newDuration =
                        (disableInfiniteScroll
                            ? newIndex
                            : newIndex + padWithNItems) %
                        (numberOfItems + 1);

                    if (newDuration !== latestDuration.current) {
                        // check limits
                        if (newDuration > adjustedLimited.max) {
                            newDuration = adjustedLimited.max;
                        } else if (newDuration < adjustedLimited.min) {
                            newDuration = adjustedLimited.min;
                        }

                        latestDuration.current = newDuration;
                    }
                }

                if (Haptics || Audio) {
                    const feedbackIndex = Math.round(
                        (e.nativeEvent.contentOffset.y +
                            styles.pickerItemContainer.height / 2) /
                            styles.pickerItemContainer.height
                    );

                    if (feedbackIndex !== lastFeedbackIndex.current) {
                        // this check stops the feedback firing when the component mounts
                        if (lastFeedbackIndex.current) {
                            // fire haptic feedback if available
                            Haptics?.selectionAsync();

                            // play click sound if available
                            clickSound?.replayAsync();
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
                numberOfItems,
                padWithNItems,
                styles.pickerItemContainer.height,
            ]
        );

        const onMomentumScrollEnd = useCallback(
            (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                const newIndex = Math.round(
                    e.nativeEvent.contentOffset.y /
                        styles.pickerItemContainer.height
                );
                let newDuration =
                    (disableInfiniteScroll
                        ? newIndex
                        : newIndex + padWithNItems) %
                    (numberOfItems + 1);

                // check limits
                if (newDuration > adjustedLimited.max) {
                    const targetScrollIndex =
                        newIndex - (newDuration - adjustedLimited.max);
                    flatListRef.current?.scrollToIndex({
                        animated: true,
                        index:
                            // guard against scrolling beyond end of list
                            targetScrollIndex >= 0
                                ? targetScrollIndex
                                : adjustedLimited.max - 1,
                    }); // scroll down to max
                    newDuration = adjustedLimited.max;
                } else if (newDuration < adjustedLimited.min) {
                    const targetScrollIndex =
                        newIndex + (adjustedLimited.min - newDuration);
                    flatListRef.current?.scrollToIndex({
                        animated: true,
                        index:
                            // guard against scrolling beyond end of list
                            targetScrollIndex <= data.length - 1
                                ? targetScrollIndex
                                : adjustedLimited.min,
                    }); // scroll up to min
                    newDuration = adjustedLimited.min;
                }

                onDurationChange(newDuration);
            },
            [
                adjustedLimited.max,
                adjustedLimited.min,
                data.length,
                disableInfiniteScroll,
                numberOfItems,
                onDurationChange,
                padWithNItems,
                styles.pickerItemContainer.height,
            ]
        );

        const onViewableItemsChanged = useCallback(
            ({ viewableItems }: { viewableItems: ViewToken[] }) => {
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
                    viewableItems[0].index >= numberOfItems * 2.5
                ) {
                    flatListRef.current?.scrollToIndex({
                        animated: false,
                        index: viewableItems[0].index - numberOfItems,
                    });
                }
            },
            [numberOfItems]
        );

        const getItemLayout = useCallback(
            (_: ArrayLike<string> | null | undefined, index: number) => ({
                length: styles.pickerItemContainer.height,
                offset: styles.pickerItemContainer.height * index,
                index,
            }),
            [styles.pickerItemContainer.height]
        );

        const viewabilityConfigCallbackPairs =
            useRef<ViewabilityConfigCallbackPairs>([
                {
                    viewabilityConfig: { viewAreaCoveragePercentThreshold: 25 },
                    onViewableItemsChanged: onViewableItemsChanged,
                },
            ]);

        return (
            <View
                pointerEvents={isDisabled ? "none" : undefined}
                style={[
                    {
                        height:
                            styles.pickerItemContainer.height *
                            numberOfItemsToShow,
                        overflow: "visible",
                    },
                    isDisabled && styles.disabledPickerContainer,
                ]}
                testID={testID}>
                <FlatList
                    ref={flatListRef}
                    data={data}
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
                    // used in place of snapToOffset due to bug on Android
                    snapToOffsets={[...Array(data.length)].map(
                        (_, i) => i * styles.pickerItemContainer.height
                    )}
                    testID="duration-scroll-flatlist"
                    viewabilityConfigCallbackPairs={
                        !disableInfiniteScroll
                            ? viewabilityConfigCallbackPairs?.current
                            : undefined
                    }
                    windowSize={numberOfItemsToShow}
                />
                <View pointerEvents="none" style={styles.pickerLabelContainer}>
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
                {LinearGradient ? (
                    <>
                        <LinearGradient
                            colors={[
                                styles.pickerContainer.backgroundColor ??
                                    "white",
                                colorToRgba({
                                    color:
                                        styles.pickerContainer
                                            .backgroundColor ?? "white",
                                    opacity: 0,
                                }),
                            ]}
                            end={{ x: 1, y: 1 }}
                            pointerEvents="none"
                            start={{ x: 1, y: 0.3 }}
                            {...pickerGradientOverlayProps}
                            {...topPickerGradientOverlayProps}
                            style={[styles.pickerGradientOverlay, { top: 0 }]}
                        />
                        <LinearGradient
                            colors={[
                                colorToRgba({
                                    color:
                                        styles.pickerContainer
                                            .backgroundColor ?? "white",
                                    opacity: 0,
                                }),
                                styles.pickerContainer.backgroundColor ??
                                    "white",
                            ]}
                            end={{ x: 1, y: 0.7 }}
                            pointerEvents="none"
                            start={{ x: 1, y: 0 }}
                            {...pickerGradientOverlayProps}
                            {...bottomPickerGradientOverlayProps}
                            style={[
                                styles.pickerGradientOverlay,
                                { bottom: -1 },
                            ]}
                        />
                    </>
                ) : null}
            </View>
        );
    }
);

export default React.memo(DurationScroll);
