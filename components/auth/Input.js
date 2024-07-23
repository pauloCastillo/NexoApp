import PropTypes from "prop-types";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
export default function Input({
  label,
  onUpdateValue,
  value,
  placeholder,
  checkError,
  error,
  mode,
  privacy,
}) {
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
            secureTextEntry={privacy}
          />
          <Button title={privacy ? "show" : "hide"} />
          {checkError && <Text style={styles.errorMessage}>{error}</Text>}
        </View>
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
    height: 40,
    marginBottom: 15,
  },
  inputPass: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 40,
  },
  errorMessage: {
    fontWeight: "600",
    fontSize: 12,
    color: "#f42",
  },
});

Input.propTypes = {
  label: PropTypes.string,
  onUpdateValue: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  checkError: PropTypes.bool,
  error: PropTypes.string,
  privacy: PropTypes.bool,
  mode: PropTypes.string,
};
