import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PageShell from "../../components/ui/PageShell";
import { COLORS } from "../../constants/theme";
import { fetchWorkOrders, selectOrderHistory } from "../../store/orderDay";
import type { AppDispatch, RootState } from "../../types/store";
import type { WorkOrder } from "../../types/workOrder";

export default function WorkOrdersScreen() {
  const dispatch: AppDispatch = useDispatch();
  const orders = useSelector(selectOrderHistory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchWorkOrders()).finally(() => setLoading(false));
  }, [dispatch]);

  return (
    <PageShell title="Órdenes de Trabajo">
      <ScrollView className="flex-1" contentContainerClassName="p-[16]">
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 32 }}
          />
        ) : orders.length === 0 ? (
          <View className="bg-surface rounded-[16] p-[32] items-center shadow-sm">
            <Text className="text-sm text-textLight">
              No tienes órdenes de trabajo registradas
            </Text>
          </View>
        ) : (
          orders.map((order: WorkOrder) => (
            <View
              key={order._id}
              className="bg-surface rounded-[10] p-[16] mb-3 shadow-sm"
            >
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm font-semibold text-text">
                  {order.clientName ||
                    (typeof order.client === "object"
                      ? order.client?.contactName
                      : "") ||
                    "Cliente"}
                </Text>
                <Text className="text-xs text-textSecondary">
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </View>
              {typeof order.client === "object" && order.client?.companyName && (
                <Text className="text-xs text-textSecondary mb-1">
                  {order.client.companyName}
                </Text>
              )}
              {order.description && (
                <Text className="text-sm text-text mt-1">
                  {order.description}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </PageShell>
  );
}
