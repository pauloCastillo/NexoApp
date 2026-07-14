import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Text, View } from "react-native";

export interface ClockRef {
  getCurrentTime: () => string;
}

export default forwardRef<ClockRef>(function ClockLayout(_, ref) {
  const date = new Date();
  const [time, setTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState("");

  const days = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    setCurrentDate(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).toLocaleString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    );
    days.findIndex((day, idx) => idx === date.getDay() && setCurrentDay(day));

    return () => clearInterval(interval);
  }, []);

  useImperativeHandle(ref, () => ({
    getCurrentTime() {
      return time.toLocaleString("es-BO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  }));

  const formatTimer = (currentTime: Date) => {
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View className="items-center mt-[48]">
      <Text className="text-[72px] font-extralight text-text tracking-widest">
        {formatTimer(time)}
      </Text>
      <Text className="text-[24px] font-medium text-primary capitalize mt-1">
        {currentDay}
      </Text>
      <Text className="text-base text-textSecondary mt-1">{currentDate}</Text>
    </View>
  );
});
