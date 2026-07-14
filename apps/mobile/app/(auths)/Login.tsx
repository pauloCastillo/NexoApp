import { Link, useRouter } from "expo-router";
import { useState } from "react";
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
import { loginEmployee } from "../../store/employees";
import { registerPushToken } from "../../services/notifications";
import { COLORS } from "../../constants/theme";
import type { AppDispatch, RootState } from "../../types/store";

export default function LoginLayout() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Record<string, string>>({
    mail: "",
    password: "",
  });

  const status = useSelector((state: RootState) => state.employees.status);
  const router = useRouter();

  const [checkError, setCheckError] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const onSubmitHandler = async () => {
    const validationErrors = verify({ mail, password }, "login");
    setError(validationErrors);
    if (
      validationErrors.mail === "" &&
      validationErrors.password === "" &&
      mail !== "" &&
      password !== ""
    ) {
      try {
        await dispatch(loginEmployee({ mail, password })).unwrap();
        registerPushToken().catch(() => {});
        ToastAndroid.show("Inicio de sesión exitoso", ToastAndroid.LONG);
        router.replace("/(main)/home");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error desconocido";
        ToastAndroid.show(
          "Error al iniciar sesión: " + message,
          ToastAndroid.LONG
        );
      }
    } else {
      setCheckError(true);
    }
  };

  if (status === "loading") {
    return <LoadingOverlay message="Iniciando sesión..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerClassName="grow justify-center px-[20]"
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-[32]">
            <View className="w-20 h-20 rounded-[40] bg-primary items-center justify-center mb-3">
              <Text className="text-white text-[36px] font-bold">N</Text>
            </View>
            <Text className="text-[28px] font-bold text-text">Nexo</Text>
            <Text className="text-sm text-textSecondary mt-1">
              Tu oficina de confianza
            </Text>
          </View>

          <View
            className="bg-surface rounded-[16] p-[20] shadow-md shadow-black/10"
            style={{ elevation: 4 }}
          >
            <Text className="text-lg font-semibold text-text text-center mb-[20]">
              Iniciar Sesión
            </Text>

            <Input
              label="Correo"
              onUpdateValue={setMail}
              value={mail}
              placeholder={"Correo electrónico"}
              checkError={checkError}
              error={error.mail}
            />

            <Input
              label="Contraseña"
              onUpdateValue={setPassword}
              value={password}
              placeholder={"Contraseña"}
              secureTextEntry
              checkError={checkError}
              error={error.password}
            />

            <View className="mt-[16] rounded-[6] overflow-hidden">
              <Button
                title="INGRESAR"
                onPress={onSubmitHandler}
                color={COLORS.primary}
              />
            </View>
          </View>

          <Text className="text-center font-normal text-textSecondary my-[20]">
            ¿No tienes una cuenta?{"\n "}
            <Link
              replace
              href={"Register"}
              className="font-semibold text-primary"
            >
              Regístrate aquí
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
