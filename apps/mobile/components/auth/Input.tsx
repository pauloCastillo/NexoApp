import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface InputProps {
  label: string;
  onUpdateValue: (text: string) => void;
  value: string;
  placeholder?: string;
  checkError?: boolean;
  error?: string;
  secureTextEntry?: boolean;
}

export default function Input({
  label,
  onUpdateValue,
  value,
  placeholder,
  checkError,
  error,
  secureTextEntry,
}: InputProps) {
  const [defaultPrivacy, setDefaultPrivacy] = useState(true);

  const handlePasswordToggle = () => {
    setDefaultPrivacy((prev) => !prev);
  };

  const getKeyboardType = (fieldLabel: string) => {
    if (fieldLabel === "Celular") {
      return "numeric";
    } else if (fieldLabel === "Correo") {
      return "email-address";
    } else {
      return "default";
    }
  };

  if (secureTextEntry) {
    return (
      <>
        <Text className="font-semibold text-xs text-textSecondary uppercase mb-1">
          {label}
        </Text>
        <View className="flex-row h-11 mb-3 items-center border border-border rounded-[6] bg-background">
          <TextInput
            className="flex-1 h-11 px-3 text-sm text-text"
            underlineColorAndroid={"#f42"}
            onChangeText={onUpdateValue}
            value={value}
            placeholder={placeholder}
            secureTextEntry={defaultPrivacy}
          />
          <View className="absolute top-0 right-0 h-11 justify-center px-3">
            <TouchableOpacity onPress={handlePasswordToggle}>
              <Text
                className="text-lg"
                style={{ textDecorationLine: defaultPrivacy ? "line-through" : "none" }}
              >
                👁
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {checkError && (
          <Text className="font-medium text-xs text-error -mt-2 mb-2">
            {error}
          </Text>
        )}
      </>
    );
  } else {
    return (
      <>
        <Text className="font-semibold text-xs text-textSecondary uppercase mb-1">
          {label}
        </Text>
        <TextInput
          className="w-full h-11 mb-3 border border-border rounded-[6] px-3 text-sm text-text bg-background"
          underlineColorAndroid={"#f42"}
          onChangeText={onUpdateValue}
          value={value}
          keyboardType={getKeyboardType(label)}
          placeholder={placeholder}
        />
        {checkError && (
          <Text className="font-medium text-xs text-error -mt-2 mb-2">
            {error}
          </Text>
        )}
      </>
    );
  }
}
