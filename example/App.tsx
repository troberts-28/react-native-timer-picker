import React, { useMemo, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { TimerPicker, TimerPickerModal } from "./src";

import { formatTime } from "./utils/formatTime";

const { width: screenWidth } = Dimensions.get("window");

export default function App() {
    const [showPickerExample1, setShowPickerExample1] = useState(false);
    const [showPickerExample2, setShowPickerExample2] = useState(false);
    const [alarmStringExample1, setAlarmStringExample1] = useState<
        string | null
    >(null);
    const [alarmStringExample2, setAlarmStringExample2] = useState<
        string | null
    >(null);

    const renderExample1 = useMemo(() => {
        return (
            <View style={[styles.container, styles.page1Container]}>
                <Text style={styles.textDark}>
                    {alarmStringExample1 !== null
                        ? "Alarm set for"
                        : "No alarm set"}
                </Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowPickerExample1(true)}>
                    <View style={styles.touchableContainer}>
                        {alarmStringExample1 !== null ? (
                            <Text style={styles.alarmTextDark}>
                                {alarmStringExample1}
                            </Text>
                        ) : null}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setShowPickerExample1(true)}>
                            <View style={styles.buttonContainer}>
                                <Text
                                    style={[styles.button, styles.buttonDark]}>
                                    Set Alarm 🔔
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TimerPickerModal
                    visible={showPickerExample1}
                    setIsVisible={setShowPickerExample1}
                    onConfirm={(pickedDuration) => {
                        setAlarmStringExample1(formatTime(pickedDuration));
                        setShowPickerExample1(false);
                    }}
                    modalTitle="Set Alarm"
                    onCancel={() => setShowPickerExample1(false)}
                    closeOnOverlayPress
                    LinearGradient={LinearGradient}
                    styles={{
                        theme: "dark",
                    }}
                    modalProps={{
                        overlayOpacity: 0.2,
                    }}
                />
            </View>
        );
    }, [alarmStringExample1, showPickerExample1]);

    const renderExample2 = useMemo(() => {
        return (
            <View style={[styles.container, styles.page2Container]}>
                <Text style={styles.textLight}>
                    {alarmStringExample2 !== null
                        ? "Alarm set for"
                        : "No alarm set"}
                </Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowPickerExample2(true)}>
                    <View style={styles.touchableContainer}>
                        {alarmStringExample2 !== null ? (
                            <Text style={styles.alarmTextLight}>
                                {alarmStringExample2}
                            </Text>
                        ) : null}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setShowPickerExample2(true)}>
                            <View style={styles.buttonContainer}>
                                <Text
                                    style={[styles.button, styles.buttonLight]}>
                                    Set Alarm 🔔
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TimerPickerModal
                    visible={showPickerExample2}
                    setIsVisible={setShowPickerExample2}
                    onConfirm={(pickedDuration) => {
                        setAlarmStringExample2(formatTime(pickedDuration));
                        setShowPickerExample2(false);
                    }}
                    modalTitle="Set Alarm"
                    onCancel={() => setShowPickerExample2(false)}
                    closeOnOverlayPress
                    LinearGradient={LinearGradient}
                    styles={{
                        theme: "light",
                    }}
                />
            </View>
        );
    }, [alarmStringExample2, showPickerExample2]);

    const renderExample3 = useMemo(() => {
        return (
            <View style={[styles.container, styles.page3Container]}>
                <TimerPicker
                    padWithNItems={2}
                    hourLabel=":"
                    minuteLabel=":"
                    secondLabel=""
                    LinearGradient={LinearGradient}
                    styles={{
                        theme: "dark",
                        backgroundColor: "#202020",
                        pickerItem: {
                            fontSize: 34,
                        },
                        pickerLabel: {
                            fontSize: 32,
                            marginTop: 0,
                        },
                        pickerContainer: {
                            marginRight: 6,
                        },
                    }}
                />
            </View>
        );
    }, []);

    const renderExample4 = useMemo(() => {
        return (
            <View style={[styles.container, styles.page4Container]}>
                <TimerPicker
                    padWithNItems={3}
                    hideHours
                    minuteLabel="min"
                    secondLabel="sec"
                    LinearGradient={LinearGradient}
                    styles={{
                        theme: "light",
                        pickerItem: {
                            fontSize: 34,
                        },
                        pickerLabel: {
                            fontSize: 26,
                            right: -20,
                        },
                        pickerLabelContainer: {
                            width: 60,
                        },
                        pickerItemContainer: {
                            width: 150,
                        },
                    }}
                />
            </View>
        );
    }, []);

    return (
        <ScrollView horizontal pagingEnabled>
            {renderExample1}
            {renderExample2}
            {renderExample3}
            {renderExample4}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        width: screenWidth,
    },
    page1Container: {
        backgroundColor: "#514242",
    },
    page2Container: {
        backgroundColor: "#F1F1F1",
    },
    page3Container: {
        backgroundColor: "#202020",
    },
    page4Container: {
        backgroundColor: "#F1F1F1",
    },
    textDark: {
        fontSize: 18,
        color: "#F1F1F1",
    },
    textLight: {
        fontSize: 18,
        color: "#202020",
    },
    alarmTextDark: {
        fontSize: 48,
        color: "#F1F1F1",
    },
    alarmTextLight: {
        fontSize: 48,
        color: "#202020",
    },
    touchableContainer: {
        alignItems: "center",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 16,
        overflow: "hidden",
    },
    buttonDark: {
        borderColor: "#C2C2C2",
        color: "#C2C2C2",
    },
    buttonLight: { borderColor: "#8C8C8C", color: "#8C8C8C" },
    buttonContainer: {
        marginTop: 30,
    },
});
