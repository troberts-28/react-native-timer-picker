import React, {
    forwardRef,
    useCallback,
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
    buttonTouchableOpacityProps: React.ComponentProps<typeof TouchableOpacity>;
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
            hourLimit,
            minuteLimit,
            secondLimit,
            hourLabel = "h",
            minuteLabel = "m",
            secondLabel = "s",
            padWithNItems = 1,
            disableInfiniteScroll = false,
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
            styles: customStyles,
        },
        ref
    ): React.ReactElement => {
        const styles = generateStyles(customStyles);

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

        const hideModal = () => {
            setSelectedDuration({
                hours: confirmedDuration.hours,
                minutes: confirmedDuration.minutes,
                seconds: confirmedDuration.seconds,
            });
            setIsVisible(false);
        };

        const confirm = () => {
            setConfirmedDuration(selectedDuration);
            onConfirm(selectedDuration);
        };

        const cancel = () => {
            setIsVisible(false);
            setSelectedDuration(confirmedDuration);
            onCancel?.();
        };

        // wrapped in useCallback to avoid unnecessary re-renders of TimerPicker
        const durationChange = useCallback(
            (duration: { hours: number; minutes: number; seconds: number }) => {
                setSelectedDuration(duration);
                onDurationChange?.(duration);
            },
            [onDurationChange]
        );

        const timerPickerRef = useRef<TimerPickerRef>(null);

        useImperativeHandle(ref, () => ({
            reset: (options) => {
                const initialDuration = {
                    hours: initialHours,
                    minutes: initialMinutes,
                    seconds: initialSeconds,
                };
                setSelectedDuration(initialDuration);
                setConfirmedDuration(initialDuration);
                timerPickerRef.current?.reset(options);
            },
            setValue: (value, options) => {
                setSelectedDuration(value);
                setConfirmedDuration(value);
                timerPickerRef.current?.setValue(value, options);
            },
        }));

        return (
            <Modal
                isVisible={visible}
                onOverlayPress={closeOnOverlayPress ? hideModal : undefined}
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
                            onDurationChange={durationChange}
                            initialHours={confirmedDuration.hours}
                            initialMinutes={confirmedDuration.minutes}
                            initialSeconds={confirmedDuration.seconds}
                            hideHours={hideHours}
                            hideMinutes={hideMinutes}
                            hideSeconds={hideSeconds}
                            hourLimit={hourLimit}
                            minuteLimit={minuteLimit}
                            secondLimit={secondLimit}
                            hourLabel={hourLabel}
                            minuteLabel={minuteLabel}
                            secondLabel={secondLabel}
                            padWithNItems={padWithNItems}
                            disableInfiniteScroll={disableInfiniteScroll}
                            LinearGradient={LinearGradient}
                            pickerContainerProps={pickerContainerProps}
                            pickerGradientOverlayProps={
                                pickerGradientOverlayProps
                            }
                            styles={customStyles}
                        />
                        <View
                            {...buttonContainerProps}
                            style={styles.buttonContainer}>
                            {!hideCancelButton ? (
                                <TouchableOpacity
                                    onPress={cancel}
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
                                onPress={confirm}
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
