/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useRef, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    ViewabilityConfigCallbackPairs,
    ViewToken,
} from "react-native";

import { generateNumbers } from "../../utils/generateNumbers";
import { colorToRgba } from "../../utils/colorToRgba";
import { generateStyles } from "./TimerPicker.styles";

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

interface DurationScrollProps {
    numberOfItems: number;
    label?: string | React.ReactElement;
    initialIndex?: number;
    onDurationChange: (duration: number) => void;
    padNumbersWithZero?: boolean;
    disableInfiniteScroll?: boolean;
    padWithNItems: number;
    pickerGradientOverlayProps?: LinearGradientProps;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LinearGradient?: any;
    testID?: string;
    styles: ReturnType<typeof generateStyles>;
}

const DurationScroll = ({
    numberOfItems,
    label,
    initialIndex = 0,
    onDurationChange,
    padNumbersWithZero = false,
    disableInfiniteScroll = false,
    padWithNItems,
    pickerGradientOverlayProps,
    LinearGradient,
    testID,
    styles,
}: DurationScrollProps): React.ReactElement => {
    const flatListRef = useRef<FlatList | null>(null);

    const data = generateNumbers(numberOfItems, {
        padWithZero: padNumbersWithZero,
        repeatNTimes: 3,
        disableInfiniteScroll,
        padWithNItems: padWithNItems,
    });

    const numberOfItemsToShow = 1 + padWithNItems * 2;

    const renderItem = ({ item }: { item: string }) => (
        <View
            key={item}
            style={styles.pickerItemContainer}
            testID="picker-item">
            <Text style={styles.pickerItem}>{item}</Text>
        </View>
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
                height: styles.pickerItemContainer.height * numberOfItemsToShow,
                overflow: "hidden",
            }}>
            <FlatList
                ref={flatListRef}
                data={data}
                getItemLayout={(_, index) => ({
                    length: styles.pickerItemContainer.height,
                    offset: styles.pickerItemContainer.height * index,
                    index,
                })}
                initialScrollIndex={
                    (initialIndex % numberOfItems) +
                    numberOfItems +
                    (disableInfiniteScroll ? padWithNItems : 0) -
                    (padWithNItems - 1)
                }
                windowSize={numberOfItemsToShow}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
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
                onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(
                        e.nativeEvent.contentOffset.y /
                            styles.pickerItemContainer.height
                    );
                    onDurationChange(
                        (disableInfiniteScroll
                            ? newIndex
                            : newIndex + padWithNItems) %
                            (numberOfItems + 1)
                    );
                }}
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
                            styles.pickerContainer.backgroundColor ?? "white",
                            colorToRgba({
                                color:
                                    styles.pickerContainer.backgroundColor ??
                                    "white",
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
                                    styles.pickerContainer.backgroundColor ??
                                    "white",
                                opacity: 0,
                            }),
                            styles.pickerContainer.backgroundColor ?? "white",
                        ]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 1, y: 0.7 }}
                        {...pickerGradientOverlayProps}
                        style={[styles.pickerGradientOverlay, { bottom: -1 }]}
                    />
                </>
            ) : null}
        </View>
    );
};

export default DurationScroll;
