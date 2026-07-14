import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import PageShell from "../../components/ui/PageShell";
import { COLORS } from "../../constants/theme";
import { selectEmployeeID } from "../../store/employees";
import type { RootState } from "../../types/store";

interface TimeRecord {
  date: string;
  entrada: string;
  descanso: string;
  retorno: string;
  salida: string;
}

export default function HistoryScreen() {
  const employeeID = useSelector(selectEmployeeID);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<TimeRecord[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecords([
        {
          date: "2026-05-28",
          entrada: "08:15",
          descanso: "12:00",
          retorno: "13:00",
          salida: "18:00",
        },
        {
          date: "2026-05-27",
          entrada: "08:30",
          descanso: "12:00",
          retorno: "13:00",
          salida: "17:30",
        },
        {
          date: "2026-05-26",
          entrada: "08:00",
          descanso: "12:00",
          retorno: "13:00",
          salida: "18:00",
        },
      ]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageShell title="Historial de Marcajes">
      <ScrollView className="flex-1" contentContainerClassName="p-[16]">
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 32 }}
          />
        ) : records.length === 0 ? (
          <View className="bg-surface rounded-[16] p-[32] items-center shadow-sm">
            <Text className="text-sm text-textLight">Sin registros aún</Text>
          </View>
        ) : (
          records.map((r: TimeRecord, i: number) => (
            <View
              key={i}
              className="bg-surface rounded-[10] p-[16] mb-3 shadow-sm"
            >
              <Text className="text-sm font-semibold text-text mb-[16]">
                {r.date}
              </Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-[10px] text-textSecondary mb-1">
                    Entrada
                  </Text>
                  <Text className="text-sm font-semibold text-primary">
                    {r.entrada}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-[10px] text-textSecondary mb-1">
                    Descanso
                  </Text>
                  <Text className="text-sm font-semibold text-primary">
                    {r.descanso}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-[10px] text-textSecondary mb-1">
                    Retorno
                  </Text>
                  <Text className="text-sm font-semibold text-primary">
                    {r.retorno}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-[10px] text-textSecondary mb-1">
                    Salida
                  </Text>
                  <Text className="text-sm font-semibold text-primary">
                    {r.salida}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </PageShell>
  );
}
