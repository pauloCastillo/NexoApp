import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Buttons({ btnText, onPress, icon, bgColor }) {
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
