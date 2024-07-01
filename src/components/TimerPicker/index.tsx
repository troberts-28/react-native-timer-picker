import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";

import { View } from "react-native";

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
            hourLabel,
            hourLimit,
            hoursPickerIsDisabled = false,
            initialValue,
            minuteLabel,
            minuteLimit,
            minutesPickerIsDisabled = false,
            onDurationChange,
            padWithNItems = 1,
            pickerContainerProps,
            pmLabel = "pm",
            secondLabel,
            secondLimit,
            secondsPickerIsDisabled = false,
            styles: customStyles,
            use12HourPicker = false,
            ...otherProps
        } = props;

        const checkedPadWithNItems =
            padWithNItems >= 0 ? Math.round(padWithNItems) : 0;

        const styles = useMemo(
            () =>
                generateStyles(customStyles, {
                    padWithNItems: checkedPadWithNItems,
                }),

            [checkedPadWithNItems, customStyles]
        );

        const safeInitialValue = {
            hours: initialValue?.hours ?? 0,
            minutes: initialValue?.minutes ?? 0,
            seconds: initialValue?.seconds ?? 0,
        };

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
                        is12HourPicker={use12HourPicker}
                        isDisabled={hoursPickerIsDisabled}
                        label={
                            hourLabel ?? (!use12HourPicker ? "h" : undefined)
                        }
                        limit={hourLimit}
                        numberOfItems={23}
                        onDurationChange={setSelectedHours}
                        padWithNItems={checkedPadWithNItems}
                        pmLabel={pmLabel}
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
                        isDisabled={minutesPickerIsDisabled}
                        label={minuteLabel ?? "m"}
                        limit={minuteLimit}
                        numberOfItems={59}
                        onDurationChange={setSelectedMinutes}
                        padNumbersWithZero
                        padWithNItems={checkedPadWithNItems}
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
                        isDisabled={secondsPickerIsDisabled}
                        label={secondLabel ?? "s"}
                        limit={secondLimit}
                        numberOfItems={59}
                        onDurationChange={setSelectedSeconds}
                        padNumbersWithZero
                        padWithNItems={checkedPadWithNItems}
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
