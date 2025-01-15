import { AntDesign } from "@expo/vector-icons";
import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
export default function IconButton({ btnText, onPress, icon, bgColor }) {
  let defaultAnimation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const startAnimation = useAnimatedStyle(() => ({
    transform: [{ translateX: defaultAnimation.value }],
    opacity: opacity.value,
  }));

  const handlerPressOut = () => {
    defaultAnimation.value = withTiming(-defaultAnimation.value, {
      duration:500,
      easing: Easing.linear(100)
    }),
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      onPressOut={handlerPressOut}
    >
      <Animated.View style={startAnimation}>
        <AntDesign
          name={icon}
          size={24}
          color={bgColor}
          style={{ textAlign: "center" }}
        />
        <Text style={{ textAlign: "center", fontSize: 16 }}>{btnText}</Text>
      </Animated.View>
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
