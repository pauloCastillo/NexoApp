import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import PageShell from "../../components/ui/PageShell";
import { COLORS } from "../../constants/theme";
import type { RootState } from "../../types/store";

interface DashboardStats {
  totalEmployees: number;
  activeToday: number;
  onBreak: number;
  absent: number;
}

export default function DashboardScreen() {
  const router = useRouter();
  const role = useSelector((state: RootState) => state.employees?.role);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "manager" && role !== "admin") {
      router.replace("/(main)/home");
      return;
    }
    const timer = setTimeout(() => {
      setStats({
        totalEmployees: 12,
        activeToday: 8,
        onBreak: 2,
        absent: 2,
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [role, router]);

  if (loading) {
    return (
      <PageShell title="Dashboard">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </PageShell>
    );
  }

  return (
    <PageShell title="Dashboard">
      <ScrollView className="flex-1" contentContainerClassName="p-[16]">
        <View className="flex-row flex-wrap gap-3 mb-[20]">
          <View
            style={{ borderLeftColor: COLORS.success }}
            className="flex-1 min-w-[45%] bg-surface rounded-[10] p-[16] border-l-4 shadow-sm"
          >
            <Text className="text-[24px] font-bold text-text">
              {stats!.activeToday}
            </Text>
            <Text className="text-xs text-textSecondary mt-1">
              Activos hoy
            </Text>
          </View>
          <View
            style={{ borderLeftColor: COLORS.primary }}
            className="flex-1 min-w-[45%] bg-surface rounded-[10] p-[16] border-l-4 shadow-sm"
          >
            <Text className="text-[24px] font-bold text-text">
              {stats!.onBreak}
            </Text>
            <Text className="text-xs text-textSecondary mt-1">
              En descanso
            </Text>
          </View>
          <View
            style={{ borderLeftColor: COLORS.error }}
            className="flex-1 min-w-[45%] bg-surface rounded-[10] p-[16] border-l-4 shadow-sm"
          >
            <Text className="text-[24px] font-bold text-text">
              {stats!.absent}
            </Text>
            <Text className="text-xs text-textSecondary mt-1">Ausentes</Text>
          </View>
          <View
            style={{ borderLeftColor: COLORS.info }}
            className="flex-1 min-w-[45%] bg-surface rounded-[10] p-[16] border-l-4 shadow-sm"
          >
            <Text className="text-[24px] font-bold text-text">
              {stats!.totalEmployees}
            </Text>
            <Text className="text-xs text-textSecondary mt-1">
              Total empleados
            </Text>
          </View>
        </View>

        <View className="bg-surface rounded-[16] p-[16] mb-[16] shadow-sm">
          <Text className="text-lg font-semibold text-text mb-[16]">
            📍 Marcaciones de hoy
          </Text>
          <View className="flex-row border-b border-border pb-2 mb-2">
            <Text className="flex-[2] text-xs text-text text-left font-medium">
              Empleado
            </Text>
            <Text className="flex-1 text-xs text-text text-center">
              Entrada
            </Text>
            <Text className="flex-1 text-xs text-text text-center">
              Salida
            </Text>
          </View>
          <View className="flex-row py-2 border-b border-borderLight">
            <Text className="flex-[2] text-xs text-text text-left font-medium">
              María López
            </Text>
            <Text className="flex-1 text-xs text-text text-center">08:15</Text>
            <Text className="flex-1 text-xs text-text text-center">—</Text>
          </View>
          <View className="flex-row py-2 border-b border-borderLight">
            <Text className="flex-[2] text-xs text-text text-left font-medium">
              Carlos Ruiz
            </Text>
            <Text className="flex-1 text-xs text-text text-center">08:30</Text>
            <Text className="flex-1 text-xs text-text text-center">—</Text>
          </View>
          <View className="flex-row py-2 border-b border-borderLight">
            <Text className="flex-[2] text-xs text-text text-left font-medium">
              Ana Méndez
            </Text>
            <Text className="flex-1 text-xs text-text text-center">09:00</Text>
            <Text className="flex-1 text-xs text-text text-center">18:00</Text>
          </View>
        </View>

        <View className="bg-surface rounded-[16] p-[16] mb-[16] shadow-sm">
          <Text className="text-lg font-semibold text-text mb-[16]">
            ⏳ Permisos pendientes
          </Text>
          <Text className="text-center text-textLight py-[32]">
            No hay solicitudes pendientes
          </Text>
        </View>
      </ScrollView>
    </PageShell>
  );
}
