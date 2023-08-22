import React, { useEffect, useState } from "react";
import { View } from "react-native";

import DurationScroll, { LimitType } from "./DurationScroll";

import { generateStyles, CustomTimerPickerStyles } from "./TimerPicker.styles";
import { LinearGradientProps } from "./DurationScroll";

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
    hourLimit?: LimitType;
    minuteLimit?: LimitType;
    secondLimit?: LimitType;
    hourLabel?: string | React.ReactElement;
    minuteLabel?: string | React.ReactElement;
    secondLabel?: string | React.ReactElement;
    padWithNItems?: number;
    disableInfiniteScroll?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LinearGradient?: any;
    pickerContainerProps?: React.ComponentProps<typeof View>;
    pickerGradientOverlayProps?: LinearGradientProps;
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
    hourLimit,
    minuteLimit,
    secondLimit,
    hourLabel = "h",
    minuteLabel = "m",
    secondLabel = "s",
    padWithNItems = 1,
    disableInfiniteScroll = false,
    LinearGradient,
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
        <View
            {...pickerContainerProps}
            style={styles.pickerContainer}
            testID="timer-picker">
            {!hideHours ? (
                <DurationScroll
                    numberOfItems={23}
                    label={hourLabel}
                    initialIndex={initialHours}
                    onDurationChange={setSelectedHours}
                    pickerGradientOverlayProps={pickerGradientOverlayProps}
                    disableInfiniteScroll={disableInfiniteScroll}
                    padWithNItems={checkedPadWithNItems}
                    limit={hourLimit}
                    LinearGradient={LinearGradient}
                    styles={styles}
                    testID="duration-scroll-hour"
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
                    limit={minuteLimit}
                    LinearGradient={LinearGradient}
                    styles={styles}
                    testID="duration-scroll-minute"
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
                    limit={secondLimit}
                    LinearGradient={LinearGradient}
                    styles={styles}
                    testID="duration-scroll-second"
                />
            ) : null}
        </View>
    );
};

export default TimerPicker;
