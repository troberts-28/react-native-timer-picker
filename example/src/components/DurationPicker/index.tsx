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

    return (
        <View style={styles.outerContainer}>
            <Modal
                isVisible={visible}
                onOverlayPress={closeOnOverlayPress ? onCancel : undefined}
                {...modalProps}>
                <View {...containerProps} style={styles.container}>
                    <View
                        {...pickerContainerProps}
                        style={styles.pickerContainer}>
                        <DurationScroll
                            numberOfItems={23}
                            label="h"
                            initialIndex={selectedHours}
                            setState={setSelectedHours}
                            styles={styles}
                        />
                        <DurationScroll
                            numberOfItems={59}
                            label="m"
                            initialIndex={selectedMinutes}
                            setState={setSelectedMinutes}
                            padNumbersWithZero
                            styles={styles}
                        />
                        <DurationScroll
                            numberOfItems={59}
                            label="s"
                            initialIndex={selectedSeconds}
                            setState={setSelectedSeconds}
                            padNumbersWithZero
                            styles={styles}
                        />
                    </View>
                    <View
                        {...buttonContainerProps}
                        style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onCancel}>
                            <Text style={[styles.cancelButton, styles.button]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                onConfirm({
                                    hours: selectedHours,
                                    minutes: selectedMinutes,
                                    seconds: selectedSeconds,
                                })
                            }>
                            <Text style={[styles.confirmButton, styles.button]}>
                                Confirm
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DurationPicker;
