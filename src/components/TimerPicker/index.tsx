import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import DurationScroll from "./DurationScroll";

import { generateStyles, CustomTimerPickerStyles } from "./TimerPicker.styles";

export interface TimerPickerProps {
    onDurationChange?: (duration: {
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
    hourLabel?: string;
    minuteLabel?: string;
    secondLabel?: string;
    padWithNItems?: number;
    disableInfiniteScroll?: boolean;
    pickerContainerProps?: React.ComponentProps<typeof View>;
    pickerGradientOverlayProps?: React.ComponentProps<typeof LinearGradient>;
    styles?: CustomTimerPickerStyles;
}

const TimerPicker = ({
    onDurationChange,
    initialHours = 0,
    initialMinutes = 0,
    initialSeconds = 0,
    hideHours = false,
    hideMinutes = false,
    hideSeconds = false,
    hourLabel = "h",
    minuteLabel = "m",
    secondLabel = "s",
    padWithNItems = 1,
    disableInfiniteScroll = false,
    pickerContainerProps,
    pickerGradientOverlayProps,
    styles: customStyles,
}: TimerPickerProps): React.ReactElement => {
    const checkedPadWithNItems =
        padWithNItems >= 0 ? Math.round(padWithNItems) : 0;

    const styles = generateStyles(customStyles, {
        padWithNItems: checkedPadWithNItems,
    });

    const [selectedHours, setSelectedHours] = useState(initialHours);
    const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);
    const [selectedSeconds, setSelectedSeconds] = useState(initialSeconds);

    useEffect(() => {
        onDurationChange?.({
            hours: selectedHours,
            minutes: selectedMinutes,
            seconds: selectedSeconds,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedHours, selectedMinutes, selectedSeconds]);

    return (
        <View {...pickerContainerProps} style={styles.pickerContainer}>
            {!hideHours ? (
                <DurationScroll
                    numberOfItems={23}
                    label={hourLabel}
                    initialIndex={initialHours}
                    onDurationChange={setSelectedHours}
                    pickerGradientOverlayProps={pickerGradientOverlayProps}
                    disableInfiniteScroll={disableInfiniteScroll}
                    padWithNItems={checkedPadWithNItems}
                    styles={styles}
                />
            ) : null}
            {!hideMinutes ? (
                <DurationScroll
                    numberOfItems={59}
                    label={minuteLabel}
                    initialIndex={initialMinutes}
                    onDurationChange={setSelectedMinutes}
                    padNumbersWithZero
                    pickerGradientOverlayProps={pickerGradientOverlayProps}
                    disableInfiniteScroll={disableInfiniteScroll}
                    padWithNItems={checkedPadWithNItems}
                    styles={styles}
                />
            ) : null}
            {!hideSeconds ? (
                <DurationScroll
                    numberOfItems={59}
                    label={secondLabel}
                    initialIndex={initialSeconds}
                    onDurationChange={setSelectedSeconds}
                    padNumbersWithZero
                    pickerGradientOverlayProps={pickerGradientOverlayProps}
                    disableInfiniteScroll={disableInfiniteScroll}
                    padWithNItems={checkedPadWithNItems}
                    styles={styles}
                />
            ) : null}
        </View>
    );
};

export default TimerPicker;
