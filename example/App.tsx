import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    LayoutAnimation,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
    useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

import { TimerPicker, TimerPickerModal } from "../src";

import { formatTime } from "./utils/formatTime";

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function App() {
    const { width: screenWidth } = useWindowDimensions();

    const scrollViewRef = useRef<ScrollView>(null);

    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [showPickerExample1, setShowPickerExample1] = useState(false);
    const [showPickerExample2, setShowPickerExample2] = useState(false);
    const [alarmStringExample1, setAlarmStringExample1] = useState<
        string | null
    >(null);
    const [alarmStringExample2, setAlarmStringExample2] = useState<
        string | null
    >(null);

    useEffect(() => {
        // when changing to landscape mode, scroll to the nearest page index
        scrollViewRef.current?.scrollTo({
            x: screenWidth * currentPageIndex,
            animated: false,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screenWidth]);

    const onMomentumScrollEnd = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
            );
            const { contentOffset } = event.nativeEvent;
            const newPageIndex = Math.round(contentOffset.x / screenWidth) as
                | 0
                | 1;
            setCurrentPageIndex(newPageIndex);
        },
        [screenWidth]
    );

    const renderExample1 = useMemo(() => {
        return (
            <View
                style={[
                    styles.container,
                    styles.page1Container,
                    { width: screenWidth },
                ]}>
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
    }, [alarmStringExample1, screenWidth, showPickerExample1]);

    const renderExample2 = useMemo(() => {
        return (
            <View
                style={[
                    styles.container,
                    styles.page2Container,
                    { width: screenWidth },
                ]}>
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
                    use12HourPicker
                    LinearGradient={LinearGradient}
                    styles={{
                        theme: "light",
                    }}
                />
            </View>
        );
    }, [alarmStringExample2, screenWidth, showPickerExample2]);

    const renderExample3 = useMemo(() => {
        return (
            <View
                style={[
                    styles.container,
                    styles.page3Container,
                    { width: screenWidth },
                ]}>
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
                        pickerItemContainer: {
                            width: 100
                        },
                        pickerLabelContainer: {
                            right: -20,
                            top: 0,
                            bottom: 6,
                            width: 40,
                            alignItems: "center",
                        },
                    }}
                />
            </View>
        );
    }, [screenWidth]);

    const renderExample4 = useMemo(() => {
        return (
            <View
                style={[
                    styles.container,
                    styles.page4Container,
                    { width: screenWidth },
                ]}>
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
    }, [screenWidth]);

    const renderNavigationArrows = useMemo(() => {
        return (
            <>
                {currentPageIndex !== 3 ? (
                    <Pressable
                        onPress={() => {
                            LayoutAnimation.configureNext(
                                LayoutAnimation.Presets.easeInEaseOut
                            );
                            setCurrentPageIndex((currentPageIndex) => {
                                scrollViewRef.current?.scrollTo({
                                    x: screenWidth * (currentPageIndex + 1),
                                    animated: true,
                                });
                                return currentPageIndex + 1;
                            });
                        }}
                        style={({ pressed }) => [
                            styles.chevronPressable,
                            { right: 8 },
                            pressed && styles.chevronPressable_pressed,
                        ]}>
                        <Ionicons
                            color={
                                currentPageIndex % 2 !== 0
                                    ? "#514242"
                                    : "#F1F1F1"
                            }
                            name="chevron-forward"
                            size={32}
                        />
                    </Pressable>
                ) : null}
                {currentPageIndex !== 0 ? (
                    <Pressable
                        onPress={() => {
                            LayoutAnimation.configureNext(
                                LayoutAnimation.Presets.easeInEaseOut
                            );
                            setCurrentPageIndex((currentPageIndex) => {
                                scrollViewRef.current?.scrollTo({
                                    x: screenWidth * (currentPageIndex - 1),
                                    animated: true,
                                });
                                return currentPageIndex - 1;
                            });
                        }}
                        style={({ pressed }) => [
                            styles.chevronPressable,
                            { left: 8 },
                            pressed && styles.chevronPressable_pressed,
                        ]}>
                        <Ionicons
                            color={
                                currentPageIndex % 2 !== 0
                                    ? "#514242"
                                    : "#F1F1F1"
                            }
                            name="chevron-back"
                            size={32}
                        />
                    </Pressable>
                ) : null}
            </>
        );
    }, [currentPageIndex, screenWidth]);

    return (
        <>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                onMomentumScrollEnd={onMomentumScrollEnd}>
                {renderExample1}
                {renderExample2}
                {renderExample3}
                {renderExample4}
            </ScrollView>
            {renderNavigationArrows}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
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
    chevronPressable: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        bottom: 0,
        padding: 8,
    },
    chevronPressable_pressed: {
        opacity: 0.7,
    }
});
