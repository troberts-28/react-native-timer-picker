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

import DurationScroll, {
    DurationScrollRef,
    LimitType,
    SoundAssetType,
} from "./DurationScroll";

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
    initialValue?: {
        hours?: number;
        minutes?: number;
        seconds?: number;
    };
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Haptics?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Audio?: any;
    clickSoundAsset?: SoundAssetType;
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
            initialValue,
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
            Haptics,
            Audio,
            clickSoundAsset,
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
                        numberOfItems={23}
                        label={
                            hourLabel ?? (!use12HourPicker ? "h" : undefined)
                        }
                        isDisabled={hoursPickerIsDisabled}
                        initialValue={safeInitialValue.hours}
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
                        Haptics={Haptics}
                        Audio={Audio}
                        clickSoundAsset={clickSoundAsset}
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
                        initialValue={safeInitialValue.minutes}
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
                        Haptics={Haptics}
                        Audio={Audio}
                        clickSoundAsset={clickSoundAsset}
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
                        initialValue={safeInitialValue.seconds}
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
                        Haptics={Haptics}
                        Audio={Audio}
                        clickSoundAsset={clickSoundAsset}
                        styles={styles}
                        testID="duration-scroll-second"
                    />
                ) : null}
            </View>
        );
    }
);

export default React.memo(TimerPicker);
