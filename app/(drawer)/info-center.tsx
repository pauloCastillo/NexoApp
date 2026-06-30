import { View, Text, ScrollView } from "react-native";
import PageShell from "../../components/ui/PageShell";

interface NewsItem {
  date: string;
  title: string;
  body: string;
}

const news: NewsItem[] = [
  {
    date: "15 May 2026",
    title: "Actualización de políticas de teletrabajo",
    body: "Se han actualizado las políticas de trabajo remoto para el segundo semestre.",
  },
  {
    date: "10 May 2026",
    title: "Nuevo módulo de clientes disponible",
    body: "Ahora puedes registrar tus clientes y generar órdenes de trabajo desde la app.",
  },
  {
    date: "01 May 2026",
    title: "Feriado nacional",
    body: "Recordamos que el 1 de mayo es feriado nacional.",
  },
];

export default function InfoCenterScreen() {
  return (
    <PageShell title="Centro de Información">
      <ScrollView className="flex-1" contentContainerClassName="p-[16]">
        {news.map((item: NewsItem, i: number) => (
          <View
            key={i}
            className="bg-surface rounded-[10] p-[16] mb-3 shadow-sm"
          >
            <Text className="text-xs text-primary font-semibold mb-1">
              {item.date}
            </Text>
            <Text className="text-sm font-semibold text-text mb-1">
              {item.title}
            </Text>
            <Text className="text-xs text-textSecondary">{item.body}</Text>
          </View>
        ))}
      </ScrollView>
    </PageShell>
  );
}
