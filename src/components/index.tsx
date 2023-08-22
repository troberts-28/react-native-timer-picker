import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import TimerPicker, { TimerPickerProps } from "./TimerPicker";
import Modal from "./Modal";

import {
    generateStyles,
    CustomTimerPickerModalStyles,
} from "./TimerPickerModal.styles";

interface TimePickerModalRef {
    reset: () => void;
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
    modalTitleProps?: React.ComponentProps<typeof Text>;
    styles?: CustomTimerPickerModalStyles;
}

const TimerPickerModal = forwardRef<TimePickerModalRef, TimerPickerModalProps>(
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

        useImperativeHandle(ref, () => ({
            reset: () => {
                const initialDuration = {
                    hours: initialHours,
                    minutes: initialMinutes,
                    seconds: initialSeconds,
                };
                setSelectedDuration(initialDuration);
                setConfirmedDuration(initialDuration);
                setIsVisible(false);
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
                            onDurationChange={(duration) => {
                                setSelectedDuration(duration);
                                onDurationChange?.(duration);
                            }}
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
                                <TouchableOpacity onPress={cancel}>
                                    <Text
                                        style={[
                                            styles.cancelButton,
                                            styles.button,
                                        ]}>
                                        {cancelButtonText}
                                    </Text>
                                </TouchableOpacity>
                            ) : null}
                            <TouchableOpacity onPress={confirm}>
                                <Text
                                    style={[
                                        styles.confirmButton,
                                        styles.button,
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

export default TimerPickerModal;
