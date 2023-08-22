/* eslint-disable @typescript-eslint/no-var-requires */
import React, {
    useRef,
    useCallback,
    forwardRef,
    useImperativeHandle,
} from "react";
import {
    View,
    Text,
    FlatList,
    ViewabilityConfigCallbackPairs,
    ViewToken,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";

import { generateNumbers } from "../../utils/generateNumbers";
import { colorToRgba } from "../../utils/colorToRgba";
import { generateStyles } from "./TimerPicker.styles";
import { getAdjustedLimit } from "../../utils/getAdjustedLimit";
import { getScrollIndex } from "../../utils/getScrollIndex";

export interface DurationScrollRef {
    reset: () => void;
    setValue: (value: number) => void;
}

type LinearGradientPoint = {
    x: number;
    y: number;
};

export type LinearGradientProps = React.ComponentProps<typeof View> & {
    colors: string[];
    locations?: number[] | null;
    start?: LinearGradientPoint | null;
    end?: LinearGradientPoint | null;
};

export type LimitType = {
    max?: number;
    min?: number;
};

interface DurationScrollProps {
    numberOfItems: number;
    label?: string | React.ReactElement;
    initialValue?: number;
    onDurationChange: (duration: number) => void;
    padNumbersWithZero?: boolean;
    disableInfiniteScroll?: boolean;
    limit?: LimitType;
    padWithNItems: number;
    pickerGradientOverlayProps?: LinearGradientProps;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LinearGradient?: any;
    testID?: string;
    styles: ReturnType<typeof generateStyles>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const KEY_EXTRACTOR = (_: any, index: number) => index.toString();

const DurationScroll = forwardRef<DurationScrollRef, DurationScrollProps>(
    (
        {
            numberOfItems,
            label,
            initialValue = 0,
            onDurationChange,
            padNumbersWithZero = false,
            disableInfiniteScroll = false,
            limit,
            padWithNItems,
            pickerGradientOverlayProps,
            LinearGradient,
            testID,
            styles,
        },
        ref
    ): React.ReactElement => {
        const flatListRef = useRef<FlatList | null>(null);

        const data = generateNumbers(numberOfItems, {
            padWithZero: padNumbersWithZero,
            repeatNTimes: 3,
            disableInfiniteScroll,
            padWithNItems: padWithNItems,
        });

        const numberOfItemsToShow = 1 + padWithNItems * 2;

        const adjustedLimited = getAdjustedLimit(limit, numberOfItems);

        const initialScrollIndex = getScrollIndex({
            value: initialValue,
            numberOfItems,
            padWithNItems,
            disableInfiniteScroll,
        });

        useImperativeHandle(ref, () => ({
            reset: () => {
                flatListRef.current?.scrollToIndex({
                    animated: false,
                    index: initialScrollIndex,
                });
            },
            setValue: (value) => {
                flatListRef.current?.scrollToIndex({
                    animated: false,
                    index: getScrollIndex({
                        value: value,
                        numberOfItems,
                        padWithNItems,
                        disableInfiniteScroll,
                    }),
                });
            },
        }));

        const renderItem = useCallback(
            ({ item }: { item: string }) => {
                const intItem = parseInt(item);

                return (
                    <View
                        key={item}
                        style={styles.pickerItemContainer}
                        testID="picker-item">
                        <Text
                            style={[
                                styles.pickerItem,
                                intItem > adjustedLimited.max ||
                                intItem < adjustedLimited.min
                                    ? styles.disabledPickerItem
                                    : {},
                            ]}>
                            {item}
                        </Text>
                    </View>
                );
            },
            [
                adjustedLimited.max,
                adjustedLimited.min,
                styles.disabledPickerItem,
                styles.pickerItem,
                styles.pickerItemContainer,
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
                testID={testID}
                style={{
                    height:
                        styles.pickerItemContainer.height * numberOfItemsToShow,
                    overflow: "hidden",
                }}>
                <FlatList
                    ref={flatListRef}
                    data={data}
                    getItemLayout={getItemLayout}
                    initialScrollIndex={initialScrollIndex}
                    windowSize={numberOfItemsToShow}
                    renderItem={renderItem}
                    keyExtractor={KEY_EXTRACTOR}
                    showsVerticalScrollIndicator={false}
                    decelerationRate="fast"
                    scrollEventThrottle={16}
                    snapToAlignment="start"
                    // used in place of snapToOffset due to bug on Android
                    snapToOffsets={[...Array(data.length)].map(
                        (_, i) => i * styles.pickerItemContainer.height
                    )}
                    viewabilityConfigCallbackPairs={
                        !disableInfiniteScroll
                            ? viewabilityConfigCallbackPairs?.current
                            : undefined
                    }
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    testID="duration-scroll-flatlist"
                />
                <View style={styles.pickerLabelContainer}>
                    {typeof label === "string" ? (
                        <Text style={styles.pickerLabel}>{label}</Text>
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
                            start={{ x: 1, y: 0.3 }}
                            end={{ x: 1, y: 1 }}
                            {...pickerGradientOverlayProps}
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
                            start={{ x: 1, y: 0 }}
                            end={{ x: 1, y: 0.7 }}
                            {...pickerGradientOverlayProps}
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
