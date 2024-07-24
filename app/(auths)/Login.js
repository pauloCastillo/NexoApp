import { Link, useNavigation } from "expo-router";
import { useState, useEffect } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/auth/Input";
import LoadingOverlay from "../../components/ui/loading";
import verify from "../../constants/verify";
import {
  addEmployee,
  loginEmployee,
  selectEmployee,
  selectMessage,
} from "../../store/employees";

export default function LoginLayout() {
  const [mail, setMail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState({
    mail: "",
    password: "",
  });

  const status = useSelector((state) => state.employees.status);
  const navigation = useNavigation();

  const [checkError, setCheckError] = useState(false);
  const employee = useSelector(selectEmployee);
  const message = useSelector(selectMessage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addEmployee({ mail, password }));
  }, [mail, password]);

  if (status === "loading") {
    loadingComponent();
  }

  function loadingComponent() {
    return <LoadingOverlay message="...login" />;
  }

  const onSubmitHandler = () => {
    if (employee !== null) {
      setError(verify(employee, "login"));
      if (Object.getOwnPropertyNames(error).length !== 0) {
        setCheckError(true);
      } else {
        dispatch(loginEmployee(employee));
        ToastAndroid.show(message, ToastAndroid.LONG);
        navigation.replace("index");
      }
    } else {
      setCheckError(true);
    }
  };

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
          error={error.mail}
        />
        <Input
          label="Contraseña"
          onUpdateValue={setPassword}
          value={password}
          placeholder={"contraseña mínimo de 6 caracteres"}
          mode={"privateField"}
          privacy={true}
          checkError={checkError}
          error={error.password}
        />
        <Button title="INGRESAR" onPress={onSubmitHandler} />
      </View>
      <Text style={styles.footerContent}>
        Si no tienes una cuenta
        <Link replace href={"Register"}>
          regístrate aquí
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
