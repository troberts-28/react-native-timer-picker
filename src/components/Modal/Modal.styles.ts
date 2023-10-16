import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backdrop: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "black",
        opacity: 0,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
});