import { Stack } from "expo-router";
import { DrawerProvider } from "../../components/ui/DrawerContext";

export default function MainLayout() {
  return (
    <DrawerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="order-day" />
        <Stack.Screen name="dashboard" />
      </Stack>
    </DrawerProvider>
  );
}
