import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button, Image, SafeAreaView, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { addEmployee } from "../../store/employees";

import Input from "./input";
export default function AuthForm({
  formMode,
  onSubmit,
  checkError,
  error,
  footerContent,
}) {
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);

  const dispatch = useDispatch();

  function onUpdateValueHandler(label, enteredValue) {
    switch (label) {
      case "username":
        setUsername(enteredValue);
        break;
      case "mail":
        setMail(enteredValue);
        break;
      case "jobTitle":
        setJobTitle(enteredValue);
        break;
      case "phone":
        setPhone(enteredValue);
        break;
      case "password":
        setPassword(enteredValue);
        setPrivacy(true);
        break;
      case "confirmPassword":
        setConfirmPassword(enteredValue);
        setPrivacy(true);
        break;
    }
  }
  useEffect(() => {
    dispatch(
      addEmployee({
        username,
        mail,
        jobTitle,
        phone: `+591-${phone}`,
        password,
        confirmPassword,
      })
    );
  }, [username, mail, jobTitle, phone, password, confirmPassword]);

  return (
    <SafeAreaView style={styles.regContainer}>
      <Image source={require("../../assets/icon.png")} style={styles.image} />
      {formMode === "signUp" && (
        <View style={styles.form}>
          <Input
            label="Nombre y Apellido"
            onUpdateValue={onUpdateValueHandler.bind(this, "username")}
            value={username}
            placeholder={"Coloque su nombre y apellido"}
            privacy={privacy}
            checkError={checkError}
            error={error.username}
          />
          <Input
            label="Correo"
            onUpdateValue={onUpdateValueHandler.bind(this, "mail")}
            value={mail}
            placeholder={"Coloque su correo@empresa.com"}
            privacy={privacy}
            checkError={checkError}
            error={error.mail}
          />
          <Input
            label="Cargo"
            onUpdateValue={onUpdateValueHandler.bind(this, "jobTitle")}
            value={jobTitle}
            placeholder={"Coloque su cargo, ejemplo Vendedor"}
            privacy={privacy}
            checkError={checkError}
            error={error.jobTitle}
          />
          <Input
            label="Celular"
            onUpdateValue={onUpdateValueHandler.bind(this, "phone")}
            value={phone}
            placeholder={"77777777"}
            privacy={privacy}
            checkError={checkError}
            error={error.phone}
          />
          <Input
            label="Contraseña"
            onUpdateValue={onUpdateValueHandler.bind(this, "password")}
            value={password}
            placeholder={"password entre 1-12 caracteres"}
            privacy={privacy}
            checkError={checkError}
            error={error.password}
            mode={"privateField"}
          />
          <Input
            label="Confirmar Contraseña"
            onUpdateValue={onUpdateValueHandler.bind(this, "confirmPassword")}
            value={confirmPassword}
            placeholder={"repite la misma contraseña anterior"}
            privacy={privacy}
            checkError={checkError}
            error={error.confirmPassword}
            mode={"privateField"}
          />
          <Button title="REGISTRAR" onPress={onSubmit} />
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
});

AuthForm.propTypes = {
  formMode: PropTypes.string,
  onSubmit: PropTypes.func,
  checkError: PropTypes.bool,
  error: PropTypes.object,
  footerContent: PropTypes.element,
};
