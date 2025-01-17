import * as Location from "expo-location";
import { Redirect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "../components/Buttons";
import ClockLayout from "../components/Clock";
import { selectEmployee, selectEmployeeID } from "../store/employees";
import {
  getLocations,
  registerTimeAndLocations,
  selectLocation,
  selectMessage,
  takeTime,
} from "../store/locations";

export default function App() {
  const [location, setLocation] = useState(null);
  const [text, setText] = useState(null);
  const [showTime, setShowTime] = useState("");
  const timeWorker = useRef();
  const employee = useSelector(selectEmployee);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
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

  useEffect(() => {
    dispatch(getLocations(location));
  }, [location]);

  function handlerWorkerTimeLocation(label) {
    setText(label);
    console.log("registrado");
    const time = handlerTimeWorker();
    renderTime(time);
    dispatch(takeTime({ label, time }));
    sendLocationToServer(time, label);
  }

  const employeeID = useSelector(selectEmployeeID);
  const message = useSelector(selectMessage);
  const token = useSelector((state) => state.employees.token);
  const place = useSelector(selectLocation);

  if (employee === null) {
    return <Redirect href={"(auths)/Register"} />;
  }

  function sendLocationToServer(workerTime, text) {
    const locationTimeData = {
      employee: employeeID,
      location: place,
      workerTime,
      label: text,
      token,
    };

    try {
      dispatch(registerTimeAndLocations(locationTimeData));
      ToastAndroid.show(message, ToastAndroid.LONG);
    } catch (error) {
      ToastAndroid.show(message, ToastAndroid.LONG);
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
