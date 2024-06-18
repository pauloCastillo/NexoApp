import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Buttons from "./components/Buttons";
import ClockLayout from "./components/Clock";

import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);

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
  }

  function sendLocationToServer(locate) {
    console.log(locate);
  }

  return (
    <View style={styles.container}>
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
      <StatusBar style="auto" />
    </View>
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
