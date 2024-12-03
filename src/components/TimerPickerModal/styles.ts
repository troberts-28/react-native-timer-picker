import { StyleSheet } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";

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
            // disable setting alignItems here because it can affect
            // the FlatList's ability to calculate its layout, which can
            // stop snapToOffsets working properly
            alignItems: undefined,
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
            ...customContentContainerStyle,
            // disable setting padding here because it can affect
            // the FlatList's ability to calculate its layout, which can
            // stop snapToOffsets working properly
            paddingHorizontal: 0,
            paddingVertical: 0,
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
                // set padding here instead of on modal content container because it can affect
                // the FlatList's ability to calculate its layout, which can
                // stop snapToOffsets working properly
                paddingHorizontal: 20,
                paddingTop: !variables?.hasModalTitle ? 20 : 0,
                ...(customTimerPickerStyles?.pickerContainer ?? {}),
            },
        },
    });
};
