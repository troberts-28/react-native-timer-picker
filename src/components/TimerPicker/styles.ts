
import { StyleSheet } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

export interface CustomTimerPickerStyles {
    backgroundColor?: string;
    disabledPickerContainer?: ViewStyle;
    disabledPickerItem?: TextStyle;
    durationScrollFlatList?: ViewStyle;
    durationScrollFlatListContainer?: ViewStyle;
    durationScrollFlatListContentContainer?: ViewStyle;
    labelOffsetPercentage?: number;
    pickerAmPmContainer?: ViewStyle;
    pickerAmPmLabel?: TextStyle;
    pickerContainer?: ViewStyle & { backgroundColor?: string };
    pickerGradientOverlay?: ViewStyle;
    pickerItem?: TextStyle;
    pickerItemContainer?: ViewStyle & { height?: number };
    pickerLabel?: TextStyle;
    pickerLabelContainer?: ViewStyle;
    selectedPickerItem?: TextStyle;
    text?: TextStyle;
    theme?: "light" | "dark";
}

const DARK_MODE_BACKGROUND_COLOR = "#232323";
const DARK_MODE_TEXT_COLOR = "#E9E9E9";
const LIGHT_MODE_BACKGROUND_COLOR = "#F1F1F1";
const LIGHT_MODE_TEXT_COLOR = "#1B1B1B";

export const generateStyles = (
    customStyles: CustomTimerPickerStyles | undefined
) => {
    const backgroundColor =
        customStyles?.backgroundColor ??
        (customStyles?.theme === "dark"
            ? DARK_MODE_BACKGROUND_COLOR
            : LIGHT_MODE_BACKGROUND_COLOR);

    const textColor =
        customStyles?.theme === "dark"
            ? DARK_MODE_TEXT_COLOR
            : LIGHT_MODE_TEXT_COLOR;

    const pickerLabelFontSize =
        customStyles?.pickerLabel?.fontSize ??
        customStyles?.text?.fontSize ??
        18;
    const pickerAmPmFontSize =
        customStyles?.pickerAmPmLabel?.fontSize ??
        customStyles?.pickerLabel?.fontSize ??
        customStyles?.text?.fontSize ??
        18;
    const pickerItemFontSize =
        customStyles?.pickerItem?.fontSize ??
        customStyles?.text?.fontSize ??
        25;

    // This offset makes the picker label appear to be aligned with the picker item
    // despite them having different font sizes
    const pickerLabelVerticalOffset =
        pickerItemFontSize - pickerLabelFontSize - 1;
    const pickerAmPmVerticalOffset =
        pickerItemFontSize - pickerAmPmFontSize - 1;

    // The label is absolutely positioned, so we need to offset it for it to appear
    // in the correct position. We offset it to the left of the container so that
    // the width of the label doesn't impact its position.
    const extraLabelOffsetPercentage = customStyles?.labelOffsetPercentage ?? 8;
    const baseLeftOffsetPercentage = 70;
    const labelOffsetPercentage =
        baseLeftOffsetPercentage + extraLabelOffsetPercentage;

    return StyleSheet.create({
        pickerContainer: {
            flexDirection: "row",
            backgroundColor,
            width: "100%",
            ...customStyles?.pickerContainer,
        },
        pickerLabelContainer: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${labelOffsetPercentage}%`,
            justifyContent: "center",
            marginTop: pickerLabelVerticalOffset,
            ...customStyles?.pickerLabelContainer,
        },
        pickerLabel: {
            fontSize: 18,
            fontWeight: "bold",
            color: textColor,
            ...customStyles?.text,
            ...customStyles?.pickerLabel,
        },
        pickerItemContainer: {
            flexDirection: "row",
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            ...customStyles?.pickerItemContainer,
        },
        pickerItem: {
            textAlignVertical: "center",
            fontSize: 25,
            overflow: "visible",
            color: textColor,
            ...customStyles?.text,
            ...customStyles?.pickerItem,
        },
        selectedPickerItem: {
            textAlignVertical: "center",
            fontSize: 25,
            overflow: "visible",
            color: textColor,
            ...customStyles?.text,
            ...customStyles?.pickerItem,
            ...customStyles?.selectedPickerItem,
        },
        pickerAmPmContainer: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${labelOffsetPercentage}%`,
            justifyContent: "center",
            marginTop: pickerAmPmVerticalOffset,
            ...customStyles?.pickerLabelContainer,
            ...customStyles?.pickerAmPmContainer,
        },
        pickerAmPmLabel: {
            fontSize: 18,
            fontWeight: "bold",
            color: textColor,
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
        durationScrollFlatListContainer: {
            flex: 1,
            ...customStyles?.durationScrollFlatListContainer,
        },
        durationScrollFlatList: {
            // These paddings allow the inner am/pm label to
            // spill out of the flatlist
            paddingRight: "25%",
            marginRight: "-25%",
            ...customStyles?.durationScrollFlatList,
        },
        durationScrollFlatListContentContainer: {
            ...customStyles?.durationScrollFlatListContentContainer,
        },
    });
};