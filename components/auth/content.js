import { Link, useNavigation } from "expo-router";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { StyleSheet, Text, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import verify from "../../constants/verify";
import {
  registerNewEmployee,
  selectEmployee,
  selectEmployeeID,
  selectStatus,
  selectToken,
} from "../../store/employees";
import AuthForm from "./form";
import LoadingOverlay from "../../app/loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthContent({ formMode }) {
  const [error, setError] = useState({});
  const [checkError, setCheckError] = useState(false);

  const employee = useSelector(selectEmployee);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const id = useSelector(selectEmployeeID);
  const token = useSelector(selectToken);
  const status = useSelector(selectStatus);
  const storageKey = "@register";

  const storageData = async (id, token) => {
    if ((id !== "", token !== "")) {
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({
          userId: id,
          userToken: token,
        })
      );
    }
  };

  useEffect(() => {
    if (status === "loading") {
      console.log(status);
    } else if (status === "succeeded") {
      storageData(id, token);
      navigation.navigate("index");
      ToastAndroid.show("Usuario registrado exitosamente!", ToastAndroid.LONG);
    } else if (status === "rejected") {
      ToastAndroid.show(
        "Usuario no registrado!, intente de nuevo",
        ToastAndroid.LONG
      );
    }
  }, [status, id, token]);

  function onSubmitHandler() {
    setError(verify(employee, "sign-up"));
    if (Object.keys(error).length > 0) {
      setCheckError(true);
      ToastAndroid.show(
        "Ocurrió un error: " + error.message,
        ToastAndroid.LONG
      );
    } else {
      dispatch(registerNewEmployee(employee));
    }
  }

  let content;
  if (formMode === "signUp") {
    content = (
      <Text style={styles.footerContent}>
        Si ya tienes una cuenta{" "}
        <Link replace href={"/Login"} style={styles.footerLink}>
          ingresa aquí
        </Link>
      </Text>
    );
  }

  return (
    <AuthForm
      formMode={formMode}
      footerContent={content}
      onSubmit={onSubmitHandler}
      checkError={checkError}
      setError={setCheckError}
      error={error}
    />
  );
}

const styles = StyleSheet.create({
  footerLink: {
    fontWeight: "600",
    textTransform: "uppercase",
    color: "blue",
  },
  footerContent: {
    textAlign: "center",
    fontWeight: "400",
    color: "blue",
    marginVertical: 15,
  },
});
AuthContent.propTypes = {
  formMode: PropTypes.string,
};
