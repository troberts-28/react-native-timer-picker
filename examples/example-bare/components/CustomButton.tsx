import React from "react";

import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

type CustomButtonProps = {
  label: string;
  onPress?: () => void;
};

export const CustomButton: React.FC<CustomButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.customButtonContainer}>
      <LinearGradient
        colors={["#CC95C0", "#DBD4B4"]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.customButtonGradient}
      >
        <Text style={styles.customButtonText}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customButtonContainer: {
    marginHorizontal: 5,
  },
  customButtonGradient: {
    borderRadius: 15,
  },
  customButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});
