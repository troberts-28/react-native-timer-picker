import { StyleSheet } from "react-native";

export interface CustomDurationPickerStyles {
    container?: object;
    pickerContainer?: object;
    item?: object;
    buttonContainer?: object;
    button?: object;
};

export const generateStyles = (customStyles?: CustomDurationPickerStyles) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            ...customStyles?.container,
        },
        pickerContainer: {
            flexDirection: "row",
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 10,
            ...customStyles?.pickerContainer,
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
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 5,
            color: "blue",
            ...customStyles?.button,
        },
    });
