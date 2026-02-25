import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "black",
    bottom: 0,
    left: 0,
    opacity: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    zIndex: 1,
  },
});
