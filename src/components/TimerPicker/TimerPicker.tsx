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
import { padNumber } from "../../utils/padNumber";
import { useScreenReaderEnabled } from "../../utils/useScreenReaderEnabled";
import DurationScroll from "../DurationScroll";
import type { DurationScrollRef } from "../DurationScroll";

import { generateStyles } from "./styles";
import type { TimerPickerProps, TimerPickerRef } from "./types";

const TimerPicker = forwardRef<TimerPickerRef, TimerPickerProps>(
    (props, ref) => {
        const {
            accessibilityLabel,
            accessibilityLabels,
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

        const isScreenReaderEnabled = useScreenReaderEnabled();

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

        // Format functions for accessibility announcements
        const formatDayValue = (value: number) =>
            padDaysWithZero ? padNumber(value) : String(value);

        const formatHourValue = (value: number) => {
            if (use12HourPicker) {
                const hour12 =
                    value === 0 ? 12 : value > 12 ? value - 12 : value;
                const period = value < 12 ? amLabel : pmLabel;
                return padHoursWithZero
                    ? `${padNumber(hour12)} ${period}`
                    : `${hour12} ${period}`;
            }
            return padHoursWithZero ? padNumber(value) : String(value);
        };

        const formatMinuteValue = (value: number) =>
            padMinutesWithZero ? padNumber(value) : String(value);

        const formatSecondValue = (value: number) =>
            padSecondsWithZero ? padNumber(value) : String(value);

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
                accessible={isScreenReaderEnabled ? false : undefined}
                style={styles.pickerContainer}
                testID="timer-picker">
                {!hideDays ? (
                    <DurationScroll
                        ref={daysDurationScrollRef}
                        accessibilityHint={accessibilityLabels?.hint}
                        accessibilityLabel={accessibilityLabels?.days ?? "Days"}
                        aggressivelyGetLatestDuration={
                            aggressivelyGetLatestDuration
                        }
                        allowFontScaling={allowFontScaling}
                        disableInfiniteScroll={disableInfiniteScroll}
                        formatValue={formatDayValue}
                        initialValue={safeInitialValue.days}
                        interval={dayInterval}
                        isDisabled={daysPickerIsDisabled}
                        isScreenReaderEnabled={isScreenReaderEnabled}
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
                        accessibilityHint={accessibilityLabels?.hint}
                        accessibilityLabel={
                            accessibilityLabels?.hours ?? "Hours"
                        }
                        aggressivelyGetLatestDuration={
                            aggressivelyGetLatestDuration
                        }
                        allowFontScaling={allowFontScaling}
                        amLabel={amLabel}
                        decelerationRate={decelerationRate}
                        disableInfiniteScroll={disableInfiniteScroll}
                        formatValue={formatHourValue}
                        initialValue={safeInitialValue.hours}
                        interval={hourInterval}
                        is12HourPicker={use12HourPicker}
                        isDisabled={hoursPickerIsDisabled}
                        isScreenReaderEnabled={isScreenReaderEnabled}
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
                        accessibilityHint={accessibilityLabels?.hint}
                        accessibilityLabel={
                            accessibilityLabels?.minutes ?? "Minutes"
                        }
                        aggressivelyGetLatestDuration={
                            aggressivelyGetLatestDuration
                        }
                        allowFontScaling={allowFontScaling}
                        decelerationRate={decelerationRate}
                        disableInfiniteScroll={disableInfiniteScroll}
                        formatValue={formatMinuteValue}
                        initialValue={safeInitialValue.minutes}
                        interval={minuteInterval}
                        isDisabled={minutesPickerIsDisabled}
                        isScreenReaderEnabled={isScreenReaderEnabled}
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
                        accessibilityHint={accessibilityLabels?.hint}
                        accessibilityLabel={
                            accessibilityLabels?.seconds ?? "Seconds"
                        }
                        aggressivelyGetLatestDuration={
                            aggressivelyGetLatestDuration
                        }
                        allowFontScaling={allowFontScaling}
                        decelerationRate={decelerationRate}
                        disableInfiniteScroll={disableInfiniteScroll}
                        formatValue={formatSecondValue}
                        initialValue={safeInitialValue.seconds}
                        interval={secondInterval}
                        isDisabled={secondsPickerIsDisabled}
                        isScreenReaderEnabled={isScreenReaderEnabled}
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
