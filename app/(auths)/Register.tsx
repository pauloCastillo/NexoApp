import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/auth/Input";
import LoadingOverlay from "../../components/ui/loading";
import verify from "../../constants/verify";
import { registerPushToken } from "../../services/notifications";
import {
  registerNewEmployee,
  selectMessage,
  selectStatus,
} from "../../store/employees";
import { COLORS } from "../../constants/theme";
import type { AppDispatch } from "../../types/store";
import type { RegisterEmployeePayload } from "../../types/employee";

export default function RegisterLayout() {
  const [username, setUsername] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<Record<string, string>>({});
  const [checkError, setCheckError] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const status = useSelector(selectStatus);
  const serverMessage = useSelector(selectMessage);

  useEffect(() => {
    if (status === "succeeded") {
      registerPushToken();
      ToastAndroid.show("Registro exitoso!", ToastAndroid.LONG);
      router.replace("/(main)/home");
    } else if (status === "rejected") {
      ToastAndroid.show(serverMessage || "Error al registrarse", ToastAndroid.LONG);
    }
  }, [status, serverMessage, router]);

  function onSubmitHandler() {
    const userFullName = username + " " + userLastName;
    const employeeData: RegisterEmployeePayload = {
      username: userFullName,
      email,
      jobTitle,
      phone: `+591-${phone}`,
      password,
      confirmPassword,
    };
    if (inviteCode) {
      employeeData.inviteCode = inviteCode;
    } else {
      employeeData.companyName = companyName;
    }
    const errs = verify(employeeData, "sign-up");
    setError(errs);
    if (Object.keys(errs).length > 0) {
      setCheckError(true);
    } else {
      dispatch(registerNewEmployee(employeeData));
    }
  }

  if (status === "loading") {
    return <LoadingOverlay message="Registrando..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerClassName="grow justify-center px-[20] py-[20]"
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-[20]">
            <View className="w-[70] h-[70] rounded-[35] bg-primary items-center justify-center mb-2">
              <Text className="text-white text-[28px] font-bold">N</Text>
            </View>
            <Text className="text-[24px] font-bold text-text">Nexo</Text>
            <Text className="text-sm text-textSecondary">Crear cuenta</Text>
          </View>

          <View
            className="bg-surface rounded-[16] p-[20] shadow-md shadow-black/10"
            style={{ elevation: 4 }}
          >
            <Input
              label="Nombres"
              onUpdateValue={setUsername}
              value={username}
              placeholder={"Tus nombres"}
              checkError={checkError}
              error={error.username}
            />
            <Input
              label="Apellidos"
              onUpdateValue={setUserLastName}
              value={userLastName}
              placeholder={"Tus apellidos"}
              checkError={checkError}
              error={error.lastname}
            />
            <Input
              label="Nombre de la empresa"
              onUpdateValue={setCompanyName}
              value={companyName}
              placeholder={"Nombre de la empresa"}
              checkError={checkError}
              error={error.companyName}
            />
            <Text className="text-xs text-center text-textSecondary my-1">— o —</Text>
            <Input
              label="Código de invitación"
              onUpdateValue={setInviteCode}
              value={inviteCode}
              placeholder={"Código de invitación"}
              checkError={checkError}
            />
            <Input
              label="Correo"
              onUpdateValue={setEmail}
              value={email}
              placeholder={"correo@empresa.com"}
              checkError={checkError}
              error={error.email}
            />
            <Input
              label="Cargo"
              onUpdateValue={setJobTitle}
              value={jobTitle}
              placeholder={"Ej: Vendedor"}
              checkError={checkError}
              error={error.jobTitle}
            />
            <Input
              label="Celular"
              onUpdateValue={setPhone}
              value={phone}
              placeholder={"77777777"}
              checkError={checkError}
              error={error.phone}
            />
            <Input
              label="Contraseña"
              onUpdateValue={setPassword}
              value={password}
              placeholder={"Mínimo 4 caracteres"}
              secureTextEntry
              checkError={checkError}
              error={error.password}
            />
            <Input
              label="Confirmar Contraseña"
              onUpdateValue={setConfirmPassword}
              value={confirmPassword}
              placeholder={"Repite la contraseña"}
              secureTextEntry
              checkError={checkError}
              error={error.confirmPassword}
            />

            <View className="mt-[16] rounded-[6] overflow-hidden">
              <Button
                title="REGISTRARSE"
                onPress={onSubmitHandler}
                color={COLORS.primary}
              />
            </View>
          </View>

          <Text className="text-center font-normal text-textSecondary my-[20]">
            ¿Ya tienes una cuenta?{" "}<br/>
            <Link
              replace
              href={"Login"}
              className="font-semibold text-primary"
            >
              Inicia sesión
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
