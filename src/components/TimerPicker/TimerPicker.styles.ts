/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet } from "react-native";

export interface CustomTimerPickerStyles {
    theme?: "light" | "dark";
    backgroundColor?: string;
    text?: any;
    pickerContainer?: any;
    pickerLabelContainer?: any;
    pickerLabel?: any;
    pickerAmPmContainer?: any;
    pickerAmPmLabel?: any;
    pickerItemContainer?: any;
    pickerItem?: any;
    disabledPickerItem?: any;
    pickerGradientOverlay?: any;
}

const DARK_MODE_BACKGROUND_COLOR = "#232323";
const DARK_MODE_TEXT_COLOR = "#E9E9E9";
const LIGHT_MODE_BACKGROUND_COLOR = "#F1F1F1";
const LIGHT_MODE_TEXT_COLOR = "#1B1B1B";

export const generateStyles = (
    customStyles: CustomTimerPickerStyles | undefined,
    options: { padWithNItems: number }
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
        disabledPickerItem: {
            // opacity: 0.2,
            ...customStyles?.disabledPickerItem,
        },
        pickerGradientOverlay: {
            position: "absolute",
            left: 0,
            right: 0,
            height:
                options.padWithNItems === 0
                    ? "30%"
                    : (customStyles?.pickerItemContainer?.height ?? 50) * 0.8,
            ...customStyles?.pickerGradientOverlay,
        },
    });
