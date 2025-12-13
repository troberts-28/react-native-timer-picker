import React from "react";

import { View, Text } from "react-native";

import type { generateStyles } from "../TimerPicker/styles";

interface PickerItemProps {
    adjustedLimitedMax: number;
    adjustedLimitedMin: number;
    allowFontScaling: boolean;
    amLabel?: string;
    is12HourPicker?: boolean;
    item: string;
    pmLabel?: string;
    styles: ReturnType<typeof generateStyles>;
}

const PickerItem = React.memo<PickerItemProps>(
    ({
        adjustedLimitedMax,
        adjustedLimitedMin,
        allowFontScaling,
        amLabel,
        is12HourPicker,
        item,
        pmLabel,
        styles,
    }) => {
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
                        intItem > adjustedLimitedMax ||
                        intItem < adjustedLimitedMin
                            ? styles.disabledPickerItem
                            : {},
                    ]}>
                    {stringItem}
                </Text>
                {is12HourPicker && (
                    <View style={styles.pickerAmPmContainer}>
                        <Text
                            allowFontScaling={allowFontScaling}
                            style={styles.pickerAmPmLabel}>
                            {isAm ? amLabel : pmLabel}
                        </Text>
                    </View>
                )}
            </View>
        );
    }
);

export default PickerItem;
