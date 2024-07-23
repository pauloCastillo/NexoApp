import { Stack } from "expo-router";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auths)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
