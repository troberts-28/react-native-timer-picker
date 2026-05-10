import React, { useRef, useState } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaskedView from "@react-native-masked-view/masked-view";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
// import { AudioContext, type AudioBuffer } from "react-native-audio-api";

import { TimerPicker, TimerPickerModal } from "../../src";
import { CustomButton } from "./components/CustomButton";
import { formatTime } from "./utils/formatTime";
// import { getClickSound } from "./utils/getClickSound";

export default function App() {
  const scrollViewRef = useRef<ScrollView>(null);
  // const audioContextRef = useRef<AudioContext | null>(null);
  // const audioBufferRef = useRef<AudioBuffer | null>(null);

  const [pageWidth, setPageWidth] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showPickerExample1, setShowPickerExample1] = useState(false);
  const [showPickerExample2, setShowPickerExample2] = useState(false);
  const [showPickerExample3, setShowPickerExample3] = useState(false);
  const [showPickerSeparateAmPm, setShowPickerSeparateAmPm] = useState(false);
  const [alarmStringExample1, setAlarmStringExample1] = useState<string | null>(null);
  const [alarmStringExample2, setAlarmStringExample2] = useState<string | null>(null);
  const [alarmStringExample3, setAlarmStringExample3] = useState("00:00:00");
  const [alarmStringSeparateAmPm, setAlarmStringSeparateAmPm] = useState<string | null>(null);
  const [hourLimitTestValue, setHourLimitTestValue] = useState(20);
  const [hourLimitSeparateTestValue, setHourLimitSeparateTestValue] = useState(20);

  // N.B. Uncomment this to use audio (requires development build)
  // useEffect(() => {
  //     const setupAudio = async () => {
  //         try {
  //             const context = new AudioContext();
  //             const arrayBuffer = await getClickSound();
  //             const buffer = await context.decodeAudioData(arrayBuffer);

  //             audioContextRef.current = context;
  //             audioBufferRef.current = buffer;
  //         } catch (error) {
  //             console.warn("Audio setup failed:", error);
  //         }
  //     };

  //     setupAudio();

  //     return () => {
  //         audioContextRef.current?.close();
  //     };
  // }, []);

  const onRootLayout = (event: { nativeEvent: { layout: { width: number } } }) => {
    const { width } = event.nativeEvent.layout;
    setPageWidth(width);
    scrollViewRef.current?.scrollTo({
      animated: false,
      x: width * currentPageIndex,
    });
  };

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const { contentOffset } = event.nativeEvent;
    const newPageIndex = Math.round(contentOffset.x / pageWidth) as 0 | 1;
    setCurrentPageIndex(newPageIndex);
  };

  const pickerFeedback = () => {
    try {
      Haptics.selectionAsync();

      // const context = audioContextRef.current;
      // const buffer = audioBufferRef.current;

      // if (!context || !buffer) {
      //     console.warn("Audio not initialized");
      //     return;
      // }

      // const playerNode = context.createBufferSource();
      // playerNode.buffer = buffer;
      // playerNode.connect(context.destination);
      // playerNode.start(context.currentTime);
    } catch (error) {
      console.warn("Picker feedback failed:", error);
    }
  };

  const renderExample1 = (
    <View style={[styles.container, styles.page1Container, { width: pageWidth }]}>
      <Text style={styles.textDark}>
        {alarmStringExample1 !== null ? "Alarm set for" : "No alarm set"}
      </Text>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPickerExample1(true)}>
        <View style={styles.touchableContainer}>
          {alarmStringExample1 !== null ? (
            <Text style={styles.alarmTextDark}>{alarmStringExample1}</Text>
          ) : null}
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPickerExample1(true)}>
            <View style={styles.buttonContainer}>
              <Text style={[styles.button, styles.buttonDark]}>{"Set Alarm 🔔"}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <TimerPickerModal
        closeOnOverlayPress
        LinearGradient={LinearGradient}
        modalProps={{ overlayOpacity: 0.2 }}
        modalTitle="Set Alarm"
        onCancel={() => setShowPickerExample1(false)}
        onConfirm={(pickedDuration) => {
          setAlarmStringExample1(formatTime(pickedDuration));
          setShowPickerExample1(false);
        }}
        pickerFeedback={pickerFeedback}
        setIsVisible={setShowPickerExample1}
        styles={{ theme: "dark" }}
        visible={showPickerExample1}
      />
    </View>
  );

  const renderExample2 = (
    <View style={[styles.container, styles.page2Container, { width: pageWidth }]}>
      <Text style={styles.textLight}>
        {alarmStringExample2 !== null ? "Alarm set for" : "No alarm set"}
      </Text>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPickerExample2(true)}>
        <View style={styles.touchableContainer}>
          {alarmStringExample2 !== null ? (
            <Text style={styles.alarmTextLight}>{alarmStringExample2}</Text>
          ) : null}
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPickerExample2(true)}>
            <View style={styles.buttonContainer}>
              <Text style={[styles.button, styles.buttonLight]}>{"Set Alarm 🔔"}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <TimerPickerModal
        closeOnOverlayPress
        LinearGradient={LinearGradient}
        modalTitle="Set Alarm"
        onCancel={() => setShowPickerExample2(false)}
        onConfirm={(pickedDuration) => {
          setAlarmStringExample2(formatTime(pickedDuration));
          setShowPickerExample2(false);
        }}
        pickerFeedback={pickerFeedback}
        setIsVisible={setShowPickerExample2}
        styles={{
          pickerColumnWidth: {
            hours: 90,
          },
          theme: "light",
        }}
        use12HourPicker
        visible={showPickerExample2}
      />
    </View>
  );

  const renderExampleSeparateAmPm = (
    <View style={[styles.container, styles.pageSeparateAmPmContainer, { width: pageWidth }]}>
      <Text style={styles.textLight}>
        {alarmStringSeparateAmPm !== null ? "Alarm set for" : "No alarm set"}
      </Text>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPickerSeparateAmPm(true)}>
        <View style={styles.touchableContainer}>
          {alarmStringSeparateAmPm !== null ? (
            <Text style={styles.alarmTextLight}>{alarmStringSeparateAmPm}</Text>
          ) : null}
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPickerSeparateAmPm(true)}>
            <View style={styles.buttonContainer}>
              <Text style={[styles.button, styles.buttonLight]}>{"Set Alarm 🔔"}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <Text style={styles.captionLight}>{"use12HourPicker + separateAmPmPicker"}</Text>
      <TimerPickerModal
        amLabel="AM"
        closeOnOverlayPress
        hideSeconds
        hourLimit={{ max: 17, min: 9 }}
        initialValue={{ hours: 9, minutes: 30 }}
        LinearGradient={LinearGradient}
        modalTitle="Set Alarm"
        onCancel={() => setShowPickerSeparateAmPm(false)}
        onConfirm={(pickedDuration) => {
          setAlarmStringSeparateAmPm(formatTime(pickedDuration));
          setShowPickerSeparateAmPm(false);
        }}
        padHoursWithZero={false}
        pickerFeedback={pickerFeedback}
        pmLabel="PM"
        separateAmPmPicker
        setIsVisible={setShowPickerSeparateAmPm}
        styles={{
          selectedSeparateAmPmItem: { color: "#1B6EF1" },
          separateAmPmItem: { fontSize: 16, fontWeight: "600" },
          theme: "light",
        }}
        use12HourPicker
        visible={showPickerSeparateAmPm}
      />
    </View>
  );

  const renderExample3 = (
    <View style={[styles.container, styles.page3Container, { width: pageWidth }]}>
      <Text style={styles.textLight}>
        {alarmStringExample3 !== null ? "Alarm set for" : "No alarm set"}
      </Text>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPickerExample3(true)}>
        <View style={styles.touchableContainer}>
          {alarmStringExample3 !== null ? (
            <Text style={styles.alarmTextLight}>{alarmStringExample3}</Text>
          ) : null}
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPickerExample3(true)}>
            <View style={styles.buttonContainer}>
              <Text style={[styles.button, styles.buttonLight]}>{"Set Alarm 🔔"}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <TimerPickerModal
        cancelButton={<CustomButton label="Cancel" />}
        closeOnOverlayPress
        confirmButton={<CustomButton label="Confirm" />}
        LinearGradient={LinearGradient}
        modalProps={{ overlayOpacity: 0.2 }}
        modalTitle="Set Alarm"
        onCancel={() => setShowPickerExample3(false)}
        onConfirm={(pickedDuration) => {
          setAlarmStringExample3(formatTime(pickedDuration));
          setShowPickerExample3(false);
        }}
        pickerFeedback={pickerFeedback}
        setIsVisible={setShowPickerExample3}
        styles={{
          pickerLabelGap: 10,
          text: { fontWeight: "bold" },
          theme: "dark",
        }}
        visible={showPickerExample3}
      />
    </View>
  );

  const renderExample4 = (
    <LinearGradient
      colors={["#202020", "#220578"]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[styles.container, { width: pageWidth }]}
    >
      <TimerPicker
        hourLabel=":"
        LinearGradient={LinearGradient}
        MaskedView={MaskedView}
        minuteLabel=":"
        padWithNItems={2}
        pickerFeedback={pickerFeedback}
        secondLabel=""
        styles={{
          backgroundColor: "transparent",
          pickerContainer: {
            paddingHorizontal: 50,
          },
          pickerItem: {
            fontSize: 34,
          },
          pickerLabel: {
            fontSize: 32,
          },
          pickerLabelContainer: {
            marginTop: -4,
          },
          pickerLabelGap: 23,
          theme: "dark",
        }}
      />
    </LinearGradient>
  );

  const renderExample5 = (
    <View style={[styles.container, styles.page5Container, { width: pageWidth }]}>
      <TimerPicker
        hideHours
        LinearGradient={LinearGradient}
        minuteLabel="min"
        padWithNItems={3}
        pickerFeedback={pickerFeedback}
        secondLabel="sec"
        styles={{
          pickerContainer: {
            paddingHorizontal: 50,
          },
          pickerItem: {
            fontSize: 34,
          },
          pickerLabel: {
            fontSize: 26,
          },
          pickerLabelGap: 8,
          theme: "light",
        }}
      />
    </View>
  );

  const formatLiveValue = (value: number) => {
    const ampmHour = value === 0 ? 12 : value > 12 ? value - 12 : value;
    const ampm = value < 12 ? "AM" : "PM";
    return `${value} (${ampmHour} ${ampm})`;
  };

  const renderHourLimitTest = (
    <View style={[styles.container, styles.page6Container, { width: pageWidth }]}>
      <Text style={[styles.textDark, styles.testTitle]}>Cross-midnight hourLimit test</Text>
      <Text style={styles.testInstructions}>
        {"use12HourPicker + hourLimit={ min: 20, max: 5 }\n(8 PM through 5 AM, wraparound)"}
      </Text>
      <Text style={styles.testInstructions}>
        {
          "Try scrolling the hours column into the AM region.\nAM hours 12, 1, 2, 3, 4, 5 should be selectable.\n6 AM - 7 PM should snap to nearest boundary."
        }
      </Text>
      <View style={styles.liveValueBox}>
        <Text style={styles.liveValueLabel}>Live reported hour value:</Text>
        <Text style={styles.liveValueText}>{formatLiveValue(hourLimitTestValue)}</Text>
      </View>
      <TimerPicker
        hideSeconds
        hourLimit={{ max: 5, min: 20 }}
        initialValue={{ hours: 20, minutes: 0, seconds: 0 }}
        LinearGradient={LinearGradient}
        onDurationChange={(d) => setHourLimitTestValue(d.hours)}
        padWithNItems={2}
        pickerFeedback={pickerFeedback}
        styles={{
          pickerColumnWidth: { hours: 110 },
          pickerItem: { fontSize: 28 },
          pickerLabel: { fontSize: 22 },
          theme: "dark",
        }}
        use12HourPicker
      />
    </View>
  );

  const renderHourLimitSeparateTest = (
    <View style={[styles.container, styles.page6Container, { width: pageWidth }]}>
      <Text style={[styles.textDark, styles.testTitle]}>
        Cross-midnight hourLimit + separate AM/PM
      </Text>
      <Text style={styles.testInstructions}>
        {"use12HourPicker + separateAmPmPicker\nhourLimit={ min: 20, max: 5 } (8 PM – 5 AM)"}
      </Text>
      <Text style={styles.testInstructions}>
        {
          "Hour rows grey based on current AM/PM.\nAM/PM rows grey based on current hour.\nMomentum-scroll snaps within each column."
        }
      </Text>
      <View style={styles.liveValueBox}>
        <Text style={styles.liveValueLabel}>Live reported hour value:</Text>
        <Text style={styles.liveValueText}>{formatLiveValue(hourLimitSeparateTestValue)}</Text>
      </View>
      <TimerPicker
        amLabel="AM"
        hideSeconds
        hourLimit={{ max: 5, min: 20 }}
        initialValue={{ hours: 20, minutes: 0, seconds: 0 }}
        LinearGradient={LinearGradient}
        onDurationChange={(d) => setHourLimitSeparateTestValue(d.hours)}
        padHoursWithZero={false}
        padWithNItems={2}
        pickerFeedback={pickerFeedback}
        pmLabel="PM"
        separateAmPmPicker
        styles={{
          pickerItem: { fontSize: 28 },
          pickerLabel: { fontSize: 22 },
          theme: "dark",
        }}
        use12HourPicker
      />
    </View>
  );

  const pageIndicesWithDarkBackground = [0, 4, 6, 7];
  const isDarkBackground = pageIndicesWithDarkBackground.includes(currentPageIndex);
  const isFinalPage = currentPageIndex === 7;
  const isFirstPage = currentPageIndex === 0;

  const renderNavigationArrows = (
    <>
      {!isFinalPage ? (
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setCurrentPageIndex((currentPageIndex) => {
              scrollViewRef.current?.scrollTo({
                animated: true,
                x: pageWidth * (currentPageIndex + 1),
              });
              return currentPageIndex + 1;
            });
          }}
          style={({ pressed }) => [
            styles.chevronPressable,
            { right: 8 },
            pressed && styles.chevronPressable_pressed,
          ]}
        >
          <Ionicons
            color={isDarkBackground ? "#F1F1F1" : "#514242"}
            name="chevron-forward"
            size={32}
          />
        </Pressable>
      ) : null}
      {!isFirstPage ? (
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setCurrentPageIndex((currentPageIndex) => {
              scrollViewRef.current?.scrollTo({
                animated: true,
                x: pageWidth * (currentPageIndex - 1),
              });
              return currentPageIndex - 1;
            });
          }}
          style={({ pressed }) => [
            styles.chevronPressable,
            { left: 8 },
            pressed && styles.chevronPressable_pressed,
          ]}
        >
          <Ionicons
            color={isDarkBackground ? "#F1F1F1" : "#514242"}
            name="chevron-back"
            size={32}
          />
        </Pressable>
      ) : null}
    </>
  );

  return (
    <View onLayout={onRootLayout} style={styles.root}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        onMomentumScrollEnd={onMomentumScrollEnd}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {renderExample1}
        {renderExample2}
        {renderExampleSeparateAmPm}
        {renderExample3}
        {renderExample4}
        {renderExample5}
        {renderHourLimitTest}
        {renderHourLimitSeparateTest}
      </ScrollView>
      {renderNavigationArrows}
    </View>
  );
}

const styles = StyleSheet.create({
  alarmTextDark: {
    color: "#F1F1F1",
    fontSize: 48,
  },
  alarmTextLight: {
    color: "#202020",
    fontSize: 48,
  },
  button: {
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  buttonContainer: {
    marginTop: 30,
  },
  buttonDark: {
    borderColor: "#C2C2C2",
    color: "#C2C2C2",
  },
  buttonLight: { borderColor: "#8C8C8C", color: "#8C8C8C" },
  captionLight: {
    color: "#8C8C8C",
    fontSize: 13,
    marginTop: 24,
  },
  chevronPressable: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    padding: 8,
    position: "absolute",
    top: 0,
  },
  chevronPressable_pressed: {
    opacity: 0.7,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  liveValueBox: {
    alignItems: "center",
    backgroundColor: "#3A3A3A",
    borderRadius: 8,
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  liveValueLabel: {
    color: "#A0A0A0",
    fontSize: 12,
  },
  liveValueText: {
    color: "#F1F1F1",
    fontSize: 22,
    fontWeight: "600",
    marginTop: 4,
  },
  page1Container: {
    backgroundColor: "#514242",
  },
  page2Container: {
    backgroundColor: "#F1F1F1",
  },
  page3Container: {
    backgroundColor: "#F1F1F1",
  },
  page5Container: {
    backgroundColor: "#F1F1F1",
  },
  page6Container: {
    backgroundColor: "#202020",
    paddingHorizontal: 20,
  },
  pageSeparateAmPmContainer: {
    backgroundColor: "#F1F1F1",
  },
  root: {
    flex: 1,
  },
  testInstructions: {
    color: "#C2C2C2",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
  testTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  textDark: {
    color: "#F1F1F1",
    fontSize: 18,
  },
  textLight: {
    color: "#202020",
    fontSize: 18,
  },
  touchableContainer: {
    alignItems: "center",
  },
});
