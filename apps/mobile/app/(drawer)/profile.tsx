import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import PageShell from "../../components/ui/PageShell";
import type { RootState } from "../../types/store";

export default function ProfileScreen() {
  const employee = useSelector((state: RootState) => state.employees);
  const username =
    employee?.employee?.username || "Usuario";
  const isManager =
    employee?.role === "manager";

  return (
    <PageShell title="Perfil">
      <View className="flex-1 items-center p-[20]">
        <View className="w-20 h-20 rounded-[40] bg-primary items-center justify-center mb-3 mt-[20]">
          <Text className="text-white text-[32px] font-bold">
            {username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className="text-lg font-semibold text-text mb-[20]">
          {username}
        </Text>

        <View className="w-full bg-surface rounded-[16] p-[16] shadow-sm">
          <View className="flex-row justify-between py-3">
            <Text className="text-sm text-textSecondary">Email</Text>
            <Text className="text-sm text-text font-medium">
              {employee?.employee?.email || "—"}
            </Text>
          </View>
          <View className="h-px bg-borderLight" />
          <View className="flex-row justify-between py-3">
            <Text className="text-sm text-textSecondary">Rol</Text>
            <Text className="text-sm text-text font-medium">
              {isManager ? "Manager" : "Empleado"}
            </Text>
          </View>
          <View className="h-px bg-borderLight" />
          <View className="flex-row justify-between py-3">
            <Text className="text-sm text-textSecondary">ID</Text>
            <Text className="text-sm text-text font-medium">
              {employee?.id || "—"}
            </Text>
          </View>
        </View>
      </View>
    </PageShell>
  );
}
