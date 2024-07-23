import PropTypes from "prop-types";
import { Pressable, StyleSheet } from "react-native";

export default function ButtonElement({ children, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.btnForm}>
      <Text>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btnForm: {
    backgroundColor: "#f42",
    color: "#333",
    textTransform: "uppercase",
  },
});

ButtonElement.propTypes = {
  children: PropTypes.string,
  onPress: PropTypes.func,
};
