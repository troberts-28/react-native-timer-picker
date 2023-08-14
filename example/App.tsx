import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { DurationPicker } from "./index";

import { formatTime } from "./utils/formatTime";

export default function App() {
    const [showPicker, setShowPicker] = useState(false);
    const [alarmString, setAlarmString] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {alarmString !== null
                    ? `Alarm set for: ${alarmString}`
                    : "No alarm set"}
            </Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => setShowPicker(true)}>
                    <Text style={styles.button}>Set Alarm</Text>
                </TouchableOpacity>
            </View>
            <DurationPicker
                visible={showPicker}
                onConfirm={(pickedDuration) => {
                    setAlarmString(formatTime(pickedDuration));
                    setShowPicker(false);
                }}
                onCancel={() => setShowPicker(false)}
                closeOnOverlayPress
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 18,
    },
    button: {
        marginHorizontal: 10,
        padding: 10,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        color: "blue",
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 20,
    },
});
