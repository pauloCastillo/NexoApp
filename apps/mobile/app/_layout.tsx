import "../global.css";
import { Stack } from "expo-router";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auths)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
