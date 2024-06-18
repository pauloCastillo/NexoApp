import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Buttons from "./components/Buttons";
import ClockLayout from "./components/Clock";

import * as Location from "expo-location";
import { SafeAreaView } from "react-native";

export default function App() {
  const [location, setLocation] = useState(null);
  const [captureTime, setCaptureTime] = useState("");
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("negacion de la location");
        return;
      }
      setLocation(await Location.getCurrentPositionAsync());
    })();
  }, []);

  async function startBtn() {
    const { latitude, longitude } = location.coords;
    sendLocationToServer({ latitude, longitude });

    const time = new Date();
    setCaptureTime(
      time.toLocaleString("es-BO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  }

  function sendLocationToServer(locate) {
    console.log(locate);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ClockLayout />
      <View style={styles.buttons}>
        <Buttons
          icon="arrowright"
          btnText="entrada"
          bgColor="green"
          onPress={startBtn}
        />
        <Buttons
          icon="pause"
          btnText="descanso"
          bgColor="blue"
          onPress={() => alert("DESCANSO")}
        />
        <Buttons
          icon="back"
          btnText="retorno"
          bgColor="green"
          onPress={() => alert("RETORNO")}
        />
        <Buttons
          icon="arrowleft"
          btnText="salida"
          bgColor="red"
          onPress={() => alert("SALIDA")}
        />
      </View>
      <Text>{captureTime}</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  buttons: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: "auto",
    justifyContent: "center",
  },
});
