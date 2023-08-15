import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import DurationScroll from "./DurationScroll";

import {
    generateStyles,
    CustomDurationPickerStyles,
} from "./DurationPicker.styles";

export interface DurationPickerProps {
    onValueChange: (value: {
        hours: number;
        minutes: number;
        seconds: number;
    }) => void;
    initialHours?: number;
    initialMinutes?: number;
    initialSeconds?: number;
    hideHours?: boolean;
    hideMinutes?: boolean;
    hideSeconds?: boolean;
    pickerContainerProps?: React.ComponentProps<typeof View>;
    pickerGradientOverlayProps?: React.ComponentProps<typeof LinearGradient>;
    styles?: CustomDurationPickerStyles;
}

const DurationPicker = ({
    onValueChange,
    initialHours = 0,
    initialMinutes = 0,
    initialSeconds = 0,
    hideHours = false,
    hideMinutes = false,
    hideSeconds = false,
    pickerContainerProps,
    pickerGradientOverlayProps,
    styles: customStyles,
}: DurationPickerProps): React.ReactElement => {
    const styles = generateStyles(customStyles);

    const [selectedHours, setSelectedHours] = useState(initialHours);
    const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);
    const [selectedSeconds, setSelectedSeconds] = useState(initialSeconds);

    useEffect(() => {
        onValueChange({
            hours: selectedHours,
            minutes: selectedMinutes,
            seconds: selectedSeconds,
        });
    }, [selectedHours, selectedMinutes, selectedSeconds]);

    return (
        <View {...pickerContainerProps} style={styles.pickerContainer}>
            {!hideHours ? (
                <DurationScroll
                    numberOfItems={23}
                    label="h"
                    initialIndex={initialHours}
                    onValueChange={setSelectedHours}
                    pickerGradientOverlayProps={pickerGradientOverlayProps}
                    styles={styles}
                />
            ) : null}
            {!hideMinutes ? (
                <DurationScroll
                    numberOfItems={59}
                    label="m"
                    initialIndex={initialMinutes}
                    onValueChange={setSelectedMinutes}
                    padNumbersWithZero
                    pickerGradientOverlayProps={pickerGradientOverlayProps}
                    styles={styles}
                />
            ) : null}
            {!hideSeconds ? (
                <DurationScroll
                    numberOfItems={59}
                    label="s"
                    initialIndex={initialSeconds}
                    onValueChange={setSelectedSeconds}
                    padNumbersWithZero
                    pickerGradientOverlayProps={pickerGradientOverlayProps}
                    styles={styles}
                />
            ) : null}
        </View>
    );
};

export default DurationPicker;
