import { useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";

import verify from "../../constants/verify";

export default function RegisterLayout() {
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState({
    username: "",
    mail: "",
    password: "",
    jobTitle: "",
    phone: "",
  });
  const [checkError, setCheckError] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  function submit(e) {
    e.preventDefault();
    const user = {
      username,
      mail,
      password,
      jobTitle,
      phone,
    };
    setError(verify(user));
    if (Object.getOwnPropertyNames(error).length !== 0) {
      setCheckError(true);
      console.log(error);
    } else {
      console.log("ENVIAR DATOS A BACKEND");
    }
  }

  return (
    <SafeAreaView style={styles.regContainer}>
      <Image source={require("../../assets/icon.png")} style={styles.image} />
      <View style={styles.form}>
        <Text style={styles.baseText}>Nombre y Apellido</Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid={"#f42"}
          onChangeText={setUsername}
          value={username}
          placeholder="Nombre y Apellido"
        />
        {checkError && (
          <Text style={styles.errorMessage}>{error.username}</Text>
        )}

        <Text style={styles.baseText}>Correo</Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid={"#f42"}
          onChangeText={setMail}
          value={mail}
          placeholder="correo@miempresa.com"
        />
        {checkError && <Text style={styles.errorMessage}>{error.mail}</Text>}

        <Text style={styles.baseText}>Cargo</Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid={"#f42"}
          onChangeText={setJobTitle}
          value={jobTitle}
          placeholder="Vendedor, o el cargo que ocupa"
        />
        {checkError && (
          <Text style={styles.errorMessage}>{error.jobTitle}</Text>
        )}

        <Text style={styles.baseText}>n° de celular</Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid={"#f42"}
          onChangeText={setPhone}
          value={phone}
          placeholder="+591-777-77777"
        />
        {checkError && <Text style={styles.errorMessage}>{error.phone}</Text>}

        <Text style={styles.baseText}>Contraseña</Text>
        <View style={styles.inputPass}>
          <TextInput
            style={styles.input}
            underlineColorAndroid={"#f42"}
            onChangeText={setPassword}
            value={password}
            placeholder="password entre 1-12 caracteres"
            secureTextEntry={!privacy}
          />
          <Button title={privacy ? "show" : "hide"} />
        </View>
        {checkError && (
          <Text style={styles.errorMessage}>{error.password}</Text>
        )}

        <Text style={styles.baseText}>confirma contraseña</Text>
        <View style={styles.inputPass}>
          <TextInput
            style={styles.input}
            underlineColorAndroid={"#f42"}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="password entre 1-12 caracteres"
            secureTextEntry={!privacy}
          />
          <Button title={privacy ? "show" : "hide"} />
        </View>
      </View>
      <Button title="REGISTRAR" onPress={submit} />
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
    marginBottom: 30,
    justifyContent: "center",
    padding: 15,
    width: "90%",
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

  errorMessage: {
    fontWeight: "600",
    fontSize: 12,
    color: "#f42",
  },
});
