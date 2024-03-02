import React, {
    MutableRefObject,
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
    reset: (options?: { animated?: boolean }) => void;
    setValue: (
        value: {
            hours: number;
            minutes: number;
            seconds: number;
        },
        options?: { animated?: boolean }
    ) => void;
    latestDuration: {
        hours: MutableRefObject<number> | undefined;
        minutes: MutableRefObject<number> | undefined;
        seconds: MutableRefObject<number> | undefined;
    };
}

export interface TimerPickerProps {
    allowFontScaling?: boolean;
    onDurationChange?: (duration: {
        hours: number;
        minutes: number;
        seconds: number;
    }) => void;
    initialHours?: number;
    initialMinutes?: number;
    initialSeconds?: number;
    aggressivelyGetLatestDuration?: boolean;
    use12HourPicker?: boolean;
    amLabel?: string;
    pmLabel?: string;
    hideHours?: boolean;
    hideMinutes?: boolean;
    hideSeconds?: boolean;
    hoursPickerIsDisabled?: boolean;
    minutesPickerIsDisabled?: boolean;
    secondsPickerIsDisabled?: boolean;
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
    pickerGradientOverlayProps?: Partial<LinearGradientProps>;
    topPickerGradientOverlayProps?: Partial<LinearGradientProps>;
    bottomPickerGradientOverlayProps?: Partial<LinearGradientProps>;
    styles?: CustomTimerPickerStyles;
}

const TimerPicker = forwardRef<TimerPickerRef, TimerPickerProps>(
    (
        {
            allowFontScaling = false,
            onDurationChange,
            initialHours = 0,
            initialMinutes = 0,
            initialSeconds = 0,
            hideHours = false,
            hideMinutes = false,
            hideSeconds = false,
            hoursPickerIsDisabled = false,
            minutesPickerIsDisabled = false,
            secondsPickerIsDisabled = false,
            hourLimit,
            minuteLimit,
            secondLimit,
            hourLabel,
            minuteLabel,
            secondLabel,
            padWithNItems = 1,
            disableInfiniteScroll = false,
            aggressivelyGetLatestDuration = false,
            use12HourPicker = false,
            amLabel = "am",
            pmLabel = "pm",
            LinearGradient,
            pickerContainerProps,
            pickerGradientOverlayProps,
            topPickerGradientOverlayProps,
            bottomPickerGradientOverlayProps,
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
            reset: (options) => {
                setSelectedHours(initialHours);
                setSelectedMinutes(initialMinutes);
                setSelectedSeconds(initialSeconds);
                hoursDurationScrollRef.current?.reset(options);
                minutesDurationScrollRef.current?.reset(options);
                secondsDurationScrollRef.current?.reset(options);
            },
            setValue: (value, options) => {
                setSelectedHours(value.hours);
                setSelectedMinutes(value.minutes);
                setSelectedSeconds(value.seconds);
                hoursDurationScrollRef.current?.setValue(value.hours, options);
                minutesDurationScrollRef.current?.setValue(
                    value.minutes,
                    options
                );
                secondsDurationScrollRef.current?.setValue(
                    value.seconds,
                    options
                );
            },
            latestDuration: {
                hours: hoursDurationScrollRef.current?.latestDuration,
                minutes: minutesDurationScrollRef.current?.latestDuration,
                seconds: secondsDurationScrollRef.current?.latestDuration,
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
                        label={
                            hourLabel ?? (!use12HourPicker ? "h" : undefined)
                        }
                        isDisabled={hoursPickerIsDisabled}
                        initialValue={initialHours}
                        allowFontScaling={allowFontScaling}
                        aggressivelyGetLatestDuration={
                            aggressivelyGetLatestDuration
                        }
                        onDurationChange={setSelectedHours}
                        pickerGradientOverlayProps={pickerGradientOverlayProps}
                        topPickerGradientOverlayProps={
                            topPickerGradientOverlayProps
                        }
                        bottomPickerGradientOverlayProps={
                            bottomPickerGradientOverlayProps
                        }
                        disableInfiniteScroll={disableInfiniteScroll}
                        padWithNItems={checkedPadWithNItems}
                        limit={hourLimit}
                        LinearGradient={LinearGradient}
                        is12HourPicker={use12HourPicker}
                        amLabel={amLabel}
                        pmLabel={pmLabel}
                        styles={styles}
                        testID="duration-scroll-hour"
                    />
                ) : null}
                {!hideMinutes ? (
                    <DurationScroll
                        ref={minutesDurationScrollRef}
                        numberOfItems={59}
                        label={minuteLabel ?? "m"}
                        isDisabled={minutesPickerIsDisabled}
                        initialValue={initialMinutes}
                        allowFontScaling={allowFontScaling}
                        aggressivelyGetLatestDuration={
                            aggressivelyGetLatestDuration
                        }
                        onDurationChange={setSelectedMinutes}
                        padNumbersWithZero
                        pickerGradientOverlayProps={pickerGradientOverlayProps}
                        topPickerGradientOverlayProps={
                            topPickerGradientOverlayProps
                        }
                        bottomPickerGradientOverlayProps={
                            bottomPickerGradientOverlayProps
                        }
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
                        label={secondLabel ?? "s"}
                        isDisabled={secondsPickerIsDisabled}
                        initialValue={initialSeconds}
                        allowFontScaling={allowFontScaling}
                        aggressivelyGetLatestDuration={
                            aggressivelyGetLatestDuration
                        }
                        onDurationChange={setSelectedSeconds}
                        padNumbersWithZero
                        pickerGradientOverlayProps={pickerGradientOverlayProps}
                        topPickerGradientOverlayProps={
                            topPickerGradientOverlayProps
                        }
                        bottomPickerGradientOverlayProps={
                            bottomPickerGradientOverlayProps
                        }
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
