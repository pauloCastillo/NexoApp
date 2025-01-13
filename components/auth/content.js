import { Link, useNavigation } from "expo-router";
import PropTypes from "prop-types";
import { useState } from "react";
import { StyleSheet, Text, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import verify from "../../constants/verify";
import {
  registerNewEmployee,
  selectEmployee,
  selectMessage,
  selectStatus,
} from "../../store/employees";
import AuthForm from "./form";

export default function AuthContent({ formMode }) {
  const [error, setError] = useState({
    username: "",
    mail: "",
    password: "",
    jobTitle: "",
    confirmPassword: "",
    phone: "",
  });
  const [checkError, setCheckError] = useState(false);

  const employee = useSelector(selectEmployee);
  const status = useSelector(selectStatus);
  const message = useSelector(selectMessage);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  if (status === "loading") {
    return <LoadingOverlay message="...login" />;
  }

  function onSubmitHandler() {
    if (employee !== null) {
      setError(verify(employee, "sign-up"));
      if (Object.getOwnPropertyNames(error).length !== 0) {
        setCheckError(true);
      } else {
        console.log(employee);
        console.log(error);
        // dispatch(registerNewEmployee(employee));
        ToastAndroid.show(message, ToastAndroid.LONG);
        navigation.replace("index");
      }
    } else {
      ToastAndroid.show(message, ToastAndroid.LONG);
      setCheckError(true);
    }
  }

  let content;
  if (formMode === "signUp") {
    content = (
      <Text style={styles.footerContent}>
        Si ya tienes una cuenta{" "}
        <Link replace href={"/Login"}>
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
      error={error}
    />
  );
}

const styles = StyleSheet.create({
  footerContent: {
    textAlign: "center",
    fontWeight: "600",
    color: "blue",
    marginVertical: 15,
  },
});
AuthContent.propTypes = {
  formMode: PropTypes.string,
};
