import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
<<<<<<< HEAD
    <Stack initialRouteName="Register" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" />
      <Stack.Screen name="Register" />
=======
    <Stack initialRouteName={"Login"} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Register" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
>>>>>>> lastWork2
    </Stack>
  );
}
