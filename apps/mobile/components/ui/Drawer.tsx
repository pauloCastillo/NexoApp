import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrawer } from "./DrawerContext";
import { COLORS } from "../../constants/theme";
import { resetAuth } from "../../store/employees";
import { clearTokens } from "../../services/token";
import type { RootState } from "../../types/store";
import type { AppDispatch } from "../../types/store";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

interface DrawerItem {
  icon: string;
  label: string;
  route: string;
}

const primaryItems: DrawerItem[] = [
  { icon: "🏠", label: "Home", route: "/(main)/home" },
  { icon: "📋", label: "Orden del Día", route: "/(main)/order-day" },
  {
    icon: "⏱",
    label: "Historial de Marcajes",
    route: "/(drawer)/history",
  },
  {
    icon: "📋",
    label: "Órdenes de Trabajo",
    route: "/(drawer)/work-orders",
  },
];

const secondaryItems: DrawerItem[] = [
  { icon: "📅", label: "Vacaciones", route: "/(drawer)/vacations" },
  { icon: "📄", label: "Permisos", route: "/(drawer)/permissions" },
  { icon: "🏢", label: "Clientes", route: "/(drawer)/clients" },
];

const managerItems: DrawerItem[] = [
  { icon: "📊", label: "Dashboard", route: "/(main)/dashboard" },
  { icon: "📈", label: "Reportes", route: "/(drawer)/reports" },
];

const bottomItems: DrawerItem[] = [
  {
    icon: "ℹ️",
    label: "Centro de Información",
    route: "/(drawer)/info-center",
  },
  { icon: "👤", label: "Perfil", route: "/(drawer)/profile" },
  { icon: "⚙️", label: "Configuración", route: "/(drawer)/settings" },
];

export default function DrawerOverlay() {
  const { isOpen, closeDrawer } = useDrawer();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const role = useSelector((state: RootState) => state.employees?.role);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnim]);

  const handleNavigate = (route: string) => {
    closeDrawer();
    router.replace(route as never);
  };

  const handleLogout = async () => {
    closeDrawer();
    await clearTokens();
    dispatch(resetAuth());
    router.replace("/(auths)/Login" as never);
  };

  const renderItem = (item: DrawerItem) => (
    <TouchableOpacity
      key={item.route}
      className="flex-row items-center py-3 px-[20]"
      onPress={() => handleNavigate(item.route)}
    >
      <Text className="text-lg mr-[16] w-6 text-center">{item.icon}</Text>
      <Text className="text-base text-text font-medium">{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      {isOpen && (
        <Pressable style={styles.overlay} onPress={closeDrawer} />
      )}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.drawerHeader}>
          <Text className="text-[24px] font-bold text-white">Nexo</Text>
          <Text className="text-xs text-white/80 mt-1">
            Tu oficina de confianza
          </Text>
        </View>
        <ScrollView className="flex-1 pt-3">
          <View className="mb-3">
            <Text className="text-[10px] font-semibold text-textSecondary px-[20] py-2 tracking-widest">
              PRINCIPAL
            </Text>
            {primaryItems.map(renderItem)}
          </View>
          <View className="mb-3">
            <Text className="text-[10px] font-semibold text-textSecondary px-[20] py-2 tracking-widest">
              GESTIÓN
            </Text>
            {secondaryItems.map(renderItem)}
          </View>
          {(role === "manager" || role === "admin") && (
            <View className="mb-3">
              <Text className="text-[10px] font-semibold text-textSecondary px-[20] py-2 tracking-widest">
                ADMINISTRACIÓN
              </Text>
              {managerItems.map(renderItem)}
            </View>
          )}
          <View className="mb-3">
            <Text className="text-[10px] font-semibold text-textSecondary px-[20] py-2 tracking-widest">
              CUENTA
            </Text>
            {bottomItems.map(renderItem)}
          </View>
        </ScrollView>
        <View className="border-t border-border p-[20]">
          <TouchableOpacity className="py-3" onPress={handleLogout}>
            <Text className="text-base text-error font-medium">
              🚪 Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles: Record<string, object> = {
  overlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 100,
  },
  drawer: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: COLORS.surface,
    zIndex: 200,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  drawerHeader: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 48 + 24,
  },
};
