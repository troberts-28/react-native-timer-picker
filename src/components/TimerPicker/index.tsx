import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";

import { View } from "react-native";

import { getSafeInitialValue } from "../../utils/getSafeInitialValue";
import DurationScroll from "../DurationScroll";
import type { DurationScrollRef } from "../DurationScroll/types";

import { generateStyles } from "./styles";
import type { TimerPickerProps, TimerPickerRef } from "./types";

const TimerPicker = forwardRef<TimerPickerRef, TimerPickerProps>(
    (props, ref) => {
        const {
            aggressivelyGetLatestDuration = false,
            allowFontScaling = false,
            amLabel = "am",
            disableInfiniteScroll = false,
            hideHours = false,
            hideMinutes = false,
            hideSeconds = false,
            hourInterval = 1,
            hourLabel,
            hourLimit,
            hoursPickerIsDisabled = false,
            initialValue,
            maximumHours = 23,
            maximumMinutes = 59,
            maximumSeconds = 59,
            minuteInterval = 1,
            minuteLabel,
            minuteLimit,
            minutesPickerIsDisabled = false,
            onDurationChange,
            padHoursWithZero = false,
            padMinutesWithZero = true,
            padSecondsWithZero = true,
            padWithNItems = 1,
            pickerContainerProps,
            pmLabel = "pm",
            repeatHourNumbersNTimes = 8,
            repeatMinuteNumbersNTimes = 3,
            repeatSecondNumbersNTimes = 3,
            secondInterval = 1,
            secondLabel,
            secondLimit,
            secondsPickerIsDisabled = false,
            styles: customStyles,
            use12HourPicker = false,
            ...otherProps
        } = props;

        const safePadWithNItems = useMemo(() => {
            if (padWithNItems < 0 || isNaN(padWithNItems)) {
                return 0;
            }

            const maxPadWithNItems = hideHours ? 15 : 6;

            if (padWithNItems > maxPadWithNItems) {
                return maxPadWithNItems;
            }

            return Math.round(padWithNItems);
        }, [hideHours, padWithNItems]);

        const safeInitialValue = useMemo(
            () =>
                getSafeInitialValue({
                    hours: initialValue?.hours,
                    minutes: initialValue?.minutes,
                    seconds: initialValue?.seconds,
                }),
            [initialValue?.hours, initialValue?.minutes, initialValue?.seconds]
        );

        const styles = useMemo(
            () =>
                generateStyles(customStyles, {
                    padWithNItems: safePadWithNItems,
                }),

            [safePadWithNItems, customStyles]
        );

        const [selectedHours, setSelectedHours] = useState(
            safeInitialValue.hours
        );
        const [selectedMinutes, setSelectedMinutes] = useState(
            safeInitialValue.minutes
        );
        const [selectedSeconds, setSelectedSeconds] = useState(
            safeInitialValue.seconds
        );

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
                setSelectedHours(safeInitialValue.hours);
                setSelectedMinutes(safeInitialValue.minutes);
                setSelectedSeconds(safeInitialValue.seconds);
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
                        aggressivelyGetLatestDuration={
                            aggressivelyGetLatestDuration
                        }
                        allowFontScaling={allowFontScaling}
                        amLabel={amLabel}
                        disableInfiniteScroll={disableInfiniteScroll}
                        initialValue={safeInitialValue.hours}
                        interval={hourInterval}
                        is12HourPicker={use12HourPicker}
                        isDisabled={hoursPickerIsDisabled}
                        label={
                            hourLabel ?? (!use12HourPicker ? "h" : undefined)
                        }
                        limit={hourLimit}
                        maximumValue={maximumHours}
                        onDurationChange={setSelectedHours}
                        padNumbersWithZero={padHoursWithZero}
                        padWithNItems={safePadWithNItems}
                        pmLabel={pmLabel}
                        repeatNumbersNTimes={repeatHourNumbersNTimes}
                        repeatNumbersNTimesNotExplicitlySet={
                            props?.repeatHourNumbersNTimes === undefined
                        }
                        styles={styles}
                        testID="duration-scroll-hour"
                        {...otherProps}
                    />
                ) : null}
                {!hideMinutes ? (
                    <DurationScroll
                        ref={minutesDurationScrollRef}
                        aggressivelyGetLatestDuration={
                            aggressivelyGetLatestDuration
                        }
                        allowFontScaling={allowFontScaling}
                        disableInfiniteScroll={disableInfiniteScroll}
                        initialValue={safeInitialValue.minutes}
                        interval={minuteInterval}
                        isDisabled={minutesPickerIsDisabled}
                        label={minuteLabel ?? "m"}
                        limit={minuteLimit}
                        maximumValue={maximumMinutes}
                        onDurationChange={setSelectedMinutes}
                        padNumbersWithZero={padMinutesWithZero}
                        padWithNItems={safePadWithNItems}
                        repeatNumbersNTimes={repeatMinuteNumbersNTimes}
                        repeatNumbersNTimesNotExplicitlySet={
                            props?.repeatMinuteNumbersNTimes === undefined
                        }
                        styles={styles}
                        testID="duration-scroll-minute"
                        {...otherProps}
                    />
                ) : null}
                {!hideSeconds ? (
                    <DurationScroll
                        ref={secondsDurationScrollRef}
                        aggressivelyGetLatestDuration={
                            aggressivelyGetLatestDuration
                        }
                        allowFontScaling={allowFontScaling}
                        disableInfiniteScroll={disableInfiniteScroll}
                        initialValue={safeInitialValue.seconds}
                        interval={secondInterval}
                        isDisabled={secondsPickerIsDisabled}
                        label={secondLabel ?? "s"}
                        limit={secondLimit}
                        maximumValue={maximumSeconds}
                        onDurationChange={setSelectedSeconds}
                        padNumbersWithZero={padSecondsWithZero}
                        padWithNItems={safePadWithNItems}
                        repeatNumbersNTimes={repeatSecondNumbersNTimes}
                        repeatNumbersNTimesNotExplicitlySet={
                            props?.repeatSecondNumbersNTimes === undefined
                        }
                        styles={styles}
                        testID="duration-scroll-second"
                        {...otherProps}
                    />
                ) : null}
            </View>
        );
    }
);

export default React.memo(TimerPicker);
