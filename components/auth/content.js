import { Link, useNavigation } from "expo-router";
import PropTypes from "prop-types";
import { useState } from "react";
import { StyleSheet, Text, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import verify from "../../constants/verify";
import {
  registerNewEmployee,
  selectEmployee,
  selectStatus,
} from "../../store/employees";
import AuthForm from "./form";
import LoadingOverlay from "../../app/loading";
export default function AuthContent({ formMode }) {
  const [error, setError] = useState({});
  const [checkError, setCheckError] = useState(false);

  const employee = useSelector(selectEmployee);
  const status = useSelector(selectStatus);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  if (status === "loading") {
    return <LoadingOverlay message="...login" />;
  }

  function onSubmitHandler() {
    setError(verify(employee, "sign-up"));
    if (Object.keys(error).length > 0) {
      setCheckError(true);
      console.log(error);
      ToastAndroid.show(
        "Ocurrio un error, vuelve a intentarlo",
        ToastAndroid.LONG
      );
    } else {
      dispatch(registerNewEmployee(employee));
      ToastAndroid.show("Registrado exitosamente!", ToastAndroid.LONG);
      navigation.navigate("index");
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
