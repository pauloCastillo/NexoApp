import { Stack } from "expo-router";
import React from "react";

export const unstable_settings = {
  initialRoute: "index",
  auths: {
    initialRoute: "Register",
  },
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auths)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
