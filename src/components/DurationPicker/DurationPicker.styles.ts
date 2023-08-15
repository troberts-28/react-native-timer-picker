import { StyleSheet } from "react-native";

export interface CustomDurationPickerStyles {
    theme?: "light" | "dark";
    backgroundColor?: string;
    textColor?: string;
    pickerContainer?: any;
    pickerLabel?: any;
    pickerItemContainer?: any;
    pickerItem?: any;
    buttonContainer?: any;
    button?: any;
    cancelButton?: any;
    confirmButton?: any;
    modalTitle?: any;
}

const DARK_MODE_BACKGROUND_COLOR = "#232323";
const DARK_MODE_TEXT_COLOR = "#E9E9E9";
const LIGHT_MODE_BACKGROUND_COLOR = "#F1F1F1";
const LIGHT_MODE_TEXT_COLOR = "#1B1B1B";

export const generateStyles = (customStyles?: CustomDurationPickerStyles) =>
    StyleSheet.create({
        pickerContainer: {
            flexDirection: "row",
            marginRight: "8%",
            backgroundColor:
                customStyles?.backgroundColor ?? customStyles?.theme === "dark"
                    ? DARK_MODE_BACKGROUND_COLOR
                    : LIGHT_MODE_BACKGROUND_COLOR,
            ...customStyles?.pickerContainer,
        },
        pickerLabelContainers: {
            position: "absolute",
            right: 4,
            top: 0,
            bottom: 0,
            justifyContent: "center",
        },
        pickerLabel: {
            fontSize: 18,
            fontWeight: "bold",
            marginTop: (customStyles?.pickerItem?.fontSize ?? 25) / 6,
            color:
                customStyles?.textColor ?? customStyles?.theme === "dark"
                    ? DARK_MODE_TEXT_COLOR
                    : LIGHT_MODE_TEXT_COLOR,
            ...customStyles?.pickerLabel,
        },
        pickerItemContainer: {
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            width: 90,
            ...customStyles?.pickerItemContainer,
        },
        pickerItem: {
            textAlignVertical: "center",
            fontSize: 25,
            color:
                customStyles?.textColor ?? customStyles?.theme === "dark"
                    ? DARK_MODE_TEXT_COLOR
                    : LIGHT_MODE_TEXT_COLOR,
            ...customStyles?.pickerItem,
        },
        pickerGradientOverlays: {
            position: "absolute",
            left: 0,
            right: 0,
            height: "30%",
        },
    });
