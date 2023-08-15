import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import DurationPicker, { DurationPickerProps } from "./DurationPicker";
import Modal from "./Modal";

import {
    generateStyles,
    CustomDurationPickerModalStyles,
} from "./DurationPickerModal.styles";

export interface DurationPickerModalProps
    extends Omit<DurationPickerProps, "onValueChange"> {
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
    onCancel: () => void;
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
    styles?: CustomDurationPickerModalStyles;
}

const DurationPickerModal = ({
    visible,
    setIsVisible,
    onConfirm,
    onCancel,
    closeOnOverlayPress,
    initialHours = 0,
    initialMinutes = 0,
    initialSeconds = 0,
    hideHours = false,
    hideMinutes = false,
    hideSeconds = false,
    hideCancelButton = false,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    modalTitle,
    modalProps,
    containerProps,
    contentContainerProps,
    pickerContainerProps,
    buttonContainerProps,
    modalTitleProps,
    pickerGradientOverlayProps,
    styles: customStyles,
}: DurationPickerModalProps): React.ReactElement => {
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
        onConfirm(selectedDuration);
        setConfirmedDuration(selectedDuration);
    };

    return (
        <Modal
            isVisible={visible}
            onOverlayPress={closeOnOverlayPress ? hideModal : undefined}
            {...modalProps}>
            <View {...containerProps} style={styles.container}>
                <View
                    {...contentContainerProps}
                    style={styles.contentContainer}>
                    {modalTitle ? (
                        <Text {...modalTitleProps} style={styles.modalTitle}>
                            {modalTitle}
                        </Text>
                    ) : null}
                    <DurationPicker
                        onValueChange={(value) => setSelectedDuration(value)}
                        initialHours={confirmedDuration.hours}
                        initialMinutes={confirmedDuration.minutes}
                        initialSeconds={confirmedDuration.seconds}
                        hideHours={hideHours}
                        hideMinutes={hideMinutes}
                        hideSeconds={hideSeconds}
                        pickerContainerProps={pickerContainerProps}
                        pickerGradientOverlayProps={pickerGradientOverlayProps}
                        styles={customStyles}
                    />
                    <View
                        {...buttonContainerProps}
                        style={styles.buttonContainer}>
                        {!hideCancelButton ? (
                            <TouchableOpacity onPress={onCancel}>
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
                            <Text style={[styles.confirmButton, styles.button]}>
                                {confirmButtonText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DurationPickerModal;
