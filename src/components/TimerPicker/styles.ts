import { StyleSheet } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

export interface CustomTimerPickerStyles {
    backgroundColor?: string;
    disabledPickerContainer?: ViewStyle;
    disabledPickerItem?: TextStyle;
    durationScrollFlatList?: ViewStyle;
    durationScrollFlatListContainer?: ViewStyle;
    durationScrollFlatListContentContainer?: ViewStyle;
    pickerAmPmContainer?: ViewStyle;
    pickerAmPmLabel?: TextStyle;
    pickerContainer?: ViewStyle & { backgroundColor?: string };
    pickerGradientOverlay?: ViewStyle;
    pickerItem?: TextStyle;
    pickerItemContainer?: ViewStyle & { height?: number };
    pickerLabel?: TextStyle;
    pickerLabelContainer?: ViewStyle;
    text?: TextStyle;
    theme?: "light" | "dark";
}

const DARK_MODE_BACKGROUND_COLOR = "#232323";
const DARK_MODE_TEXT_COLOR = "#E9E9E9";
const LIGHT_MODE_BACKGROUND_COLOR = "#F1F1F1";
const LIGHT_MODE_TEXT_COLOR = "#1B1B1B";

export const generateStyles = (
    customStyles: CustomTimerPickerStyles | undefined
) =>
    StyleSheet.create({
        pickerContainer: {
            flexDirection: "row",
            marginRight: "8%",
            backgroundColor:
                customStyles?.backgroundColor ??
                (customStyles?.theme === "dark"
                    ? DARK_MODE_BACKGROUND_COLOR
                    : LIGHT_MODE_BACKGROUND_COLOR),
            ...customStyles?.pickerContainer,
        },
        pickerLabelContainer: {
            position: "absolute",
            right: 4,
            top: 0,
            bottom: 0,
            justifyContent: "center",
            minWidth:
                (customStyles?.pickerLabel?.fontSize ??
                    customStyles?.text?.fontSize ??
                    25) * 0.65,
            ...customStyles?.pickerLabelContainer,
        },
        pickerLabel: {
            fontSize: 18,
            fontWeight: "bold",
            marginTop:
                (customStyles?.pickerItem?.fontSize ??
                    customStyles?.text?.fontSize ??
                    25) / 6,
            color:
                customStyles?.theme === "dark"
                    ? DARK_MODE_TEXT_COLOR
                    : LIGHT_MODE_TEXT_COLOR,
            ...customStyles?.text,
            ...customStyles?.pickerLabel,
        },
        pickerItemContainer: {
            flexDirection: "row",
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            width: (customStyles?.pickerItem?.fontSize ?? 25) * 3.6,
            ...customStyles?.pickerItemContainer,
        },
        pickerItem: {
            textAlignVertical: "center",
            fontSize: 25,
            color:
                customStyles?.theme === "dark"
                    ? DARK_MODE_TEXT_COLOR
                    : LIGHT_MODE_TEXT_COLOR,
            ...customStyles?.text,
            ...customStyles?.pickerItem,
        },
        pickerAmPmContainer: {
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: "center",
            ...customStyles?.pickerLabelContainer,
            ...customStyles?.pickerAmPmContainer,
        },
        pickerAmPmLabel: {
            fontSize: 18,
            fontWeight: "bold",
            marginTop: (customStyles?.pickerItem?.fontSize ?? 25) / 6,
            color:
                customStyles?.theme === "dark"
                    ? DARK_MODE_TEXT_COLOR
                    : LIGHT_MODE_TEXT_COLOR,
            ...customStyles?.text,
            ...customStyles?.pickerLabel,
            ...customStyles?.pickerAmPmLabel,
        },
        disabledPickerContainer: {
            opacity: 0.4,
            ...customStyles?.disabledPickerContainer,
        },
        disabledPickerItem: {
            opacity: 0.2,
            ...customStyles?.disabledPickerItem,
        },
        maskedView: {
            flex: 1,
        },
        pickerGradientOverlay: {
            position: "absolute",
            width: "100%",
            height: "100%",
            ...customStyles?.pickerGradientOverlay,
        },
        durationScrollFlatList: {
            minWidth: 1,
            width: "300%",
            ...customStyles?.durationScrollFlatList,
        },
        durationScrollFlatListContainer: {
            overflow: "visible",
            ...customStyles?.durationScrollFlatListContainer,
        },
        durationScrollFlatListContentContainer: {
            ...customStyles?.durationScrollFlatListContentContainer,
        },
    });
