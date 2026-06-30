import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PageShell from "../../components/ui/PageShell";
import { COLORS } from "../../constants/theme";
import {
  fetchClients,
  createClient,
  selectClients,
} from "../../store/clients";
import { selectEmployeeID } from "../../store/employees";
import type { AppDispatch, RootState } from "../../types/store";
import type { Client, CreateClientPayload } from "../../types/client";

export default function ClientsScreen() {
  const dispatch: AppDispatch = useDispatch();
  const clients = useSelector(selectClients);
  const employeeID = useSelector(selectEmployeeID);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [newClient, setNewClient] = useState<CreateClientPayload>({
    contactName: "",
    contactLastName: "",
    email: "",
    phone: "",
    companyName: "",
  });

  useEffect(() => {
    dispatch(fetchClients()).finally(() => setLoading(false));
  }, [dispatch]);

  const handleCreate = async () => {
    if (!newClient.contactName || !newClient.companyName) {
      ToastAndroid.show(
        "Nombre y empresa son obligatorios",
        ToastAndroid.LONG
      );
      return;
    }
    try {
      await dispatch(
        createClient({ ...newClient, createdBy: employeeID })
      ).unwrap();
      ToastAndroid.show("Cliente creado", ToastAndroid.LONG);
      setShowForm(false);
      setNewClient({
        contactName: "",
        contactLastName: "",
        email: "",
        phone: "",
        companyName: "",
      });
    } catch {
      ToastAndroid.show("Error al crear cliente", ToastAndroid.LONG);
    }
  };

  return (
    <PageShell title="Clientes">
      <ScrollView className="flex-1" contentContainerClassName="p-[16]">
        <TouchableOpacity
          className="bg-primary rounded-[6] p-[16] items-center mb-[16]"
          onPress={() => setShowForm(true)}
        >
          <Text className="text-white font-bold text-sm">
            + Nuevo Cliente
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 32 }}
          />
        ) : clients.length === 0 ? (
          <View className="bg-surface rounded-[16] p-[32] items-center shadow-sm">
            <Text className="text-sm text-textLight">
              No hay clientes registrados
            </Text>
          </View>
        ) : (
          clients.map((client: Client) => (
            <View
              key={client._id}
              className="bg-surface rounded-[10] p-[16] mb-3 shadow-sm"
            >
              <Text className="text-sm font-semibold text-text">
                {client.contactName} {client.contactLastName || ""}
              </Text>
              <Text className="text-xs text-textSecondary mt-1">
                {client.companyName}
              </Text>
              {client.email && (
                <Text className="text-xs text-textSecondary mt-1">
                  {client.email}
                </Text>
              )}
              {client.phone && (
                <Text className="text-xs text-textSecondary mt-1">
                  {client.phone}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showForm} animationType="slide" transparent>
        <View className="flex-1 bg-overlay justify-end">
          <ScrollView
            className="bg-surface rounded-t-[20] max-h-[80%]"
            contentContainerClassName="p-[20]"
            keyboardShouldPersistTaps="handled"
          >
            <Text className="text-lg font-semibold text-text text-center mb-[16]">
              Nuevo Cliente
            </Text>

            <TextInput
              className="border border-border rounded-[6] p-3 text-sm bg-background mb-3"
              value={newClient.contactName}
              onChangeText={(v) =>
                setNewClient({ ...newClient, contactName: v })
              }
              placeholder="Nombre de contacto *"
              placeholderTextColor={COLORS.textLight}
            />
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm bg-background mb-3"
              value={newClient.contactLastName}
              onChangeText={(v) =>
                setNewClient({ ...newClient, contactLastName: v })
              }
              placeholder="Apellido de contacto"
              placeholderTextColor={COLORS.textLight}
            />
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm bg-background mb-3"
              value={newClient.email}
              onChangeText={(v) =>
                setNewClient({ ...newClient, email: v })
              }
              placeholder="Correo electrónico"
              placeholderTextColor={COLORS.textLight}
              keyboardType="email-address"
            />
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm bg-background mb-3"
              value={newClient.phone}
              onChangeText={(v) =>
                setNewClient({ ...newClient, phone: v })
              }
              placeholder="Teléfono"
              placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad"
            />
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm bg-background mb-3"
              value={newClient.companyName}
              onChangeText={(v) =>
                setNewClient({ ...newClient, companyName: v })
              }
              placeholder="Nombre de la empresa *"
              placeholderTextColor={COLORS.textLight}
            />

            <View className="mt-[16] gap-1">
              <TouchableOpacity
                className="bg-primary rounded-[6] p-[16] items-center"
                onPress={handleCreate}
              >
                <Text className="text-white font-bold">
                  GUARDAR CLIENTE
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
