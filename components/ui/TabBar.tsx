import { View, TouchableOpacity, Text } from "react-native";
import { useRouter, usePathname } from "expo-router";

interface TabItem {
  icon: string;
  label: string;
  route: string;
  managerOnly?: boolean;
}

const tabs: TabItem[] = [
  { icon: "🏠", label: "Home", route: "/(main)/home" },
  { icon: "📋", label: "Orden", route: "/(main)/order-day" },
  { icon: "⏱", label: "Marcar", route: "/(main)/home" },
  {
    icon: "📊",
    label: "Dashboard",
    route: "/(main)/dashboard",
    managerOnly: true,
  },
];

interface TabBarProps {
  role?: string;
}

export default function TabBar({ role }: TabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const visibleTabs =
    role === "manager" || role === "admin"
      ? tabs
      : tabs.filter((t) => !t.managerOnly);

  return (
    <View className="flex-row bg-surface border-t border-border pb-2">
      {visibleTabs.map((tab: TabItem) => {
        const isActive = pathname === tab.route;
        return (
          <TouchableOpacity
            key={tab.route}
            className={`flex-1 items-center py-2 ${
              isActive ? "border-t-2 border-primary" : ""
            }`}
            onPress={() => router.replace(tab.route as never)}
          >
            <Text className="text-xl mb-0.5">{tab.icon}</Text>
            <Text
              className={`text-[11px] font-medium ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-textSecondary"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
