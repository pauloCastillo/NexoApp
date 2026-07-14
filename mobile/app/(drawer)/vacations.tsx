import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PageShell from "../../components/ui/PageShell";
import { COLORS } from "../../constants/theme";
import {
  submitVacation,
  fetchVacations,
  selectVacations,
} from "../../store/vacations";
import { selectEmployeeID } from "../../store/employees";
import type { AppDispatch, RootState } from "../../types/store";
import type { Vacation } from "../../types/vacation";

const statusColors: Record<string, string> = {
  pendiente: COLORS.warning,
  aprobado: COLORS.success,
  rechazado: COLORS.error,
};

export default function VacationsScreen() {
  const dispatch: AppDispatch = useDispatch();
  const vacations = useSelector(selectVacations);
  const employeeID = useSelector(selectEmployeeID);

  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(fetchVacations());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      ToastAndroid.show("Selecciona las fechas", ToastAndroid.LONG);
      return;
    }
    try {
      await dispatch(
        submitVacation({ employee: employeeID, startDate, endDate })
      ).unwrap();
      ToastAndroid.show(
        "Solicitud de vacaciones enviada",
        ToastAndroid.LONG
      );
      setShowForm(false);
      setStartDate("");
      setEndDate("");
    } catch {
      ToastAndroid.show(
        "Error al solicitar vacaciones",
        ToastAndroid.LONG
      );
    }
  };

  return (
    <PageShell title="Vacaciones">
      <ScrollView className="flex-1" contentContainerClassName="p-[16]">
        <TouchableOpacity
          className="bg-primary rounded-[6] p-[16] items-center mb-[16]"
          onPress={() => setShowForm(true)}
        >
          <Text className="text-white font-bold text-sm">
            + Solicitar Vacaciones
          </Text>
        </TouchableOpacity>

        {vacations.length === 0 ? (
          <View className="bg-surface rounded-[16] p-[32] items-center shadow-sm">
            <Text className="text-sm text-textLight">
              No tienes solicitudes de vacaciones
            </Text>
          </View>
        ) : (
          vacations.map((v: Vacation) => (
            <View
              key={v._id}
              className="bg-surface rounded-[10] p-[16] mb-3 shadow-sm"
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-semibold text-text">
                  {new Date(v.startDate).toLocaleDateString()} —{" "}
                  {new Date(v.endDate).toLocaleDateString()}
                </Text>
                <View
                  style={{
                    backgroundColor: statusColors[v.status] + "20",
                  }}
                  className="px-3 py-1 rounded-[6]"
                >
                  <Text
                    style={{ color: statusColors[v.status] }}
                    className="font-semibold text-xs"
                  >
                    {v.status}
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-textSecondary mt-1">
                {Math.ceil(
                  (new Date(v.endDate).getTime() -
                    new Date(v.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                días
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showForm} animationType="slide" transparent>
        <View className="flex-1 bg-overlay justify-end">
          <ScrollView
            className="bg-surface rounded-t-[20] max-h-[60%]"
            contentContainerClassName="p-[20]"
            keyboardShouldPersistTaps="handled"
          >
            <Text className="text-lg font-semibold text-text text-center mb-[16]">
              Solicitar Vacaciones
            </Text>

            <Text className="text-xs font-semibold text-textSecondary uppercase mt-3 mb-1">
              Fecha de inicio
            </Text>
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm bg-background"
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={COLORS.textLight}
            />

            <Text className="text-xs font-semibold text-textSecondary uppercase mt-3 mb-1">
              Fecha de fin
            </Text>
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm bg-background"
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={COLORS.textLight}
            />

            <View className="mt-[20] gap-1">
              <TouchableOpacity
                className="bg-primary rounded-[6] p-[16] items-center"
                onPress={handleSubmit}
              >
                <Text className="text-white font-bold">
                  ENVIAR SOLICITUD
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 items-center"
                onPress={() => setShowForm(false)}
              >
                <Text className="text-textSecondary">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </PageShell>
  );
}
