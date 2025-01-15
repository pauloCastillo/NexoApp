import { View, Text } from "react-native";

export default function LoadingOverlay({ message }) {
  return (
    <View>
      <Text>{message}</Text>
    </View>
  );
}
