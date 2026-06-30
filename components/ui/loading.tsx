import { ActivityIndicator, Text, View } from "react-native";

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <View className="flex-1 items-center justify-center p-[32]">
      <Text className="text-base mb-3">{message}</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}
