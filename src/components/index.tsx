import React, {
    MutableRefObject,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { View, Text, TouchableOpacity } from "react-native";

import TimerPicker, { TimerPickerProps, TimerPickerRef } from "./TimerPicker";
import Modal from "./Modal";

import {
    generateStyles,
    CustomTimerPickerModalStyles,
} from "./TimerPickerModal.styles";

export interface TimerPickerModalRef {
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

export interface TimerPickerModalProps extends TimerPickerProps {
    visible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    onConfirm: ({
        hours,
        minutes,
        seconds,
    }: {
        hours: number;
        minutes: number;
        seconds: number;
    }) => void;
    onCancel?: () => void;
    closeOnOverlayPress?: boolean;
    hideCancelButton?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
    modalTitle?: string;
    modalProps?: React.ComponentProps<typeof Modal>;
    containerProps?: React.ComponentProps<typeof View>;
    contentContainerProps?: React.ComponentProps<typeof View>;
    buttonContainerProps?: React.ComponentProps<typeof View>;
    buttonTouchableOpacityProps?: React.ComponentProps<typeof TouchableOpacity>;
    modalTitleProps?: React.ComponentProps<typeof Text>;
    styles?: CustomTimerPickerModalStyles;
}

const TimerPickerModal = forwardRef<TimerPickerModalRef, TimerPickerModalProps>(
    (
        {
            visible,
            setIsVisible,
            onConfirm,
            onCancel,
            onDurationChange,
            closeOnOverlayPress,
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
            allowFontScaling = false,
            use12HourPicker,
            amLabel,
            pmLabel,
            hideCancelButton = false,
            confirmButtonText = "Confirm",
            cancelButtonText = "Cancel",
            modalTitle,
            LinearGradient,
            modalProps,
            containerProps,
            contentContainerProps,
            pickerContainerProps,
            buttonContainerProps,
            buttonTouchableOpacityProps,
            modalTitleProps,
            pickerGradientOverlayProps,
            topPickerGradientOverlayProps,
            bottomPickerGradientOverlayProps,
            styles: customStyles,
        },
        ref
    ): React.ReactElement => {
        const styles = generateStyles(customStyles);

        const timerPickerRef = useRef<TimerPickerRef>(null);

        const [selectedDuration, setSelectedDuration] = useState({
            hours: initialHours,
            minutes: initialMinutes,
            seconds: initialSeconds,
        });
        const [confirmedDuration, setConfirmedDuration] = useState({
            hours: initialHours,
            minutes: initialMinutes,
            seconds: initialSeconds,
        });

        const reset = (options?: { animated?: boolean }) => {
            const initialDuration = {
                hours: initialHours,
                minutes: initialMinutes,
                seconds: initialSeconds,
            };
            setSelectedDuration(initialDuration);
            setConfirmedDuration(initialDuration);
            timerPickerRef.current?.reset(options);
        };

        // reset state if the initial times change
        useEffect(() => {
            reset();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [initialHours, initialMinutes, initialSeconds]);

        const hideModalHandler = () => {
            setSelectedDuration({
                hours: confirmedDuration.hours,
                minutes: confirmedDuration.minutes,
                seconds: confirmedDuration.seconds,
            });
            setIsVisible(false);
        };

        const confirmHandler = () => {
            const latestDuration = timerPickerRef.current?.latestDuration;
            const newDuration = {
                hours: latestDuration?.hours?.current ?? selectedDuration.hours,
                minutes:
                    latestDuration?.minutes?.current ??
                    selectedDuration.minutes,
                seconds:
                    latestDuration?.seconds?.current ??
                    selectedDuration.seconds,
            };
            setConfirmedDuration(newDuration);
            onConfirm(newDuration);
        };

        const cancelHandler = () => {
            setIsVisible(false);
            setSelectedDuration(confirmedDuration);
            onCancel?.();
        };

        // wrapped in useCallback to avoid unnecessary re-renders of TimerPicker
        const durationChangeHandler = useCallback(
            (duration: { hours: number; minutes: number; seconds: number }) => {
                setSelectedDuration(duration);
                onDurationChange?.(duration);
            },
            [onDurationChange]
        );

        useImperativeHandle(ref, () => ({
            reset,
            setValue: (value, options) => {
                setSelectedDuration(value);
                setConfirmedDuration(value);
                timerPickerRef.current?.setValue(value, options);
            },
            latestDuration: {
                hours: timerPickerRef.current?.latestDuration?.hours,
                minutes: timerPickerRef.current?.latestDuration?.minutes,
                seconds: timerPickerRef.current?.latestDuration?.seconds,
            },
        }));

        return (
            <Modal
                isVisible={visible}
                onOverlayPress={
                    closeOnOverlayPress ? hideModalHandler : undefined
                }
                {...modalProps}
                testID="timer-picker-modal">
                <View {...containerProps} style={styles.container}>
                    <View
                        {...contentContainerProps}
                        style={styles.contentContainer}>
                        {modalTitle ? (
                            <Text
                                {...modalTitleProps}
                                style={styles.modalTitle}>
                                {modalTitle}
                            </Text>
                        ) : null}
                        <TimerPicker
                            ref={timerPickerRef}
                            onDurationChange={durationChangeHandler}
                            initialHours={confirmedDuration.hours}
                            initialMinutes={confirmedDuration.minutes}
                            initialSeconds={confirmedDuration.seconds}
                            aggressivelyGetLatestDuration={true}
                            hideHours={hideHours}
                            hideMinutes={hideMinutes}
                            hideSeconds={hideSeconds}
                            hoursPickerIsDisabled={hoursPickerIsDisabled}
                            minutesPickerIsDisabled={minutesPickerIsDisabled}
                            secondsPickerIsDisabled={secondsPickerIsDisabled}
                            hourLimit={hourLimit}
                            minuteLimit={minuteLimit}
                            secondLimit={secondLimit}
                            hourLabel={hourLabel}
                            minuteLabel={minuteLabel}
                            secondLabel={secondLabel}
                            padWithNItems={padWithNItems}
                            disableInfiniteScroll={disableInfiniteScroll}
                            allowFontScaling={allowFontScaling}
                            use12HourPicker={use12HourPicker}
                            amLabel={amLabel}
                            pmLabel={pmLabel}
                            LinearGradient={LinearGradient}
                            pickerContainerProps={pickerContainerProps}
                            pickerGradientOverlayProps={
                                pickerGradientOverlayProps
                            }
                            topPickerGradientOverlayProps={
                                topPickerGradientOverlayProps
                            }
                            bottomPickerGradientOverlayProps={
                                bottomPickerGradientOverlayProps
                            }
                            styles={customStyles}
                        />
                        <View
                            {...buttonContainerProps}
                            style={styles.buttonContainer}>
                            {!hideCancelButton ? (
                                <TouchableOpacity
                                    onPress={cancelHandler}
                                    {...buttonTouchableOpacityProps}>
                                    <Text
                                        style={[
                                            styles.button,
                                            styles.cancelButton,
                                        ]}>
                                        {cancelButtonText}
                                    </Text>
                                </TouchableOpacity>
                            ) : null}
                            <TouchableOpacity
                                onPress={confirmHandler}
                                {...buttonTouchableOpacityProps}>
                                <Text
                                    style={[
                                        styles.button,
                                        styles.confirmButton,
                                    ]}>
                                    {confirmButtonText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
);

export default React.memo(TimerPickerModal);
