import { AntDesign } from "@expo/vector-icons";
import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function IconButton({ btnText, onPress, icon, bgColor }) {
  return (
    <TouchableOpacity
      style={{ ...styles.button }}
      onPress={onPress}
      disabled={disabled}
    >
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

IconButton.propTypes = {
  btnText: PropTypes.string,
  bgColor: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func,
};
