import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { getSafeInitialValue } from "../../utils/getSafeInitialValue";
import Modal from "../Modal";
import TimerPicker from "../TimerPicker";
import type { TimerPickerRef } from "../TimerPicker/types";

import { generateStyles } from "./styles";
import type { TimerPickerModalRef, TimerPickerModalProps } from "./types";

const TimerPickerModal = forwardRef<TimerPickerModalRef, TimerPickerModalProps>(
    (props, ref) => {
        const {
            buttonContainerProps,
            buttonTouchableOpacityProps,
            cancelButtonText = "Cancel",
            closeOnOverlayPress,
            confirmButtonText = "Confirm",
            containerProps,
            contentContainerProps,
            hideCancelButton = false,
            initialValue,
            modalProps,
            modalTitle,
            modalTitleProps,
            onCancel,
            onConfirm,
            onDurationChange,
            setIsVisible,
            styles: customStyles,
            visible,
            ...otherProps
        } = props;

        const styles = generateStyles(customStyles, {
            hasModalTitle: Boolean(modalTitle),
        });

        const timerPickerRef = useRef<TimerPickerRef>(null);

        const safeInitialValue = getSafeInitialValue({
            hours: initialValue?.hours,
            minutes: initialValue?.minutes,
            seconds: initialValue?.seconds,
        });

        const [selectedDuration, setSelectedDuration] =
            useState(safeInitialValue);
        const [confirmedDuration, setConfirmedDuration] =
            useState(safeInitialValue);

        const reset = (options?: { animated?: boolean }) => {
            setSelectedDuration(safeInitialValue);
            setConfirmedDuration(safeInitialValue);
            timerPickerRef.current?.reset(options);
        };

        // reset state if the initial value changes
        useEffect(() => {
            reset();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            safeInitialValue.hours,
            safeInitialValue.minutes,
            safeInitialValue.seconds,
        ]);

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
                            initialValue={confirmedDuration}
                            {...otherProps}
                            aggressivelyGetLatestDuration
                            onDurationChange={durationChangeHandler}
                            styles={styles.timerPickerStyles}
                        />
                        <View
                            {...buttonContainerProps}
                            style={styles.buttonContainer}>
                            {!hideCancelButton ? (
                                <TouchableOpacity
                                    {...buttonTouchableOpacityProps}
                                    onPress={cancelHandler}>
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
                                {...buttonTouchableOpacityProps}
                                onPress={confirmHandler}>
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
