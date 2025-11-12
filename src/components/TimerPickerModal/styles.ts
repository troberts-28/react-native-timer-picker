import { StyleSheet } from "react-native";
import type { DimensionValue, TextStyle, ViewStyle } from "react-native";

import type { CustomTimerPickerStyles } from "../TimerPicker/styles";

export interface CustomTimerPickerModalStyles extends CustomTimerPickerStyles {
    button?: TextStyle;
    buttonContainer?: ViewStyle;
    cancelButton?: TextStyle;
    confirmButton?: TextStyle;
    container?: ViewStyle;
    contentContainer?: ViewStyle;
    modalTitle?: TextStyle;
}

const DARK_MODE_BACKGROUND_COLOR = "#232323";
const DARK_MODE_TEXT_COLOR = "#E9E9E9";
const LIGHT_MODE_BACKGROUND_COLOR = "#F1F1F1";
const LIGHT_MODE_TEXT_COLOR = "#1B1B1B";

export const generateStyles = (
    customStyles: CustomTimerPickerModalStyles | undefined,
    variables?: {
        hasModalTitle: boolean;
    }
) => {
    const {
        button: customButtonStyle,
        buttonContainer: customButtonContainerStyle,
        cancelButton: customCancelButtonStyle,
        confirmButton: customConfirmButtonStyle,
        container: customContainerStyle,
        contentContainer: customContentContainerStyle,
        modalTitle: customModalTitleStyle,
        ...customTimerPickerStyles
    } = customStyles ?? {};

    return StyleSheet.create({
        container: {
            justifyContent: "center",
            overflow: "hidden",
            ...customContainerStyle,
        },
        contentContainer: {
            backgroundColor:
                customTimerPickerStyles?.backgroundColor ??
                (customTimerPickerStyles?.theme === "dark"
                    ? DARK_MODE_BACKGROUND_COLOR
                    : LIGHT_MODE_BACKGROUND_COLOR),
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            overflow: "hidden",
            paddingHorizontal: 20,
            ...customContentContainerStyle,
        },
        buttonContainer: {
            flexDirection: "row",
            marginTop: 25,
            marginBottom: 20,
            ...customButtonContainerStyle,
        },
        button: {
            marginHorizontal: 12,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderRadius: 10,
            fontSize: 16,
            overflow: "hidden",
            ...customTimerPickerStyles?.text,
            ...customButtonStyle,
        },
        cancelButton: {
            borderColor: "gray",
            color:
                customTimerPickerStyles?.theme === "dark"
                    ? DARK_MODE_TEXT_COLOR
                    : "gray",
            backgroundColor:
                customTimerPickerStyles?.theme === "dark" ? "gray" : undefined,
            ...customTimerPickerStyles?.text,
            ...customCancelButtonStyle,
        },
        confirmButton: {
            borderColor: "green",
            color:
                customTimerPickerStyles?.theme === "dark"
                    ? DARK_MODE_TEXT_COLOR
                    : "green",
            backgroundColor:
                customTimerPickerStyles?.theme === "dark" ? "green" : undefined,
            ...customTimerPickerStyles?.text,
            ...customConfirmButtonStyle,
        },
        modalTitle: {
            fontSize: 24,
            fontWeight: "600",
            marginTop: 20,
            marginBottom: 15,
            color:
                customTimerPickerStyles?.theme === "dark"
                    ? DARK_MODE_TEXT_COLOR
                    : LIGHT_MODE_TEXT_COLOR,
            ...customTimerPickerStyles?.text,
            ...customModalTitleStyle,
        },
        timerPickerStyles: {
            ...customTimerPickerStyles,
            pickerContainer: {
                marginRight: "8%" as DimensionValue,
                paddingTop: !variables?.hasModalTitle ? 20 : 0,
                ...(customTimerPickerStyles?.pickerContainer ?? {}),
            },
        },
    });
};
