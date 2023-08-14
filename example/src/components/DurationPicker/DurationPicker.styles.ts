import { StyleSheet } from "react-native";

export interface CustomDurationPickerStyles {
    container?: object;
    pickerContainer?: object;
    item?: object;
    buttonContainer?: object;
    button?: object;
}

export const generateStyles = (customStyles?: CustomDurationPickerStyles) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            ...customStyles?.container,
        },
        contentContainer: {
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            padding: 20,
        },
        pickerContainer: {
            flexDirection: "row",
            ...customStyles?.pickerContainer,
        },
        label: {
            position: "absolute",
            right: 4,
            top: 0,
            bottom: 0,
            textAlignVertical: "center",
            fontSize: 18,
            fontWeight: "bold",
        },
        item: {
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            width: 100,
            ...customStyles?.item,
        },
        number: {
            textAlignVertical: "center",
            fontSize: 25,
        },
        buttonContainer: {
            flexDirection: "row",
            marginTop: 20,
            ...customStyles?.buttonContainer,
        },
        button: {
            marginHorizontal: 10,
            padding: 10,
            borderWidth: 1,
            borderRadius: 10,
            ...customStyles?.button,
        },
        cancelButton: {
            borderColor: "gray",
            color: "gray",
        },
        confirmButton: {
            borderColor: "green",
            color: "green",
        },
    });
