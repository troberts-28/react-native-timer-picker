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
        outerContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
        },
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: "10%",
            marginVertical: "70%",
            backgroundColor: "white",
            borderRadius: 20,
            ...customStyles?.container,
        },
        pickerContainer: {
            flexDirection: "row",
            marginRight: 24,
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
            color: "green"
        },
        number: {
            fontSize: 25,
        },
    });
