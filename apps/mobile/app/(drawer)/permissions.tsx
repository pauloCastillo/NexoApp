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
  submitPermission,
  fetchPermissions,
  selectPermissions,
} from "../../store/permissions";
import { selectEmployeeID } from "../../store/employees";
import type { AppDispatch, RootState } from "../../types/store";
import type { Permission, PermissionType } from "../../types/permission";

const permissionTypes: { value: PermissionType; label: string }[] = [
  { value: "permiso", label: "Permiso" },
  { value: "licencia", label: "Licencia Médica" },
  { value: "otro", label: "Otro" },
];

const statusColors: Record<string, string> = {
  pendiente: COLORS.warning,
  aprobado: COLORS.success,
  rechazado: COLORS.error,
};

export default function PermissionsScreen() {
  const dispatch: AppDispatch = useDispatch();
  const permissions = useSelector(selectPermissions);
  const employeeID = useSelector(selectEmployeeID);

  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<PermissionType>("permiso");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) {
      ToastAndroid.show("Completa todos los campos", ToastAndroid.LONG);
      return;
    }
    try {
      await dispatch(
        submitPermission({
          employee: employeeID,
          type,
          startDate,
          endDate,
          reason,
        })
      ).unwrap();
      ToastAndroid.show(
        "Permiso solicitado exitosamente",
        ToastAndroid.LONG
      );
      setShowForm(false);
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch {
      ToastAndroid.show("Error al solicitar permiso", ToastAndroid.LONG);
    }
  };

  return (
    <PageShell title="Permisos">
      <ScrollView className="flex-1" contentContainerClassName="p-[16]">
        <TouchableOpacity
          className="bg-primary rounded-[6] p-[16] items-center mb-[16]"
          onPress={() => setShowForm(true)}
        >
          <Text className="text-white font-bold text-sm">
            + Solicitar Permiso
          </Text>
        </TouchableOpacity>

        {permissions.length === 0 ? (
          <View className="bg-surface rounded-[16] p-[32] items-center shadow-sm">
            <Text className="text-sm text-textLight">
              No tienes solicitudes de permiso
            </Text>
          </View>
        ) : (
          permissions.map((p: Permission) => (
            <View
              key={p._id}
              className="bg-surface rounded-[10] p-[16] mb-3 shadow-sm"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-semibold text-text">
                  {permissionTypes.find((t) => t.value === p.type)?.label ||
                    p.type}
                </Text>
                <View
                  style={{
                    backgroundColor: statusColors[p.status] + "20",
                  }}
                  className="px-3 py-1 rounded-[6]"
                >
                  <Text
                    style={{ color: statusColors[p.status] }}
                    className="font-semibold text-xs"
                  >
                    {p.status}
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-textSecondary mb-1">
                {new Date(p.startDate).toLocaleDateString()} —{" "}
                {new Date(p.endDate).toLocaleDateString()}
              </Text>
              <Text className="text-sm text-text">{p.reason}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showForm} animationType="slide" transparent>
        <View className="flex-1 bg-overlay justify-end">
          <ScrollView
            className="bg-surface rounded-t-[20] max-h-[85%]"
            contentContainerClassName="p-[20]"
            keyboardShouldPersistTaps="handled"
          >
            <Text className="text-lg font-semibold text-text text-center mb-[16]">
              Nuevo Permiso
            </Text>

            <Text className="text-xs font-semibold text-textSecondary uppercase mt-3 mb-1">
              Tipo
            </Text>
            <View className="flex-row gap-2">
              {permissionTypes.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  className={`flex-1 p-3 rounded-[6] border items-center ${
                    type === t.value
                      ? "border-primary bg-primaryBg"
                      : "border-border"
                  }`}
                  onPress={() => setType(t.value)}
                >
                  <Text
                    className={`text-xs ${
                      type === t.value
                        ? "text-primary font-semibold"
                        : "text-textSecondary"
                    }`}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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

            <Text className="text-xs font-semibold text-textSecondary uppercase mt-3 mb-1">
              Motivo
            </Text>
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm min-h-[80] bg-background"
              style={{ textAlignVertical: "top" }}
              multiline
              numberOfLines={3}
              value={reason}
              onChangeText={setReason}
              placeholder="Describe el motivo..."
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
