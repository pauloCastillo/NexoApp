import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function Buttons(props) {
  const { btnText, onPress, icon, bgColor } = props;

  return (
    <TouchableOpacity style={{ ...styles.button }} onPress={onPress}>
      <AntDesign
        name={icon}
        size={24}
        color={bgColor}
        style={{ textAlign: "center" }}
      />
      <Text style={{ textAlign: "center", fontSize: 16 }}>{btnText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 120,
    borderColor: "#333",
    borderWidth: 2,
    maxWidth: 120,
    maxHeight: 120,
    margin: 5,
    padding: 16,
  },
});
