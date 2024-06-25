import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Button,
} from "react-native";
import { useState } from "react";

export default function RegisterLayout() {
  const [user, setUser] = useState({
    username: "",
    mail: "",
    position: "",
    passcode: "",
  });

  function fillUserForm(e) {
    console.log(e);
    setUser("seteamos al user");
  }

  return (
    <SafeAreaView>
      <Text>Nombre y Apellido</Text>
      <TextInput
        style={styles.input}
        onChangeText={fillUserForm}
        value={user.username}
        placeholder="Nombre y Apellido"
      />

      <Text>Correo</Text>
      <TextInput
        style={styles.input}
        onChangeText={fillUserForm}
        value={user.mail}
        placeholder="correo@miempresa.com"
      />

      <Text>Cargo</Text>
      <TextInput
        style={styles.input}
        onChangeText={fillUserForm}
        value={user.position}
        placeholder="Vendedor, o el cargo que ocupa"
      />
      <View>
        <Text>Contraseña</Text>
        <TextInput
          style={styles.input}
          onChange={fillUserForm}
          value={user.passcode}
          placeholder="password entre 1-12 caracteres"
          secureTextEntry={!privacy}
        />
        <Button title={privacy ? "show" : "hide"} />
      </View>
      <Button title="REGISTRAR" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
