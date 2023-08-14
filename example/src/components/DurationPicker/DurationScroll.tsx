import React, { useRef, useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ViewabilityConfigCallbackPairs,
    ViewToken,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { generateNumbers } from "../utils/generateNumbers";
import { generateStyles } from "./DurationPicker.styles";

interface DurationScrollProps {
    numberOfItems: number;
    label?: string;
    initialIndex?: number;
    onValueChange: (value: number) => void;
    padNumbersWithZero?: boolean;
    enableInfiniteScroll?: boolean;
    styles: ReturnType<typeof generateStyles>;
}

const DurationScroll = ({
    numberOfItems,
    label,
    initialIndex = 0,
    onValueChange,
    padNumbersWithZero,
    enableInfiniteScroll = true,
    styles,
}: DurationScrollProps): React.ReactElement => {
    const flatListRef = useRef<FlatList | null>(null);

    const data = generateNumbers(numberOfItems, {
        padWithZero: padNumbersWithZero,
        repeatNTimes: 3,
    });

    const renderItem = ({ item }: { item: string }) => (
        <View key={item} style={styles.item}>
            <Text style={styles.number}>{item}</Text>
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
        []
    );

    const viewabilityConfigCallbackPairs =
        useRef<ViewabilityConfigCallbackPairs>([
            {
                viewabilityConfig: { viewAreaCoveragePercentThreshold: 25 },
                onViewableItemsChanged: onViewableItemsChanged,
            },
        ]);

    return (
        <View style={{ height: styles.item.height * 3, overflow: "hidden" }}>
            <FlatList
                ref={flatListRef}
                data={data}
                getItemLayout={(_, index) => ({
                    length: styles.item.height,
                    offset: styles.item.height * index,
                    index,
                })}
                initialScrollIndex={
                    (initialIndex % numberOfItems) + numberOfItems + 1
                }
                windowSize={3}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                decelerationRate={0.9}
                scrollEventThrottle={16}
                snapToAlignment="start"
                snapToOffsets={[...Array(data.length)].map(
                    (_, i) => i * styles.item.height
                )}
                viewabilityConfigCallbackPairs={
                    enableInfiniteScroll
                        ? viewabilityConfigCallbackPairs?.current
                        : undefined
                }
                onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(
                        e.nativeEvent.contentOffset.y / styles.item.height
                    );
                    onValueChange((newIndex % numberOfItems) - 1);
                }}
            />
            <Text style={styles.label}>{label}</Text>
            <LinearGradient
                colors={[styles.contentContainer.backgroundColor, "transparent"]}
                start={{ x: 1, y: 0.3 }}
                end={{ x: 1, y: 1 }}
                style={[overlayStyles.overlay, { top: 0 }]}
            />
            <LinearGradient
                colors={["transparent", styles.contentContainer.backgroundColor]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 0.7 }}
                style={[overlayStyles.overlay, { bottom: 0 }]}
            />
        </View>
    );
};

const overlayStyles = StyleSheet.create({
    overlay: {
        position: "absolute",
        left: 0,
        right: 0,
        height: "30%",
    },
});

export default DurationScroll;
