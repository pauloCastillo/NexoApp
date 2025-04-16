import PropTypes from "prop-types";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
export default function Input({
  label,
  onUpdateValue,
  value,
  placeholder,
  checkError,
  error,
  mode,
}) {
  const showText = "show";
  const hideText = "hide";
  const [defaultPrivacy, setDefaultPrivacy] = useState(true);

  const handlerPsswdState = () => {
    if (defaultPrivacy) {
      setDefaultPrivacy(false);
    } else {
      setDefaultPrivacy(true);
    }
  };

  const handlerKeyboardType = (label) => {
    if (label === "Celular") {
      return "numeric";
    } else if (label === "Correo") {
      return "email-address";
    } else {
      return "default";
    }
  };

  if (mode === "privateField") {
    return (
      <>
        <Text style={styles.baseText}>{label}</Text>
        <View style={styles.inputPass}>
          <TextInput
            style={styles.input}
            underlineColorAndroid={"#f42"}
            onChangeText={onUpdateValue}
            value={value}
            placeholder={placeholder}
            secureTextEntry={defaultPrivacy}
          />
          <View style={styles.btn}>
            <Button
              title={defaultPrivacy ? showText : hideText}
              onPress={handlerPsswdState}
              style={styles.btn}
            />
          </View>
        </View>
        {checkError && <Text style={styles.errorMessage}>{error}</Text>}
      </>
    );
  } else {
    return (
      <>
        <Text style={styles.baseText}>{label}</Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid={"#f42"}
          onChangeText={onUpdateValue}
          value={value}
          keyboardType={handlerKeyboardType(label)}
          placeholder={placeholder}
        />
        {checkError && <Text style={styles.errorMessage}>{error}</Text>}
      </>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
    fontWeight: "600",
    textTransform: "uppercase",
  },

  input: {
    width: "100%",
    height: 40,
    marginBottom: 15,
  },
  inputPass: {
    display: "flex",
    flexDirection: "row",
    height: 40,
  },
  errorMessage: {
    fontWeight: "600",
    fontSize: 12,
    color: "#f42",
  },
  btn: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});

Input.propTypes = {
  label: PropTypes.string,
  onUpdateValue: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  checkError: PropTypes.bool,
  error: PropTypes.string,
  mode: PropTypes.string,
};
