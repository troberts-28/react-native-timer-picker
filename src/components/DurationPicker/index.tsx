import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import DurationScroll from "./DurationScroll";

import {
    generateStyles,
    CustomDurationPickerStyles,
} from "./DurationPicker.styles";
import Modal from "../Modal";

export interface DurationPickerProps {
    visible: boolean;
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
    initialHours?: number;
    initialMinutes?: number;
    initialSeconds?: number;
    hideHours?: boolean;
    hideMinutes?: boolean;
    hideSeconds?: boolean;
    hideCancelButton?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
    modalTitle?: string;
    modalProps?: React.ComponentProps<typeof Modal>;
    containerProps?: React.ComponentProps<typeof View>;
    contentContainerProps?: React.ComponentProps<typeof View>;
    pickerContainerProps?: React.ComponentProps<typeof View>;
    buttonContainerProps?: React.ComponentProps<typeof View>;
    modalTitleProps?: React.ComponentProps<typeof Text>;
    pickerGradientOverlayProps?: React.ComponentProps<typeof LinearGradient>;
    styles?: CustomDurationPickerStyles;
}

const DurationPicker = ({
    visible,
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
}: DurationPickerProps): React.ReactElement => {
    const styles = generateStyles(customStyles);

    const [selectedHours, setSelectedHours] = useState(initialHours);
    const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);
    const [selectedSeconds, setSelectedSeconds] = useState(initialSeconds);
    const [confirmedDuration, setConfirmedDuration] = useState({
        hours: initialHours,
        minutes: initialMinutes,
        seconds: initialSeconds,
    });

    const hideModal = () => {
        setSelectedHours(confirmedDuration.hours);
        setSelectedMinutes(confirmedDuration.minutes);
        setSelectedSeconds(confirmedDuration.seconds);
        onCancel?.();
    };

    const confirm = () => {
        const duration = {
            hours: selectedHours,
            minutes: selectedMinutes,
            seconds: selectedSeconds,
        };
        onConfirm(duration);
        setConfirmedDuration(duration);
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
                    <View
                        {...pickerContainerProps}
                        style={styles.pickerContainer}>
                        {!hideHours ? (
                            <DurationScroll
                                numberOfItems={23}
                                label="h"
                                initialIndex={confirmedDuration.hours}
                                onValueChange={setSelectedHours}
                                pickerGradientOverlayProps={
                                    pickerGradientOverlayProps
                                }
                                styles={styles}
                            />
                        ) : null}
                        {!hideMinutes ? (
                            <DurationScroll
                                numberOfItems={59}
                                label="m"
                                initialIndex={confirmedDuration.minutes}
                                onValueChange={setSelectedMinutes}
                                padNumbersWithZero
                                pickerGradientOverlayProps={
                                    pickerGradientOverlayProps
                                }
                                styles={styles}
                            />
                        ) : null}
                        {!hideSeconds ? (
                            <DurationScroll
                                numberOfItems={59}
                                label="s"
                                initialIndex={confirmedDuration.seconds}
                                onValueChange={setSelectedSeconds}
                                padNumbersWithZero
                                pickerGradientOverlayProps={
                                    pickerGradientOverlayProps
                                }
                                styles={styles}
                            />
                        ) : null}
                    </View>
                    <View
                        {...buttonContainerProps}
                        style={styles.buttonContainer}>
                        {!hideCancelButton ? (
                            <TouchableOpacity onPress={hideModal}>
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

export default DurationPicker;
