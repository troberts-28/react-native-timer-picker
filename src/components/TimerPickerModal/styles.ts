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
    button: {
      borderRadius: 10,
      borderWidth: 1,
      fontSize: 16,
      marginHorizontal: 12,
      overflow: "hidden",
      paddingHorizontal: 20,
      paddingVertical: 10,
      ...customTimerPickerStyles?.text,
      ...customButtonStyle,
    },
    buttonContainer: {
      flexDirection: "row",
      marginBottom: 20,
      marginTop: 25,
      ...customButtonContainerStyle,
    },
    cancelButton: {
      backgroundColor: customTimerPickerStyles?.theme === "dark" ? "gray" : undefined,
      borderColor: "gray",
      color: customTimerPickerStyles?.theme === "dark" ? DARK_MODE_TEXT_COLOR : "gray",
      ...customTimerPickerStyles?.text,
      ...customCancelButtonStyle,
    },
    confirmButton: {
      backgroundColor: customTimerPickerStyles?.theme === "dark" ? "green" : undefined,
      borderColor: "green",
      color: customTimerPickerStyles?.theme === "dark" ? DARK_MODE_TEXT_COLOR : "green",
      ...customTimerPickerStyles?.text,
      ...customConfirmButtonStyle,
    },
    container: {
      justifyContent: "center",
      overflow: "hidden",
      ...customContainerStyle,
    },
    contentContainer: {
      alignItems: "center",
      backgroundColor:
        customTimerPickerStyles?.backgroundColor ??
        (customTimerPickerStyles?.theme === "dark"
          ? DARK_MODE_BACKGROUND_COLOR
          : LIGHT_MODE_BACKGROUND_COLOR),
      borderRadius: 20,
      justifyContent: "center",
      overflow: "hidden",
      paddingHorizontal: 20,
      ...customContentContainerStyle,
    },
    modalTitle: {
      color:
        customTimerPickerStyles?.theme === "dark" ? DARK_MODE_TEXT_COLOR : LIGHT_MODE_TEXT_COLOR,
      fontSize: 24,
      fontWeight: "600",
      marginBottom: 15,
      marginTop: 20,
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
