import React, { useRef, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    FlatList,
    Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { generateNumbers } from "../utils/generateNumbers";
import { generateStyles } from "./DurationPicker.styles";

interface DurationScrollProps {
    numberOfItems: number;
    setState: React.Dispatch<React.SetStateAction<number>>;
    styles: ReturnType<typeof generateStyles>;
}

const { height: screenHeight } = Dimensions.get("window");

const DurationScroll = ({
    numberOfItems,
    setState,
    styles,
}: DurationScrollProps): React.ReactElement => {
    const flatListRef = useRef<FlatList | null>(null);

    const data = generateNumbers(numberOfItems);

    const renderItem = ({ item }: { item: number }) => (
        <View key={item} style={styles.item}>
            <Text style={styles.number}>{item}</Text>
        </View>
    );

    return (
        <View style={{ height: styles.item.height * 3, overflow: "hidden" }}>
            <FlatList
                ref={flatListRef}
                data={[...data, ...data, ...data]}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={styles.item.height}
            />
            <LinearGradient
                colors={["white", "transparent"]}
                start={{ x: 1, y: 0.3 }}
                end={{ x: 1, y: 1 }}
                style={[overlayStyles.overlay, { top: 0 }]}
            />
            <LinearGradient
                colors={["transparent", "white"]}
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
