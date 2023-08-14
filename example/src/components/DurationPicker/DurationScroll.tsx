import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { generateNumbers } from "../utils/generateNumbers";
import { generateStyles } from "./DurationPicker.styles";

interface DurationScrollProps {
    numberOfItems: number;
    label?: string;
    initialIndex?: number;
    setState: React.Dispatch<React.SetStateAction<number>>;
    padNumbersWithZero?: boolean;
    styles: ReturnType<typeof generateStyles>;
}

const DurationScroll = ({
    numberOfItems,
    label,
    initialIndex = 0,
    setState,
    padNumbersWithZero,
    styles,
}: DurationScrollProps): React.ReactElement => {
    const flatListRef = useRef<FlatList | null>(null);

    const data = generateNumbers(numberOfItems, {
        padWithZero: padNumbersWithZero,
    });

    const renderItem = ({ item }: { item: string }) => (
        <View key={item} style={styles.item}>
            <Text style={styles.number}>{item}</Text>
        </View>
    );

    return (
        <View style={{ height: styles.item.height * 3, overflow: "hidden" }}>
            <FlatList
                ref={flatListRef}
                data={[...data, ...data, ...data]}
                pagingEnabled
                getItemLayout={(_, index) => ({
                    length: styles.item.height,
                    offset: styles.item.height * index,
                    index,
                })}
                initialScrollIndex={initialIndex}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={16}
                snapToInterval={styles.item.height}
                onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(
                        (e.nativeEvent.contentOffset.y) /
                            styles.item.height
                    );
                    setState(newIndex);
                }}
            />
            <Text style={styles.label}>{label}</Text>
            <LinearGradient
                colors={[styles.container.backgroundColor, "transparent"]}
                start={{ x: 1, y: 0.3 }}
                end={{ x: 1, y: 1 }}
                style={[overlayStyles.overlay, { top: 0 }]}
            />
            <LinearGradient
                colors={["transparent", styles.container.backgroundColor]}
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
