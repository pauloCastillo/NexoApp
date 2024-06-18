import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import ClockLayout from "./components/Clock";

export default function App() {
  return (
    <View style={styles.container}>
      <ClockLayout />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
});
