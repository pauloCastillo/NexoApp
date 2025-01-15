import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button, Image, SafeAreaView, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { addEmployee } from "../../store/employees";

import Input from "./Input";
export default function AuthForm({
  formMode,
  onSubmit,
  checkError,
  error,
  footerContent,
  setError,
}) {
  const [username, setUsername] = useState("");
  const [userlastname, setUserlastname] = useState("");
  const [userfullname, setUserfullname] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");

  const dispatch = useDispatch();

  const handlerError = (error) => {
    if (Object.keys(error).length > 0) {
      for (let { key } in error) {
        switch (key) {
          case "usernames":
            username === "" && setError(false);
            break;
          case "lastnames":
            lastnames === "" && setError(false);
            break;
          case "email":
            email === "" && setError(false);
            break;
          case "jobTitle":
            jobTitle === "" && setError(false);
            break;
          case "phone":
            phone === "" && setError(false);
            break;
          case "password":
            password === "" && setError(false);
            break;
          case "confirmPassword":
            confirmPassword === "" && setError(false);
            break;
        }
      }
    }
  };

  function onUpdateValueHandler(label, enteredValue) {
    switch (label.toLowerCase()) {
      case "nombres":
        setUsername(enteredValue);
        break;
      case "apellidos":
        setUserlastname(enteredValue);
        break;
      case "mail":
        setMail(enteredValue);
        break;
      case "jobtitle":
        setJobTitle(enteredValue);
        break;
      case "phone":
        setPhone(enteredValue);
        break;
      case "password":
        setPassword(enteredValue);
        break;
      case "confirmpassword":
        setConfirmPassword(enteredValue);
        break;
    }

    if (username !== "" && userlastname !== "") {
      setUserfullname(username + " " + userlastname);
    }
  }

  useEffect(() => {
    if (checkError) {
      handlerError(error);
    }

    dispatch(
      addEmployee({
        username: userfullname,
        mail,
        jobTitle,
        phone: `+591-${phone}`,
        password,
        confirmPassword,
      })
    );
  }, [
    userfullname,
    mail,
    jobTitle,
    phone,
    password,
    confirmPassword,
    checkError,
  ]);

  return (
    <SafeAreaView style={styles.regContainer}>
      <Image source={require("../../assets/icon.png")} style={styles.image} />
      {formMode === "signUp" && (
        <View style={styles.form}>
          <Input
            label="Nombres"
            onUpdateValue={onUpdateValueHandler.bind(this, "nombres")}
            value={username}
            placeholder={"Coloque sus nombres"}
            checkError={checkError}
            error={error.username}
          />
          <Input
            label="Apellidos"
            onUpdateValue={onUpdateValueHandler.bind(this, "apellidos")}
            value={userlastname}
            placeholder={"Coloque sus apellidos"}
            checkError={checkError}
            error={error.username}
          />
          <Input
            label="Correo"
            onUpdateValue={onUpdateValueHandler.bind(this, "mail")}
            value={mail}
            placeholder={"Coloque su correo@empresa.com"}
            checkError={checkError}
            error={error.mail}
          />
          <Input
            label="Cargo"
            onUpdateValue={onUpdateValueHandler.bind(this, "jobTitle")}
            value={jobTitle}
            placeholder={"Coloque su cargo, ejemplo Vendedor"}
            checkError={checkError}
            error={error.jobTitle}
          />
          <Input
            label="Celular"
            onUpdateValue={onUpdateValueHandler.bind(this, "phone")}
            value={phone}
            placeholder={"77777777"}
            checkError={checkError}
            error={error.phone}
          />
          <Input
            label="Contraseña"
            onUpdateValue={onUpdateValueHandler.bind(this, "password")}
            value={password}
            placeholder={"password entre 1-12 caracteres"}
            checkError={checkError}
            error={error.password}
            mode={"privateField"}
          />
          <Input
            label="Confirmar Contraseña"
            onUpdateValue={onUpdateValueHandler.bind(this, "confirmPassword")}
            value={confirmPassword}
            placeholder={"repite la misma contraseña anterior"}
            checkError={checkError}
            error={error.confirmPassword}
            mode={"privateField"}
          />
          <View style={styles.button}>
            <Button title="REGISTRAR" onPress={onSubmit} />
          </View>
          {footerContent}
        </View>
      )}
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
  button: {
    marginTop: 20,
  },
});

AuthForm.propTypes = {
  formMode: PropTypes.string,
  onSubmit: PropTypes.func,
  checkError: PropTypes.bool,
  error: PropTypes.object,
  footerContent: PropTypes.element,
  setError: PropTypes.func,
};
