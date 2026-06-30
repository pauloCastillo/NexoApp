import { View } from "react-native";
import Header from "./Header";
import TabBar from "./TabBar";
import DrawerOverlay from "./Drawer";
import { useSelector } from "react-redux";
import type { RootState } from "../../types/store";
import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  children: ReactNode;
  showTabs?: boolean;
}

export default function PageShell({
  title,
  children,
  showTabs = true,
}: PageShellProps) {
  const role = useSelector((state: RootState) => state.employees?.role);

  return (
    <View className="flex-1 bg-background">
      <Header title={title} />
      <View className="flex-1">{children}</View>
      {showTabs && <TabBar role={role} />}
      <DrawerOverlay />
    </View>
  );
}
