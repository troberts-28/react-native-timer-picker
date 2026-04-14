import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { View } from "react-native";

import { getSafeInitialValue } from "../../utils/getSafeInitialValue";
import { useScreenReaderEnabled } from "../../utils/useScreenReaderEnabled";
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

// Pure utility — defined outside the component so it is never recreated on
// render and DurationScroll's memoization is not broken.
const formatAccessibilityValue = (
  value: number,
  unitLabel: string,
  options?: { is12HourPicker?: boolean; amLabel?: string; pmLabel?: string }
): string => {
  if (options?.is12HourPicker) {
    const hour12 = value === 0 ? 12 : value > 12 ? value - 12 : value;
    const period = value < 12 ? (options.amLabel ?? "am") : (options.pmLabel ?? "pm");
    return `${hour12} ${period}`;
  }
  return `${value} ${unitLabel}`;
};

const TimerPicker = forwardRef<TimerPickerRef, TimerPickerProps>((props, ref) => {
  const {
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
  }, [
    otherProps.Audio,
    otherProps.Haptics,
    otherProps.clickSoundAsset,
    customStyles?.labelOffsetPercentage,
    customStyles?.pickerLabelGap,
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

  const [selectedDays, setSelectedDays] = useState(safeInitialValue.days);
  const [selectedHours, setSelectedHours] = useState(safeInitialValue.hours);
  const [selectedMinutes, setSelectedMinutes] = useState(safeInitialValue.minutes);
  const [selectedSeconds, setSelectedSeconds] = useState(safeInitialValue.seconds);

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
    latestDuration: {
      days: daysDurationScrollRef.current?.latestDuration,
      hours: hoursDurationScrollRef.current?.latestDuration,
      minutes: minutesDurationScrollRef.current?.latestDuration,
      seconds: secondsDurationScrollRef.current?.latestDuration,
    },
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
        daysDurationScrollRef.current?.setValue(value.days, options);
      }
      if (value.hours !== undefined) {
        setSelectedHours(value.hours);
        hoursDurationScrollRef.current?.setValue(value.hours, options);
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

  // Accessibility format functions — stable references via useCallback so they
  // don't break DurationScroll's memoization. No zero-padding: screen readers
  // announce "5 hours", not "05 hours".
  const formatDayA11y = useCallback(
    (value: number) => formatAccessibilityValue(value, accessibilityLabels?.days ?? "days"),
    [accessibilityLabels?.days]
  );

  const formatHourA11y = useCallback(
    (value: number) =>
      formatAccessibilityValue(value, accessibilityLabels?.hours ?? "hours", {
        is12HourPicker: use12HourPicker,
        amLabel,
        pmLabel,
      }),
    [accessibilityLabels?.hours, use12HourPicker, amLabel, pmLabel]
  );

  const formatMinuteA11y = useCallback(
    (value: number) =>
      formatAccessibilityValue(value, accessibilityLabels?.minutes ?? "minutes"),
    [accessibilityLabels?.minutes]
  );

  const formatSecondA11y = useCallback(
    (value: number) =>
      formatAccessibilityValue(value, accessibilityLabels?.seconds ?? "seconds"),
    [accessibilityLabels?.seconds]
  );

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
          aggressivelyGetLatestDuration={aggressivelyGetLatestDuration}
          allowFontScaling={allowFontScaling}
          disableInfiniteScroll={disableInfiniteScroll}
          formatValue={formatDayA11y}
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
          accessibilityHint={accessibilityLabels?.hint}
          accessibilityLabel={accessibilityLabels?.hours ?? "Hours"}
          aggressivelyGetLatestDuration={aggressivelyGetLatestDuration}
          allowFontScaling={allowFontScaling}
          amLabel={amLabel}
          decelerationRate={decelerationRate}
          disableInfiniteScroll={disableInfiniteScroll}
          formatValue={formatHourA11y}
          initialValue={safeInitialValue.hours}
          interval={hourInterval}
          is12HourPicker={use12HourPicker}
          isDisabled={hoursPickerIsDisabled}
          isScreenReaderEnabled={isScreenReaderEnabled}
          label={hourLabel ?? (!use12HourPicker ? "h" : undefined)}
          limit={hourLimit}
          maximumValue={maximumHours}
          onDurationChange={setSelectedHours}
          padNumbersWithZero={padHoursWithZero}
          padWithNItems={safePadWithNItems}
          pickerColumnWidth={resolvePerColumn(pickerColumnWidth, "hours")}
          pickerLabelGap={resolvePerColumn(pickerLabelGap, "hours")}
          pmLabel={pmLabel}
          repeatNumbersNTimes={repeatHourNumbersNTimes}
          repeatNumbersNTimesNotExplicitlySet={props?.repeatHourNumbersNTimes === undefined}
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
          accessibilityLabel={accessibilityLabels?.minutes ?? "Minutes"}
          aggressivelyGetLatestDuration={aggressivelyGetLatestDuration}
          allowFontScaling={allowFontScaling}
          decelerationRate={decelerationRate}
          disableInfiniteScroll={disableInfiniteScroll}
          formatValue={formatMinuteA11y}
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
          accessibilityHint={accessibilityLabels?.hint}
          accessibilityLabel={accessibilityLabels?.seconds ?? "Seconds"}
          aggressivelyGetLatestDuration={aggressivelyGetLatestDuration}
          allowFontScaling={allowFontScaling}
          decelerationRate={decelerationRate}
          disableInfiniteScroll={disableInfiniteScroll}
          formatValue={formatSecondA11y}
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
    </View>
  );
});

export default React.memo(TimerPicker);
