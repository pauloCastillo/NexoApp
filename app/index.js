import * as Location from "expo-location";
import { Redirect, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, ToastAndroid, View, AppState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "../components/Buttons";
import ClockLayout from "../components/Clock";
import { selectEmployee, selectEmployeeID } from "../store/employees";
import {
  getLocations,
  registerTimeAndLocations,
  selectLocation,
  takeTime,
} from "../store/locations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

export default function App() {
  const [location, setLocation] = useState(null);
  const [text, setText] = useState(null);
  const [showTime, setShowTime] = useState("");
  const timeWorker = useRef();
  const employee = useSelector(selectEmployee);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const storageKey = "@register";

  const loadCredentials = async () => {
    const credentials = await AsyncStorage.getItem(storageKey);
    return JSON.parse(credentials);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      setLocation(await Location.getCurrentPositionAsync());
    })();

    (async () => {
      const credentials = await loadCredentials();
      if (credentials.userId !== "") {
        navigation.navigate("index");
      }
    })();

    const subscription = AppState.addEventListener(
      "change",
      async (appState) => {
        if (appState === "background") {
          await AsyncStorage.setItem("@lastScreen", "index");
        }

        if (appState === "active") {
          const lastScreen = await AsyncStorage.getItem("@lastScreen");
          lastScreen && navigation.navigate(lastScreen);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  function handlerTimeWorker() {
    return timeWorker.current.getCurrentTime();
  }

  function renderTime(time) {
    setShowTime(time);
  }

  useEffect(() => {
    dispatch(getLocations(location));
  }, [location]);

  function handlerWorkerTimeLocation(label) {
    setText(label);
    const time = handlerTimeWorker();
    renderTime(time);
    dispatch(takeTime({ label, time }));
    sendLocationToServer(time, label);
  }

  const employeeID = useSelector(selectEmployeeID);
  const token = useSelector((state) => state.employees.token);
  const place = useSelector(selectLocation);

  if (employee === null) {
    return <Redirect href={"(auths)/Register"} />;
  }

  const socket = io(process.env.EXPO_BASE_URL, {
    agent: "mobile",
    auth: {
      token,
    },
  });

  function sendLocationToServer(workerTime, text) {
    const locationTimeData = {
      employee: employeeID,
      label: text,
      time: workerTime,
      location: place,
    };

    try {
      socket.emit("register", () => {
        dispatch(registerTimeAndLocations(locationTimeData, token));
        ToastAndroid.show("registro del tiempo exitoso!", ToastAndroid.LONG);
      });
    } catch (error) {
      ToastAndroid.show(
        "Ocurrió un problema! " + error.message,
        ToastAndroid.LONG
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ClockLayout ref={timeWorker} />
      <View style={styles.buttons}>
        <IconButton
          icon="arrowright"
          btnText="entrada"
          index={1}
          bgColor="green"
          onPress={() => handlerWorkerTimeLocation("entrada")}
        />
        <IconButton
          icon="pause"
          btnText="descanso"
          bgColor="blue"
          index={2}
          onPress={() => handlerWorkerTimeLocation("descanso")}
        />
        <IconButton
          icon="back"
          btnText="retorno"
          bgColor="green"
          index={3}
          onPress={() => handlerWorkerTimeLocation("retorno")}
        />
        <IconButton
          icon="arrowleft"
          btnText="salida"
          bgColor="red"
          index={4}
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
