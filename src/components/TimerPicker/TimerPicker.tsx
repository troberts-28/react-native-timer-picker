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
import { isWithinLimit } from "../../utils/isWithinLimit";
import { combineToHour24, splitHour24 } from "../../utils/separateAmPmHour";
import { findNearestValidCycleIdx } from "../../utils/snapSeparateAmPmHour";
import DurationScroll from "../DurationScroll";
import type { DurationScrollRef } from "../DurationScroll";
import { generateStyles } from "./styles";
import type { PerColumnValue, PickerColumn } from "./styles";
import type { TimerPickerProps, TimerPickerRef } from "./types";

const resolvePerColumn = (
  value: PerColumnValue | undefined,
  column: PickerColumn
): number | undefined => {
  if (value == null) {
    return undefined;
  }

  if (typeof value === "number") {
    return value;
  }

  return value[column];
};

const TimerPicker = forwardRef<TimerPickerRef, TimerPickerProps>((props, ref) => {
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
    separateAmPmPicker = false,
    styles: customStyles,
    use12HourPicker = false,
    ...otherProps
  } = props;

  const useSeparateAmPm = use12HourPicker && separateAmPmPicker;

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
    if (customStyles?.labelOffsetPercentage != null) {
      if (customStyles?.pickerLabelGap != null) {
        console.warn(
          "labelOffsetPercentage is ignored when pickerLabelGap is set. Please remove labelOffsetPercentage."
        );
      } else {
        console.warn(
          'The "labelOffsetPercentage" style prop is deprecated and will be removed in a future version. Please use the "pickerLabelGap" style prop instead.'
        );
      }
    }
    if (use12HourPicker && separateAmPmPicker && maximumHours !== 23) {
      console.warn(
        '"maximumHours" is currently ignored when "separateAmPmPicker" is enabled. The hours column always shows the full 12-hour clock cycle (12, 1–11).'
      );
    }
  }, [
    otherProps.Audio,
    otherProps.Haptics,
    otherProps.clickSoundAsset,
    customStyles?.labelOffsetPercentage,
    customStyles?.pickerLabelGap,
    maximumHours,
    separateAmPmPicker,
    use12HourPicker,
  ]);

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
    [initialValue?.days, initialValue?.hours, initialValue?.minutes, initialValue?.seconds]
  );

  const pickerLabelGap = customStyles?.pickerLabelGap;
  const pickerColumnWidth = customStyles?.pickerColumnWidth;

  const styles = useMemo(
    () => generateStyles(customStyles),

    [customStyles]
  );

  const initialHourSplit = useMemo(
    () => splitHour24(safeInitialValue.hours),
    [safeInitialValue.hours]
  );

  const [selectedDays, setSelectedDays] = useState(safeInitialValue.days);
  const [selectedHours, setSelectedHours] = useState(
    useSeparateAmPm ? initialHourSplit.cycleIdx : safeInitialValue.hours
  );
  const [selectedAmPm, setSelectedAmPm] = useState<number>(initialHourSplit.amPm);
  const [selectedMinutes, setSelectedMinutes] = useState(safeInitialValue.minutes);
  const [selectedSeconds, setSelectedSeconds] = useState(safeInitialValue.seconds);

  useEffect(() => {
    const hours = useSeparateAmPm ? combineToHour24(selectedHours, selectedAmPm) : selectedHours;
    onDurationChange?.({
      days: selectedDays,
      hours,
      minutes: selectedMinutes,
      seconds: selectedSeconds,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays, selectedHours, selectedAmPm, selectedMinutes, selectedSeconds]);

  const daysDurationScrollRef = useRef<DurationScrollRef>(null);
  const hoursDurationScrollRef = useRef<DurationScrollRef>(null);
  const amPmDurationScrollRef = useRef<DurationScrollRef>(null);
  const minutesDurationScrollRef = useRef<DurationScrollRef>(null);
  const secondsDurationScrollRef = useRef<DurationScrollRef>(null);

  // In separateAmPmPicker mode the hour column's snap and greying both depend on the
  // currently selected AM/PM. These callbacks fold the cross-column context in;
  // DurationScroll uses `getValidValue` for momentum-scroll snapping and `isItemDisabled`
  // for per-row greying via PickerItem.
  const getValidHourCycleIdx = (rawCycleIdx: number) =>
    findNearestValidCycleIdx(rawCycleIdx, selectedAmPm, hourLimit, hourInterval);

  const isHourCycleDisabled = (cycleIdx: number) => {
    if (!hourLimit || (hourLimit.min === undefined && hourLimit.max === undefined)) {
      return false;
    }
    return !isWithinLimit(
      combineToHour24(cycleIdx, selectedAmPm),
      hourLimit.min ?? 0,
      hourLimit.max ?? 23
    );
  };

  // In separateAmPmPicker mode the public `latestDuration.hours` must combine the cycle
  // index and the AM/PM flag back into a 24-hour value.
  const combinedHoursLatestDuration = useMemo<{ readonly current: number }>(
    () => ({
      get current() {
        const cycleIdx = hoursDurationScrollRef.current?.latestDuration.current ?? 0;
        const amPm = amPmDurationScrollRef.current?.latestDuration.current ?? 0;
        return combineToHour24(cycleIdx, amPm);
      },
    }),
    []
  );

  useImperativeHandle(ref, () => ({
    latestDuration: {
      days: daysDurationScrollRef.current?.latestDuration,
      hours: useSeparateAmPm
        ? combinedHoursLatestDuration
        : hoursDurationScrollRef.current?.latestDuration,
      minutes: minutesDurationScrollRef.current?.latestDuration,
      seconds: secondsDurationScrollRef.current?.latestDuration,
    },
    reset: (options) => {
      setSelectedDays(safeInitialValue.days);
      if (useSeparateAmPm) {
        setSelectedHours(initialHourSplit.cycleIdx);
        setSelectedAmPm(initialHourSplit.amPm);
      } else {
        setSelectedHours(safeInitialValue.hours);
      }
      setSelectedMinutes(safeInitialValue.minutes);
      setSelectedSeconds(safeInitialValue.seconds);
      daysDurationScrollRef.current?.reset(options);
      hoursDurationScrollRef.current?.reset(options);
      amPmDurationScrollRef.current?.reset(options);
      minutesDurationScrollRef.current?.reset(options);
      secondsDurationScrollRef.current?.reset(options);
    },
    setValue: (value, options) => {
      if (value.days !== undefined) {
        setSelectedDays(value.days);
        daysDurationScrollRef.current?.setValue(value.days, options);
      }
      if (value.hours !== undefined) {
        if (useSeparateAmPm) {
          const split = splitHour24(value.hours);
          setSelectedHours(split.cycleIdx);
          setSelectedAmPm(split.amPm);
          hoursDurationScrollRef.current?.setValue(split.cycleIdx, options);
          amPmDurationScrollRef.current?.setValue(split.amPm, options);
        } else {
          setSelectedHours(value.hours);
          hoursDurationScrollRef.current?.setValue(value.hours, options);
        }
      }
      if (value.minutes !== undefined) {
        setSelectedMinutes(value.minutes);
        minutesDurationScrollRef.current?.setValue(value.minutes, options);
      }
      if (value.seconds !== undefined) {
        setSelectedSeconds(value.seconds);
        secondsDurationScrollRef.current?.setValue(value.seconds, options);
      }
    },
  }));

  return (
    <View {...pickerContainerProps} style={styles.pickerContainer} testID="timer-picker">
      {!hideDays ? (
        <DurationScroll
          ref={daysDurationScrollRef}
          aggressivelyGetLatestDuration={aggressivelyGetLatestDuration}
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
          pickerColumnWidth={resolvePerColumn(pickerColumnWidth, "days")}
          pickerLabelGap={resolvePerColumn(pickerLabelGap, "days")}
          repeatNumbersNTimes={repeatDayNumbersNTimes}
          repeatNumbersNTimesNotExplicitlySet={props?.repeatDayNumbersNTimes === undefined}
          selectedValue={selectedDays}
          styles={styles}
          testID="duration-scroll-day"
          {...otherProps}
        />
      ) : null}
      {!hideHours ? (
        <DurationScroll
          ref={hoursDurationScrollRef}
          aggressivelyGetLatestDuration={aggressivelyGetLatestDuration}
          allowFontScaling={allowFontScaling}
          amLabel={amLabel}
          decelerationRate={decelerationRate}
          disableInfiniteScroll={disableInfiniteScroll}
          getValidValue={useSeparateAmPm ? getValidHourCycleIdx : undefined}
          initialValue={useSeparateAmPm ? initialHourSplit.cycleIdx : safeInitialValue.hours}
          interval={hourInterval}
          is12HourPicker={use12HourPicker}
          isDisabled={hoursPickerIsDisabled}
          isItemDisabled={useSeparateAmPm ? isHourCycleDisabled : undefined}
          label={hourLabel ?? (!use12HourPicker ? "h" : undefined)}
          limit={useSeparateAmPm ? undefined : hourLimit}
          maximumValue={useSeparateAmPm ? 11 : maximumHours}
          onDurationChange={setSelectedHours}
          padNumbersWithZero={padHoursWithZero}
          padWithNItems={safePadWithNItems}
          pickerColumnWidth={resolvePerColumn(pickerColumnWidth, "hours")}
          pickerLabelGap={resolvePerColumn(pickerLabelGap, "hours")}
          pmLabel={pmLabel}
          repeatNumbersNTimes={repeatHourNumbersNTimes}
          repeatNumbersNTimesNotExplicitlySet={props?.repeatHourNumbersNTimes === undefined}
          selectedValue={selectedHours}
          separateAmPmPicker={separateAmPmPicker}
          styles={styles}
          testID="duration-scroll-hour"
          {...otherProps}
        />
      ) : null}
      {!hideMinutes ? (
        <DurationScroll
          ref={minutesDurationScrollRef}
          aggressivelyGetLatestDuration={aggressivelyGetLatestDuration}
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
          pickerColumnWidth={resolvePerColumn(pickerColumnWidth, "minutes")}
          pickerLabelGap={resolvePerColumn(pickerLabelGap, "minutes")}
          repeatNumbersNTimes={repeatMinuteNumbersNTimes}
          repeatNumbersNTimesNotExplicitlySet={props?.repeatMinuteNumbersNTimes === undefined}
          selectedValue={selectedMinutes}
          styles={styles}
          testID="duration-scroll-minute"
          {...otherProps}
        />
      ) : null}
      {!hideSeconds ? (
        <DurationScroll
          ref={secondsDurationScrollRef}
          aggressivelyGetLatestDuration={aggressivelyGetLatestDuration}
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
          pickerColumnWidth={resolvePerColumn(pickerColumnWidth, "seconds")}
          pickerLabelGap={resolvePerColumn(pickerLabelGap, "seconds")}
          repeatNumbersNTimes={repeatSecondNumbersNTimes}
          repeatNumbersNTimesNotExplicitlySet={props?.repeatSecondNumbersNTimes === undefined}
          selectedValue={selectedSeconds}
          styles={styles}
          testID="duration-scroll-second"
          {...otherProps}
        />
      ) : null}
      {useSeparateAmPm ? (
        <DurationScroll
          ref={amPmDurationScrollRef}
          aggressivelyGetLatestDuration={aggressivelyGetLatestDuration}
          allowFontScaling={allowFontScaling}
          amLabel={amLabel}
          decelerationRate={decelerationRate}
          disableInfiniteScroll
          initialValue={initialHourSplit.amPm}
          interval={1}
          isAmPmPicker
          isDisabled={hoursPickerIsDisabled}
          maximumValue={1}
          onDurationChange={setSelectedAmPm}
          padWithNItems={safePadWithNItems}
          pickerColumnWidth={resolvePerColumn(pickerColumnWidth, "amPm")}
          pmLabel={pmLabel}
          repeatNumbersNTimes={1}
          repeatNumbersNTimesNotExplicitlySet={false}
          selectedValue={selectedAmPm}
          styles={styles}
          testID="duration-scroll-am-pm"
          {...otherProps}
        />
      ) : null}
    </View>
  );
});

export default React.memo(TimerPicker);
