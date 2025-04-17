import { AntDesign } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { StyleSheet, Text, ToastAndroid, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IconButton({ btnText, onPress, icon, bgColor, index }) {
  const [isDisabled, setIsDisabled] = useState(false);

  const STORAGE_KEY = "@registerDates";

  const buttonId = `btn${index}`;

  useEffect(() => {
    checkButtonStatus();
  }, []);

  const checkButtonStatus = async () => {
    const today = DateTime.local().startOf("day");
    const weekday = today.weekday;

    if (weekday === 7) {
      setIsDisabled(true);
      return;
    }

    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const allButtonDates = stored ? JSON.parse(stored) : {};

    const buttonDates = (allButtonDates[buttonId] || []).map((d) =>
      DateTime.fromISO(d)
    );

    // Filtrar fechas dentro del rango de 6 días
    const validDates = buttonDates.filter(
      (dayDate) => today.diff(dayDate, "days").days < 7
    );

    const alreadyPressedToday = validDates.some((d) => d.hasSame(today, "day"));

    // Guardar nuevamente solo fechas válidas
    allButtonDates[buttonId] = validDates.map((d) => d.toISODate());
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allButtonDates));

    setIsDisabled(alreadyPressedToday);
  };

  const handlerButtonPress = async () => {
    const today = DateTime.local().toISODate();

    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const allButtonDates = stored ? JSON.parse(stored) : {};

    const buttonDates = allButtonDates[buttonId] || [];
    buttonDates.push(today);

    allButtonDates[buttonId] = buttonDates;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allButtonDates));

    setIsDisabled(true);
    ToastAndroid.show("Inhabilitado hasta mañana", ToastAndroid.LONG);
  };

  return (
    <TouchableOpacity
      style={isDisabled ? styles.disabled : styles.button}
      onPress={onPress}
      onPressOut={handlerButtonPress}
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
