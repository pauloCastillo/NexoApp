import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { StyleSheet, Text, View } from "react-native";

export default forwardRef(function ClockLayout(_, ref) {
  const date = new Date();
  const [time, setTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(null);
  const [currentDay, setCurrentDay] = useState("");

  const days = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
    setCurrentDate(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).toLocaleString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    );
    days.findIndex((day, idx) => idx === date.getDay() && setCurrentDay(day));
  }, []);

  useImperativeHandle(ref, () => ({
    getCurrentTime() {
      return time.toLocaleString("es-BO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  }));

  const formatTimer = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.clock}>
      <Text style={{ fontSize: 72 }}>{formatTimer(time)}</Text>
      <Text style={{ fontSize: 24, textTransform: "capitalize" }}>
        {currentDay}
      </Text>
      <Text style={{ fontSize: 18 }}>{currentDate}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  clock: {
    alignItems: "center",
    marginTop: 100,
  },
});
