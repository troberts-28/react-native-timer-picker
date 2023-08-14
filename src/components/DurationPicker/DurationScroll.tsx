import React from "react";
import { View, Text, ScrollView } from "react-native";

import { generateNumbers } from "../utils/generateNumbers";

import { generateStyles } from "./DurationPicker.styles";

interface DurationScrollProps {
    numberOfItems: number;
    setState: React.Dispatch<React.SetStateAction<number>>;
    styles: ReturnType<typeof generateStyles>;
}

const DurationScroll = ({
    numberOfItems,
    setState,
    styles,
}: DurationScrollProps): React.ReactElement => {
    const renderItem = (number: number) => (
        <View key={number} style={styles.item}>
            <Text>{number}</Text>
        </View>
    );

    return (
        <ScrollView
            onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(
                    e.nativeEvent.contentOffset.y / styles.item.height
                );
                setState(newIndex);
            }}
            showsVerticalScrollIndicator={false}
            snapToInterval={styles.item.height}>
            {generateNumbers(numberOfItems).map(renderItem)}
        </ScrollView>
    );
};

export default DurationScroll;
