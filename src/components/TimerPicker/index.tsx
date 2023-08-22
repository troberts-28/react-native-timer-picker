import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { View } from "react-native";

import DurationScroll, { DurationScrollRef, LimitType } from "./DurationScroll";

import { generateStyles, CustomTimerPickerStyles } from "./TimerPicker.styles";
import { LinearGradientProps } from "./DurationScroll";

export interface TimerPickerRef {
    reset: () => void;
    setValue: (value: {
        hours: number;
        minutes: number;
        seconds: number;
    }) => void;
}

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

const TimerPicker = forwardRef<TimerPickerRef, TimerPickerProps>(
    (
        {
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
        },
        ref
    ): React.ReactElement => {
        const checkedPadWithNItems =
            padWithNItems >= 0 ? Math.round(padWithNItems) : 0;

        const styles = useMemo(
            () =>
                generateStyles(customStyles, {
                    padWithNItems: checkedPadWithNItems,
                }),

            [checkedPadWithNItems, customStyles]
        );

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

        const hoursDurationScrollRef = useRef<DurationScrollRef>(null);
        const minutesDurationScrollRef = useRef<DurationScrollRef>(null);
        const secondsDurationScrollRef = useRef<DurationScrollRef>(null);

        useImperativeHandle(ref, () => ({
            reset: () => {
                setSelectedHours(initialHours);
                setSelectedMinutes(initialMinutes);
                setSelectedSeconds(initialSeconds);
                hoursDurationScrollRef.current?.reset();
                minutesDurationScrollRef.current?.reset();
                secondsDurationScrollRef.current?.reset();
            },
            setValue: (value) => {
                setSelectedHours(value.hours);
                setSelectedMinutes(value.minutes);
                setSelectedSeconds(value.seconds);
                hoursDurationScrollRef.current?.setValue(value.hours);
                minutesDurationScrollRef.current?.setValue(value.minutes);
                secondsDurationScrollRef.current?.setValue(value.seconds);
            },
        }));

        return (
            <View
                {...pickerContainerProps}
                style={styles.pickerContainer}
                testID="timer-picker">
                {!hideHours ? (
                    <DurationScroll
                        ref={hoursDurationScrollRef}
                        numberOfItems={23}
                        label={hourLabel}
                        initialValue={initialHours}
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
                        ref={minutesDurationScrollRef}
                        numberOfItems={59}
                        label={minuteLabel}
                        initialValue={initialMinutes}
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
                        ref={secondsDurationScrollRef}
                        numberOfItems={59}
                        label={secondLabel}
                        initialValue={initialSeconds}
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
    }
);

export default React.memo(TimerPicker);
