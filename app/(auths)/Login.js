import { useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RegisterLayout() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.regContainer}>
      <Image source={require("../../assets/icon.png")} style={styles.image} />
      <View style={styles.form}>
        <Text style={styles.baseText}>Correo</Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid={"#f42"}
          onChangeText={(event) => setMail(event)}
          value={mail}
          placeholder="correo@miempresa.com"
        />
        <Text style={styles.baseText}>Contraseña</Text>
        <View style={styles.inputPass}>
          <TextInput
            style={styles.input}
            underlineColorAndroid={"#f42"}
            onChangeText={(event) => setPassword(event)}
            value={password}
            placeholder="password entre 1-12 caracteres"
            secureTextEntry={!privacy}
          />
          <Button title={privacy ? "show" : "hide"} />
        </View>
      </View>
      <Button title="INGRESAR" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  regContainer: {
    flex: 1,
    justifyContent: "center",
  },

  image: {
    width: 150,
    height: 150,
    marginHorizontal: "auto",
    marginVertical: 20,
  },

  form: {
    borderRadius: 12,
    marginHorizontal: "auto",
    marginBottom: 24,
    flex: 0,
    padding: 15,
    width: "80%",
  },

  baseText: {
    fontWeight: "600",
    textTransform: "uppercase",
  },

  input: {
    height: 40,
    marginBottom: 10,
  },

  inputPass: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 40,
  },
});
