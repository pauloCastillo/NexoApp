import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Buttons from "../components/Buttons";
import ClockLayout from "../components/Clock";

import axios from "axios";
import * as Location from "expo-location";
import { Link } from "expo-router";

import { useSelector } from "react-redux";

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

  const employeeID = useSelector((state) => state.employees.id);

  async function sendLocationToServer(location, workerTime, text) {
    const locationTimeData = {
      employee: employeeID,
      location,
      workerTime,
      label: text,
    };

    const url = `http://192.168.1.11:8000/api`;

    try {
      const response = await axios.post(url + "/locations", {
        locationTimeData,
      });
      console.log(locationTimeData);
      if (response.status === 200) {
        console.log(response.data.newTime);
        console.log(response.data.location);
      }
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
