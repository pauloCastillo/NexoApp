import PropTypes from "prop-types";
import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { ButtonElement } from "../ui/buttonElement";
import Input from "./Input";

export default function AuthForm({ isLogin, onSubmit, checkError }) {
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);

  const visibleHandler = () => {
    setPrivacy(true);
  };

  const updateValueHandler = (inputType, enteredValue) => {
    switch (inputType) {
      case "username":
        setUsername(enteredValue);
        break;
      case "email":
        setMail(enteredValue);
        break;
      case "jobTitle":
        setJobTitle(enteredValue);
        break;
      case "password":
        setPassword(enteredValue);
        break;
      case "confirmPassword":
        setConfirmPassword(enteredValue);
        break;
      case "phone":
        setPhone(enteredValue);
        break;
    }
  };

  return (
    <>
      <View style={styles.form}>
        <Input
          label={"colaborador"}
          onUpdateValue={updateValueHandler.bind(this, "username")}
          value={username}
          placeholder={"Coloque su Nombre y Apellido"}
          checkError={checkError.username}
        />
        <Input
          label={"correo"}
          onUpdateValue={updateValueHandler.bind(this, "email")}
          value={mail}
          placeholder={"Coloque su correo@miempresa.com o servicio de correo"}
          checkError={checkError.mail}
        />
        <Input
          label={"cargo"}
          onUpdateValue={updateValueHandler.bind(this, "jobTitle")}
          value={jobTitle}
          placeholder={"Coloque su puesto de trabajo, ej: Vendedor"}
          checkError={checkError.jobTitle}
        />
        <Input
          label={"teléfono"}
          onUpdateValue={updateValueHandler.bind(this, "phone")}
          value={`+591 ${phone}`}
          placeholder={"Coloque su número de teléfono"}
          checkError={checkError.phone}
        />

        <View style={styles.inputPass}>
          <Input
            label={"contraseña"}
            onUpdateValue={updateValueHandler.bind(this, "password")}
            value={password}
            placeholder={"password entre 1-12 caracteres"}
            checkError={checkError.password}
            privacy={privacy}
          />
          <Button title={privacy ? "hide" : "show"} onPress={visibleHandler} />
        </View>

        <View style={styles.inputPass}>
          <Input
            label={"confirmar contraseña"}
            onUpdateValue={updateValueHandler.bind(this, "confirmPassword")}
            value={confirmPassword}
            placeholder={"password entre 1-12 caracteres"}
            checkError={checkError.confirmPassword}
            privacy={privacy}
          />
          <Button title={privacy ? "hide" : "show"} onPress={visibleHandler} />
        </View>
        <ButtonElement onPress={onSubmit} />
      </View>

      {isLogin && (
        <View>
          <Input
            label={"correo"}
            onUpdateValue={updateValueHandler.bind(this, "email")}
            value={mail}
            placeholder={"Coloque su correo@miempresa.com o servicio de correo"}
            checkError={checkError.mail}
          />
          <Input
            label={"password"}
            onUpdateValue={updateValueHandler.bind(this, "password")}
            value={password}
            placeholder={"Coloque su contraseña"}
            checkError={checkError.password}
          />
          <ButtonElement mode="login" onPress={onSubmit} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
  isLogin: PropTypes.bool,
  onSubmit: PropTypes.func,
  checkError: PropTypes.func,
};
