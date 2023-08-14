import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

import DurationScroll from "./DurationScroll";

import {
    generateStyles,
    CustomDurationPickerStyles,
} from "./DurationPicker.styles";

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
    modalProps,
    containerProps,
    pickerContainerProps,
    buttonContainerProps,
    styles: customStyles,
}: DurationPickerProps): React.ReactElement => {
    const styles = generateStyles(customStyles);

    const [selectedHours, setSelectedHours] = useState(0);
    const [selectedMinutes, setSelectedMinutes] = useState(0);
    const [selectedSeconds, setSelectedSeconds] = useState(0);

    return (
        <View style={styles.outerContainer}>
            <Modal animationType="fade" {...modalProps} visible={visible}>
                <View {...containerProps} style={styles.container}>
                    <View
                        {...pickerContainerProps}
                        style={styles.pickerContainer}>
                        <DurationScroll
                            numberOfItems={23}
                            setState={setSelectedHours}
                            styles={styles}
                        />
                        <DurationScroll
                            numberOfItems={59}
                            setState={setSelectedMinutes}
                            styles={styles}
                        />
                        <DurationScroll
                            numberOfItems={59}
                            setState={setSelectedSeconds}
                            styles={styles}
                        />
                    </View>
                    <View
                        {...buttonContainerProps}
                        style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onCancel}>
                            <Text style={styles.button}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                onConfirm({
                                    hours: selectedHours,
                                    minutes: selectedMinutes,
                                    seconds: selectedSeconds,
                                })
                            }>
                            <Text style={styles.button}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DurationPicker;
