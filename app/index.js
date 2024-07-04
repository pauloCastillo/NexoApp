import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Buttons from "../components/Buttons";
import ClockLayout from "../components/Clock";

import axios from "axios";
import * as Location from "expo-location";
import { Link } from "expo-router";

export default function App() {
  const [location, setLocation] = useState(null);
  const [text, setText] = useState(null);
  const [showTime, setShowTime] = useState("");
  const timeWorker = useRef();

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

  function handlerTimeWorker() {
    return timeWorker.current.getCurrentTime();
  }

  function renderTime(time) {
    setShowTime(time);
  }

  async function handlerWorkerTimeLocation(label) {
    const { latitude, longitude } = await location.coords;
    setText(label);
    const time = handlerTimeWorker();
    renderTime(time);
    sendLocationToServer({ latitude, longitude }, time, label);
  }

  async function sendLocationToServer(location, workerTime, text) {
    const locationTimeData = {
      location,
      workerTime,
      label: text,
    };

    console.log(locationTimeData);
    const PORT = process.env.EXPO_PUBLIC_API_URL;
    // const localhost = process.env.EXPO_PUBLIC_LOCALHOST;

    const url = `http://192.168.1.14:${PORT}/api`;

    try {
      const response = await axios.post(url + "/locations", {
        locationTimeData,
      });

      console.log(response.data);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Link href="(auths)/Register">Ir a Registrarse</Link>
      <ClockLayout ref={timeWorker} />
      <View style={styles.buttons}>
        <Buttons
          icon="arrowright"
          btnText="entrada"
          bgColor="green"
          onPress={() => handlerWorkerTimeLocation("entrada")}
        />
        <Buttons
          icon="pause"
          btnText="descanso"
          bgColor="blue"
          onPress={() => handlerWorkerTimeLocation("descanso")}
        />
        <Buttons
          icon="back"
          btnText="retorno"
          bgColor="green"
          onPress={() => handlerWorkerTimeLocation("retorno")}
        />
        <Buttons
          icon="arrowleft"
          btnText="salida"
          bgColor="red"
          onPress={() => handlerWorkerTimeLocation("salida")}
        />
      </View>
      <View style={styles.text}>
        <Text
          style={{
            textTransform: "uppercase",
            marginRight: 5,
            fontWeight: "600",
          }}
        >
          {text}:
        </Text>
        <Text>{showTime}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  buttons: {
    flexDirection: "column",
    marginTop: 40,
    marginHorizontal: "auto",
  },

  text: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    fontSize: 18,
  },
});
