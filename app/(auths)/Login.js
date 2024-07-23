import { Link, Redirect, useNavigation } from "expo-router";
import { useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/auth/input";
import LoadingOverlay from "../../components/ui/loading";
import { loginEmployee } from "../../store/employees";

export default function LoginLayout() {
  const [mail, setMail] = useState(null);
  const [password, setPassword] = useState(null);
  const [privacy, setPrivacy] = useState(false);
  const [error, setError] = useState({
    mail: "",
    password: "",
  });

  const status = useSelector((state) => state.employees.status);
  console.log(status);
  const navigation = useNavigation();

  const [checkError, setCheckError] = useState(false);
  const dispatch = useDispatch();

  if (status === "loading") {
    <LoadingOverlay message="...login" />;
  } else {
    <Redirect href={"/"} />;
  }

  const onSubmitHandler = () => {
    const credentials = {
      mail,
      password,
    };

    dispatch(loginEmployee(credentials));
    navigation.navigate("index");
  };

  function privacyHandler(field, value) {
    if (password !== null && field === "password") {
      setPrivacy(true);
    }
  }

  return (
    <SafeAreaView>
      <Image source={require("../../assets/icon.png")} style={styles.image} />
      <View style={styles.form}>
        <Input
          label="Correo"
          onUpdateValue={setMail}
          value={mail}
          placeholder={"Coloque su correo@empresa.com"}
          checkError={checkError}
          error={error}
        />
        <Input
          label="Contraseña"
          onUpdateValue={setPassword}
          value={password}
          placeholder={"contraseña mínimo de 6 caracteres"}
          mode={"privateField"}
          privacy={true}
          checkError={checkError}
          error={error}
        />
        <Button title="INGRESAR" onPress={onSubmitHandler} />
      </View>
      <Text style={styles.footerContent}>
        Si no tienes una cuenta{" "}
        <Link replace href={"Register"}>
          registrate aqui
        </Link>
      </Text>
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
  inputPass: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 40,
  },

  footerContent: {
    textAlign: "center",
    fontWeight: "600",
    color: "blue",
    marginVertical: 15,
  },
});
