import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import PageShell from "../../components/ui/PageShell";
import { resetAuth } from "../../store/employees";
import { clearTokens } from "../../services/token";
import type { AppDispatch } from "../../types/store";

export default function SettingsScreen() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const handleLogout = async () => {
    await clearTokens();
    dispatch(resetAuth());
    ToastAndroid.show("Sesión cerrada", ToastAndroid.LONG);
    router.replace("/(auths)/Login" as never);
  };

  return (
    <PageShell title="Configuración">
      <View className="flex-1 p-[16]">
        <View className="bg-surface rounded-[16] p-[16] shadow-sm mb-[20]">
          <Text className="text-base font-semibold text-text mb-[16]">
            Preferencias
          </Text>
          <TouchableOpacity className="flex-row justify-between py-3">
            <Text className="text-sm text-text">Notificaciones</Text>
            <Text className="text-sm text-textSecondary">Activadas</Text>
          </TouchableOpacity>
          <View className="h-px bg-borderLight" />
          <TouchableOpacity className="flex-row justify-between py-3">
            <Text className="text-sm text-text">Idioma</Text>
            <Text className="text-sm text-textSecondary">Español</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-surface rounded-[10] p-[16] items-center border border-error"
          onPress={handleLogout}
        >
          <Text className="text-error font-semibold text-sm">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </PageShell>
  );
}
