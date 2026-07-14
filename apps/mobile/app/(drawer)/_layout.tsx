import { Stack } from "expo-router";
import { DrawerProvider } from "../../components/ui/DrawerContext";

export default function DrawerScreensLayout() {
  return (
    <DrawerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="permissions" />
        <Stack.Screen name="vacations" />
        <Stack.Screen name="work-orders" />
        <Stack.Screen name="history" />
        <Stack.Screen name="clients" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="info-center" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
      </Stack>
    </DrawerProvider>
  );
}
