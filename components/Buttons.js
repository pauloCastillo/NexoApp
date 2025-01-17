import { AntDesign } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { StyleSheet, Text, ToastAndroid, TouchableOpacity } from "react-native";
export default function IconButton({ btnText, onPress, icon, bgColor, index }) {
  const today = new Date();
  const tomorrow = new Date().getDate() + 1;
  const [isDisabled, setIsDisabled] = useState(false);

  const handlerPressOut = () => {
    switch (index) {
      case 1:
      case 2:
      case 3:
      case 4:
        setIsDisabled(true);
        ToastAndroid.show("inhabilitado hasta mañana", ToastAndroid.LONG);
        break;
    }
  };

  useEffect(() => {
    if (today.getDate() === tomorrow) {
      setIsDisabled(false);
    }
  }, []);

  return (
    <TouchableOpacity
      style={isDisabled ? styles.disabled : styles.button}
      onPress={onPress}
      onPressOut={handlerPressOut}
      disabled={isDisabled}
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
  disabled: {
    opacity: 0.3,
    borderColor: "#f42",
    borderRadius: 120,
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
