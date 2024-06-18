import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import ClockLayout from "./components/Clock";
import Buttons from "./components/Buttons";

export default function App() {
  return (
    <View style={styles.container}>
      <ClockLayout />
      <View style={styles.buttons}>
        <Buttons
          icon="arrowright"
          btnText="entrada"
          bgColor="green"
          onPress={() => alert("ENTRADA")}
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
