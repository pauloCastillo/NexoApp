import { Text, TouchableOpacity } from "react-native";

interface ButtonsProps {
  icon?: string;
  btnText?: string;
  index?: number;
  bgColor?: string;
  onPress?: () => void;
}

export default function Buttons({
  icon,
  btnText,
  bgColor,
  onPress,
}: ButtonsProps) {
  return (
    <TouchableOpacity
      style={{ backgroundColor: bgColor }}
      className="w-[150] h-[150] rounded-[120] items-center justify-center shadow-lg"
      onPress={onPress}
    >
      <Text className="text-white text-[40px]">{icon}</Text>
      <Text className="text-white text-sm font-bold mt-1 uppercase">
        {btnText}
      </Text>
    </TouchableOpacity>
  );
}
