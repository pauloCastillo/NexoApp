import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import { addEmployee } from "../store/employees";
import { isAuthenticated } from "../services/token";
import type { AppDispatch } from "../types/store";

export default function AppIndex() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const authedStatus = await isAuthenticated();
        if (authedStatus) {
          setAuthed(true);
        }
      } catch {
        // silently fail — user stays unauthenticated
      }
      setLoading(false);
    })();
  }, [dispatch]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <Text className="text-white text-[36px] font-bold mb-5">Nexo</Text>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return <Redirect href={authed ? "/(main)/home" : "/(auths)/Login"} />;
}
