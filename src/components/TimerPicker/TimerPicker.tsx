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
import type { DurationScrollRef } from "../DurationScroll";

import { generateStyles } from "./styles";
import type { TimerPickerProps, TimerPickerRef } from "./types";

const TimerPicker = forwardRef<TimerPickerRef, TimerPickerProps>(
    (props, ref) => {
        const {
            aggressivelyGetLatestDuration = false,
            allowFontScaling = false,
            amLabel = "am",
            dayInterval = 1,
            dayLabel,
            dayLimit,
            daysPickerIsDisabled = false,
            decelerationRate = 0.88,
            disableInfiniteScroll = false,
            hideDays = true,
            hideHours = false,
            hideMinutes = false,
            hideSeconds = false,
            hourInterval = 1,
            hourLabel,
            hourLimit,
            hoursPickerIsDisabled = false,
            initialValue,
            maximumDays = 30,
            maximumHours = 23,
            maximumMinutes = 59,
            maximumSeconds = 59,
            minuteInterval = 1,
            minuteLabel,
            minuteLimit,
            minutesPickerIsDisabled = false,
            onDurationChange,
            padDaysWithZero = false,
            padHoursWithZero = false,
            padMinutesWithZero = true,
            padSecondsWithZero = true,
            padWithNItems = 1,
            pickerContainerProps,
            pmLabel = "pm",
            repeatDayNumbersNTimes = 3,
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

        useEffect(() => {
            if (otherProps.Audio) {
                console.warn(
                    'The "Audio" prop is deprecated and will be removed in a future version. Please use the "pickerFeedback" prop instead.'
                );
            }
            if (otherProps.Haptics) {
                console.warn(
                    'The "Haptics" prop is deprecated and will be removed in a future version. Please use the "pickerFeedback" prop instead.'
                );
            }
            if (otherProps.clickSoundAsset) {
                console.warn(
                    'The "clickSoundAsset" prop is deprecated and will be removed in a future version. Please use the "pickerFeedback" prop instead.'
                );
            }
        }, [otherProps.Audio, otherProps.Haptics, otherProps.clickSoundAsset]);

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
                    days: initialValue?.days,
                    hours: initialValue?.hours,
                    minutes: initialValue?.minutes,
                    seconds: initialValue?.seconds,
                }),
            [
                initialValue?.days,
                initialValue?.hours,
                initialValue?.minutes,
                initialValue?.seconds,
            ]
        );

        const styles = useMemo(
            () => generateStyles(customStyles),

            [customStyles]
        );

        const [selectedDays, setSelectedDays] = useState(safeInitialValue.days);
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
                days: selectedDays,
                hours: selectedHours,
                minutes: selectedMinutes,
                seconds: selectedSeconds,
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selectedDays, selectedHours, selectedMinutes, selectedSeconds]);

        const daysDurationScrollRef = useRef<DurationScrollRef>(null);
        const hoursDurationScrollRef = useRef<DurationScrollRef>(null);
        const minutesDurationScrollRef = useRef<DurationScrollRef>(null);
        const secondsDurationScrollRef = useRef<DurationScrollRef>(null);

        useImperativeHandle(ref, () => ({
            reset: (options) => {
                setSelectedDays(safeInitialValue.days);
                setSelectedHours(safeInitialValue.hours);
                setSelectedMinutes(safeInitialValue.minutes);
                setSelectedSeconds(safeInitialValue.seconds);
                daysDurationScrollRef.current?.reset(options);
                hoursDurationScrollRef.current?.reset(options);
                minutesDurationScrollRef.current?.reset(options);
                secondsDurationScrollRef.current?.reset(options);
            },
            setValue: (value, options) => {
                if (value.days !== undefined) {
                    setSelectedDays(value.days);
                    daysDurationScrollRef.current?.setValue(
                        value.days,
                        options
                    );
                }
                if (value.hours !== undefined) {
                    setSelectedHours(value.hours);
                    hoursDurationScrollRef.current?.setValue(
                        value.hours,
                        options
                    );
                }
                if (value.minutes !== undefined) {
                    setSelectedMinutes(value.minutes);
                    minutesDurationScrollRef.current?.setValue(
                        value.minutes,
                        options
                    );
                }
                if (value.seconds !== undefined) {
                    setSelectedSeconds(value.seconds);
                    secondsDurationScrollRef.current?.setValue(
                        value.seconds,
                        options
                    );
                }
            },
            latestDuration: {
                days: daysDurationScrollRef.current?.latestDuration,
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
                {!hideDays ? (
                    <DurationScroll
                        ref={daysDurationScrollRef}
                        aggressivelyGetLatestDuration={
                            aggressivelyGetLatestDuration
                        }
                        allowFontScaling={allowFontScaling}
                        disableInfiniteScroll={disableInfiniteScroll}
                        initialValue={safeInitialValue.days}
                        interval={dayInterval}
                        isDisabled={daysPickerIsDisabled}
                        label={dayLabel ?? "d"}
                        limit={dayLimit}
                        maximumValue={maximumDays}
                        onDurationChange={setSelectedDays}
                        padNumbersWithZero={padDaysWithZero}
                        padWithNItems={safePadWithNItems}
                        repeatNumbersNTimes={repeatDayNumbersNTimes}
                        repeatNumbersNTimesNotExplicitlySet={
                            props?.repeatDayNumbersNTimes === undefined
                        }
                        selectedValue={selectedDays}
                        styles={styles}
                        testID="duration-scroll-day"
                        {...otherProps}
                    />
                ) : null}
                {!hideHours ? (
                    <DurationScroll
                        ref={hoursDurationScrollRef}
                        aggressivelyGetLatestDuration={
                            aggressivelyGetLatestDuration
                        }
                        allowFontScaling={allowFontScaling}
                        amLabel={amLabel}
                        decelerationRate={decelerationRate}
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
                        selectedValue={selectedHours}
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
                        decelerationRate={decelerationRate}
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
                        selectedValue={selectedMinutes}
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
                        decelerationRate={decelerationRate}
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
                        selectedValue={selectedSeconds}
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
