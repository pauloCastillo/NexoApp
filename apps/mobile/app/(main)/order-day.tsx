import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import PageShell from "../../components/ui/PageShell";
import { COLORS } from "../../constants/theme";
import * as Location from "expo-location";
import {
  fetchClients,
  selectClients,
  createClient,
} from "../../store/clients";
import { submitWorkOrder } from "../../store/orderDay";
import {
  getLocations,
  registerTimeAndLocations,
  selectLocation,
  takeTime,
} from "../../store/locations";
import { selectEmployeeID } from "../../store/employees";
import type { AppDispatch, RootState } from "../../types/store";
import type { Client, CreateClientPayload } from "../../types/client";
import type { TimeLocationData } from "../../types/location";

export default function OrderDayScreen() {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const clients = useSelector(selectClients);
  const employeeID = useSelector(selectEmployeeID);
  const place = useSelector(selectLocation);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [description, setDescription] = useState("");
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newClient, setNewClient] = useState<CreateClientPayload>({
    contactName: "",
    contactLastName: "",
    email: "",
    phone: "",
    companyName: "",
  });

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchClients());
    (async () => {
      let loc = await Location.getCurrentPositionAsync();
      setLocation(loc);
      dispatch(getLocations(loc));
    })();
  }, [dispatch]);

  const filteredClients = clients.filter((c: Client) =>
    (c.contactName + " " + c.companyName)
      .toLowerCase()
      .includes(clientSearch.toLowerCase())
  );

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setShowClientModal(false);
  };

  const handleCreateClient = async () => {
    if (!newClient.contactName || !newClient.companyName) {
      ToastAndroid.show(
        "Nombre de contacto y empresa son obligatorios",
        ToastAndroid.LONG
      );
      return;
    }
    try {
      const result = await dispatch(
        createClient({ ...newClient, createdBy: employeeID })
      ).unwrap();
      const client = result.client as Client | undefined;
      if (client) {
        setSelectedClient(client);
      }
      setShowCreateForm(false);
      setNewClient({
        contactName: "",
        contactLastName: "",
        email: "",
        phone: "",
        companyName: "",
      });
      ToastAndroid.show("Cliente creado exitosamente", ToastAndroid.LONG);
    } catch {
      ToastAndroid.show("Error al crear cliente", ToastAndroid.LONG);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClient) {
      ToastAndroid.show("Selecciona un cliente", ToastAndroid.LONG);
      return;
    }

    const time = new Date().toLocaleTimeString("es-BO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const workOrderData = {
      employee: employeeID,
      client: selectedClient._id || "",
      clientName:
        selectedClient.contactName +
        " " +
        (selectedClient.contactLastName || ""),
      location: {
        latitude: location?.coords?.latitude || 0,
        longitude: location?.coords?.longitude || 0,
      },
      description,
    };

    try {
      await dispatch(submitWorkOrder(workOrderData)).unwrap();
      dispatch(takeTime({ label: "entrada", time }));

      const locationTimeData: TimeLocationData = {
        employee: employeeID,
        label: "entrada",
        time,
        location: place,
      };
      dispatch(registerTimeAndLocations(locationTimeData));

      ToastAndroid.show(
        "Entrada registrada con orden del día",
        ToastAndroid.LONG
      );
      router.push("/(main)/home");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      ToastAndroid.show(
        "Error al registrar: " + message,
        ToastAndroid.LONG
      );
    }
  };

  return (
    <PageShell title="Orden del Día">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-[16]"
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-surface rounded-[16] p-[20] shadow-md">
          <Text className="text-lg font-semibold text-text mb-2">
            📋 Registrar Entrada
          </Text>
          <Text className="text-[24px] font-bold text-primary mb-[20]">
            {new Date().toLocaleTimeString("es-BO", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </Text>

          <Text className="text-xs font-semibold text-textSecondary uppercase mb-1 mt-3">
            Cliente
          </Text>
          <TouchableOpacity
            className="flex-row justify-between items-center p-3 border border-border rounded-[6] bg-background"
            onPress={() => setShowClientModal(true)}
          >
            <Text
              className={
                selectedClient
                  ? "text-sm text-text"
                  : "text-sm text-textLight"
              }
            >
              {selectedClient
                ? selectedClient.contactName +
                  " " +
                  (selectedClient.contactLastName || "") +
                  " — " +
                  selectedClient.companyName
                : "Seleccionar cliente"}
            </Text>
            <Text className="text-textSecondary">▼</Text>
          </TouchableOpacity>

          <Text className="text-xs font-semibold text-textSecondary uppercase mb-1 mt-3">
            Ubicación
          </Text>
          <View className="p-3 border border-border rounded-[6] bg-background">
            <Text className="text-xs text-textSecondary">
              {location
                ? `${location.coords.latitude.toFixed(
                    4
                  )}, ${location.coords.longitude.toFixed(4)}`
                : "Obteniendo ubicación..."}
            </Text>
          </View>

          <Text className="text-xs font-semibold text-textSecondary uppercase mb-1 mt-3">
            Descripción del trabajo
          </Text>
          <TextInput
            className="border border-border rounded-[6] p-3 text-sm min-h-[100] bg-background"
            style={{ textAlignVertical: "top" }}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe el trabajo a realizar..."
            placeholderTextColor={COLORS.textLight}
          />

          <TouchableOpacity
            className="bg-primary rounded-[6] p-[16] items-center mt-[20]"
            onPress={handleSubmit}
          >
            <Text className="text-white text-base font-bold">
              ✓ CONFIRMAR ENTRADA
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showClientModal} animationType="slide" transparent>
        <View className="flex-1 bg-overlay justify-end">
          <View className="bg-surface rounded-t-[20] p-[20] max-h-[80%]">
            <Text className="text-lg font-semibold text-text text-center mb-[16]">
              Seleccionar Cliente
            </Text>
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm mb-3 bg-background"
              placeholder="Buscar cliente..."
              value={clientSearch}
              onChangeText={setClientSearch}
              placeholderTextColor={COLORS.textLight}
            />
            <ScrollView className="max-h-[300]">
              {filteredClients.map((client: Client) => (
                <TouchableOpacity
                  key={client._id}
                  className="py-3 px-2 border-b border-borderLight"
                  onPress={() => handleSelectClient(client)}
                >
                  <Text className="text-sm font-medium text-text">
                    {client.contactName} {client.contactLastName || ""}
                  </Text>
                  <Text className="text-xs text-textSecondary">
                    {client.companyName}
                  </Text>
                </TouchableOpacity>
              ))}
              {filteredClients.length === 0 && (
                <Text className="text-center text-textLight py-[32]">
                  No se encontraron clientes
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              className="p-3 items-center mt-1"
              onPress={() => {
                setShowClientModal(false);
                setShowCreateForm(true);
              }}
            >
              <Text className="text-primary font-semibold text-base">
                + Nuevo Cliente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-3 items-center"
              onPress={() => setShowClientModal(false)}
            >
              <Text className="text-textSecondary text-sm">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCreateForm} animationType="slide" transparent>
        <View className="flex-1 bg-overlay justify-end">
          <ScrollView
            className="bg-surface rounded-t-[20] max-h-[90%] mt-auto"
            contentContainerClassName="p-[20]"
            keyboardShouldPersistTaps="handled"
          >
            <Text className="text-lg font-semibold text-text text-center mb-[16]">
              Nuevo Cliente
            </Text>

            <Text className="text-xs font-semibold text-textSecondary uppercase mt-3 mb-1">
              Nombres *
            </Text>
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm bg-background"
              value={newClient.contactName}
              onChangeText={(v) =>
                setNewClient({ ...newClient, contactName: v })
              }
              placeholder="Nombre de contacto"
              placeholderTextColor={COLORS.textLight}
            />

            <Text className="text-xs font-semibold text-textSecondary uppercase mt-3 mb-1">
              Apellidos
            </Text>
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm bg-background"
              value={newClient.contactLastName}
              onChangeText={(v) =>
                setNewClient({ ...newClient, contactLastName: v })
              }
              placeholder="Apellido de contacto"
              placeholderTextColor={COLORS.textLight}
            />

            <Text className="text-xs font-semibold text-textSecondary uppercase mt-3 mb-1">
              Correo
            </Text>
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm bg-background"
              value={newClient.email}
              onChangeText={(v) =>
                setNewClient({ ...newClient, email: v })
              }
              placeholder="correo@cliente.com"
              placeholderTextColor={COLORS.textLight}
              keyboardType="email-address"
            />

            <Text className="text-xs font-semibold text-textSecondary uppercase mt-3 mb-1">
              Teléfono
            </Text>
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm bg-background"
              value={newClient.phone}
              onChangeText={(v) =>
                setNewClient({ ...newClient, phone: v })
              }
              placeholder="77777777"
              placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad"
            />

            <Text className="text-xs font-semibold text-textSecondary uppercase mt-3 mb-1">
              Nombre de la Empresa *
            </Text>
            <TextInput
              className="border border-border rounded-[6] p-3 text-sm bg-background"
              value={newClient.companyName}
              onChangeText={(v) =>
                setNewClient({ ...newClient, companyName: v })
              }
              placeholder="Empresa del cliente"
              placeholderTextColor={COLORS.textLight}
            />

            <View className="mt-[20] gap-1">
              <TouchableOpacity
                className="bg-primary rounded-[6] p-[16] items-center"
                onPress={handleCreateClient}
              >
                <Text className="text-white font-bold text-sm">
                  GUARDAR CLIENTE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 items-center"
                onPress={() => setShowCreateForm(false)}
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
