import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { DurationPickerModal } from "./src";

import { formatTime } from "./utils/formatTime";

export default function App() {
    const [showPicker, setShowPicker] = useState(false);
    const [alarmString, setAlarmString] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {alarmString !== null ? "Alarm set for" : "No alarm set"}
            </Text>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowPicker(true)}>
                <View style={styles.touchableContainer}>
                    {alarmString !== null ? (
                        <Text style={styles.alarmText}>{alarmString}</Text>
                    ) : null}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setShowPicker(true)}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.button}>Set Alarm 🔔</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <DurationPickerModal
                visible={showPicker}
                setIsVisible={setShowPicker}
                onConfirm={(pickedDuration) => {
                    setAlarmString(formatTime(pickedDuration));
                    setShowPicker(false);
                }}
                modalTitle="Set Alarm"
                onCancel={() => setShowPicker(false)}
                closeOnOverlayPress
                styles={{
                    theme: "dark",
                }}
                modalProps={{
                    overlayOpacity: 0.2,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#514242",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 18,
        color: "#F1F1F1",
    },
    alarmText: {
        fontSize: 48,
        color: "#F1F1F1",
    },
    touchableContainer: {
        alignItems: "center",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderColor: "#C2C2C2",
        borderWidth: 1,
        borderRadius: 10,
        color: "#C2C2C2",
        fontSize: 16,
        overflow: "hidden",
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 30,
    },
});
