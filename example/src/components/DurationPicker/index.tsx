import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

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
    modalProps?: React.ComponentProps<typeof Modal>;
    containerProps?: React.ComponentProps<typeof View>;
    pickerContainerProps?: React.ComponentProps<typeof View>;
    buttonContainerProps?: React.ComponentProps<typeof View>;
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
    modalProps,
    containerProps,
    pickerContainerProps,
    buttonContainerProps,
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
                    // {...contentContainerProps}
                    style={styles.contentContainer}>
                    <View
                        {...pickerContainerProps}
                        style={styles.pickerContainer}>
                        <DurationScroll
                            numberOfItems={23}
                            label="h"
                            initialIndex={confirmedDuration.hours}
                            onValueChange={setSelectedHours}
                            styles={styles}
                        />
                        <DurationScroll
                            numberOfItems={59}
                            label="m"
                            initialIndex={confirmedDuration.minutes}
                            onValueChange={setSelectedMinutes}
                            padNumbersWithZero
                            styles={styles}
                        />
                        <DurationScroll
                            numberOfItems={59}
                            label="s"
                            initialIndex={confirmedDuration.seconds}
                            onValueChange={setSelectedSeconds}
                            padNumbersWithZero
                            styles={styles}
                        />
                    </View>
                    <View
                        {...buttonContainerProps}
                        style={styles.buttonContainer}>
                        <TouchableOpacity onPress={hideModal}>
                            <Text style={[styles.cancelButton, styles.button]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirm}>
                            <Text style={[styles.confirmButton, styles.button]}>
                                Confirm
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DurationPicker;
