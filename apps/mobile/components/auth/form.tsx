import { useEffect, useState } from "react";
import { Button, Image, SafeAreaView, View } from "react-native";
import { useDispatch } from "react-redux";
import { addEmployee } from "../../store/employees";
import Input from "./Input";
import type { AppDispatch } from "../../types/store";

interface AuthFormProps {
  formMode: string;
  onSubmit: () => void;
  checkError: boolean;
  error: Record<string, string>;
  footerContent: React.ReactNode;
}

export default function AuthForm({
  formMode,
  onSubmit,
  checkError,
  error,
  footerContent,
}: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");

  const dispatch: AppDispatch = useDispatch();

  function handleInputChange(field: string, enteredValue: string) {
    switch (field) {
      case "nombres":
        setUsername(enteredValue);
        break;
      case "apellidos":
        setUserLastName(enteredValue);
        break;
      case "companyName":
        setCompanyName(enteredValue);
        break;
      case "email":
        setEmail(enteredValue);
        break;
      case "jobTitle":
        setJobTitle(enteredValue);
        break;
      case "phone":
        setPhone(enteredValue);
        break;
      case "password":
        setPassword(enteredValue);
        break;
      case "confirmPassword":
        setConfirmPassword(enteredValue);
        break;
    }

    if (username !== "" && userLastName !== "") {
      setUserFullName(username + " " + userLastName);
    }
  }

  useEffect(() => {
    dispatch(
      addEmployee({
        username: userFullName,
        companyName,
        email,
        jobTitle,
        phone: `+591-${phone}`,
        password,
        confirmPassword,
      })
    );
  }, [
    userFullName,
    companyName,
    email,
    jobTitle,
    phone,
    password,
    confirmPassword,
    dispatch,
  ]);

  if (formMode !== "signUp") {
    return (
      <SafeAreaView className="flex-1 justify-center">
        <Image
          source={require("../../assets/icon.png")}
          className="w-[150] h-[150] mx-auto my-5"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-center">
      <Image
        source={require("../../assets/icon.png")}
        className="w-[150] h-[150] mx-auto my-5"
      />
      <View className="rounded-[12] mx-auto mb-[30] justify-center p-[15] w-[90%]">
        <Input
          label="Nombres"
          onUpdateValue={(text) => handleInputChange("nombres", text)}
          value={username}
          placeholder={"Coloque sus nombres"}
          checkError={checkError}
          error={error.username}
        />
        <Input
          label="Apellidos"
          onUpdateValue={(text) => handleInputChange("apellidos", text)}
          value={userLastName}
          placeholder={"Coloque sus apellidos"}
          checkError={checkError}
          error={error.username}
        />
        <Input
          label="Nombre de la empresa"
          onUpdateValue={(text) => handleInputChange("companyName", text)}
          value={companyName}
          placeholder={"Coloque el nombre de la empresa"}
          checkError={checkError}
          error={error.companyName}
        />
        <Input
          label="Correo"
          onUpdateValue={(text) => handleInputChange("email", text)}
          value={email}
          placeholder={"Coloque su correo@empresa.com"}
          checkError={checkError}
          error={error.email}
        />
        <Input
          label="Cargo"
          onUpdateValue={(text) => handleInputChange("jobTitle", text)}
          value={jobTitle}
          placeholder={"Coloque su cargo, ejemplo Vendedor"}
          checkError={checkError}
          error={error.jobTitle}
        />
        <Input
          label="Celular"
          onUpdateValue={(text) => handleInputChange("phone", text)}
          value={phone}
          placeholder={"77777777"}
          checkError={checkError}
          error={error.phone}
        />
        <Input
          label="Contraseña"
          onUpdateValue={(text) => handleInputChange("password", text)}
          value={password}
          placeholder={"password entre 1-12 caracteres"}
          checkError={checkError}
          error={error.password}
          secureTextEntry
        />
        <Input
          label="Confirmar Contraseña"
          onUpdateValue={(text) => handleInputChange("confirmPassword", text)}
          value={confirmPassword}
          placeholder={"repite la misma contraseña anterior"}
          checkError={checkError}
          error={error.confirmPassword}
          secureTextEntry
        />
        <View className="mt-5">
          <Button title="REGISTRAR" onPress={onSubmit} />
        </View>
        {footerContent}
      </View>
    </SafeAreaView>
  );
}
