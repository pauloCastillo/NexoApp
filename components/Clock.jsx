import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ClockLayout() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000 * 60);
  }, []);

  const formatTimer = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.clock}>
      <Text style={{ color: "#fff", fontSize: 72 }}>{formatTimer(time)}</Text>
      <Text style={{ color: "#fff", fontSize: 24 }}>Lunes</Text>
      <Text style={{ color: "#fff", fontSize: 24 }}>18/206/2024</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  clock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
