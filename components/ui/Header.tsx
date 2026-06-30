import { View, Text, TouchableOpacity } from "react-native";
import { useDrawer } from "./DrawerContext";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { toggleDrawer } = useDrawer();

  return (
    <View className="flex-row items-center bg-primary pt-[48] pb-3 px-[16]">
      <TouchableOpacity onPress={toggleDrawer} className="p-2">
        <Text className="text-white text-[24px]">☰</Text>
      </TouchableOpacity>
      <View className="flex-1 items-center mr-10">
        <Text className="text-lg font-semibold text-white">{title}</Text>
      </View>
      <View className="w-10" />
    </View>
  );
}
