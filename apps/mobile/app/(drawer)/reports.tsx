import { View, Text, TouchableOpacity } from "react-native";
import PageShell from "../../components/ui/PageShell";

export default function ReportsScreen() {
  return (
    <PageShell title="Reportes">
      <View className="flex-1 p-[16] justify-center">
        <View className="bg-surface rounded-[16] p-[24] items-center shadow-md">
          <Text className="text-lg font-semibold text-text mb-[16]">
            Reportes próximamente
          </Text>
          <Text className="text-sm text-textSecondary text-center mb-[20]">
            Podrás exportar reportes de marcaciones, órdenes de trabajo y más.
          </Text>
          <TouchableOpacity className="bg-primaryBg rounded-[6] p-[16] border border-primary">
            <Text className="text-primary font-semibold">
              Exportar Reporte Semanal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </PageShell>
  );
}
