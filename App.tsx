import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { DurationPicker } from "./";

const formatTime = ({
    hours,
    minutes,
    seconds,
}: {
    hours?: number;
    minutes?: number;
    seconds?: number;
}) => {
    let timeParts = [];

    if (hours !== undefined) {
        timeParts.push(hours.toString().padStart(2, "0"));
    }
    if (minutes !== undefined) {
        timeParts.push(minutes.toString().padStart(2, "0"));
    }
    if (seconds !== undefined) {
        timeParts.push(seconds.toString().padStart(2, "0"));
    }

    return timeParts.join(":");
};

export default function App() {
    const [showPicker, setShowPicker] = useState(false);
    const [alarmString, setAlarmString] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {alarmString !== null
                    ? "Alarm set for"
                    : "No alarm set"}
            </Text>
                {alarmString !== null ?
            <Text style={styles.text}>
                    {alarmString}
            </Text> : null}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => setShowPicker(true)}>
                    <Text style={styles.button}>Set Alarm</Text>
                </TouchableOpacity>
            </View>
            <DurationPicker
                visible={showPicker}
                onConfirm={(pickedDuration) => {
                    setAlarmString(formatTime(pickedDuration));
                }}
                onCancel={() => setShowPicker(false)}
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
