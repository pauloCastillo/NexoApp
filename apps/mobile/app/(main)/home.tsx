import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, ToastAndroid, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PageShell from "../../components/ui/PageShell";
import IconButton from "../../components/Buttons";
import ClockLayout from "../../components/Clock";
import type { ClockRef } from "../../components/Clock";
import { selectEmployee } from "../../store/employees";
import {
  getLocations,
  registerTimeAndLocations,
  selectLocation,
  takeTime,
} from "../../store/locations";
import { COLORS } from "../../constants/theme";
import type { AppDispatch, RootState } from "../../types/store";
import type { LocationCoords } from "../../types/location";
import { getSocket } from "../../services/socket";

export default function HomeScreen() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [showTime, setShowTime] = useState("");
  const timeWorker = useRef<ClockRef>(null);
  const employee = useSelector(selectEmployee);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync();
      setLocation(loc.coords);
    })();
  }, []);

  useEffect(() => {
    if (location) dispatch(getLocations({ coords: location }));
  }, [location, dispatch]);

  const employeeID = useSelector((state: RootState) => state.employees.id);
  const place = useSelector(selectLocation);

  function handleTimeLocationAction(label: string) {
    if (label === "entrada") {
      router.push("/(main)/order-day");
      return;
    }
    setText(label);
    const time = timeWorker.current?.getCurrentTime();
    setShowTime(time ?? "");
    dispatch(takeTime({ label, time }));
    sendLocationToServer(time ?? "", label);
  }

  async function sendLocationToServer(workerTime: string, label: string) {
    const locationTimeData = {
      employee: employeeID,
      label: label,
      time: workerTime,
      location: place,
    };
    try {
      const socket = await getSocket();
      socket.emit("getLocation", () => {
        dispatch(registerTimeAndLocations(locationTimeData));
      });
      ToastAndroid.show("Registro exitoso!", ToastAndroid.LONG);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      ToastAndroid.show("Error: " + message, ToastAndroid.LONG);
    }
  }

  return (
    <PageShell title="Nexo">
      <View className="flex-1 items-center">
        <ClockLayout ref={timeWorker} />

        {employee && (
          <Text className="text-lg font-semibold text-text mt-[20]">
            Bienvenido, {employee.username?.split(" ")[0] || "empleado"}
          </Text>
        )}

        <View className="mt-[20] items-center">
          <View className="flex-row gap-[16] mb-3">
            <IconButton
              icon="arrowright"
              btnText="entrada"
              index={1}
              bgColor={COLORS.success}
              onPress={() => handleTimeLocationAction("entrada")}
            />
            <IconButton
              icon="pause"
              btnText="descanso"
              index={2}
              bgColor={COLORS.info}
              onPress={() => handleTimeLocationAction("descanso")}
            />
          </View>
          <View className="flex-row gap-[16] mb-3">
            <IconButton
              icon="back"
              btnText="retorno"
              index={3}
              bgColor={COLORS.success}
              onPress={() => handleTimeLocationAction("retorno")}
            />
            <IconButton
              icon="arrowleft"
              btnText="salida"
              index={4}
              bgColor={COLORS.error}
              onPress={() => handleTimeLocationAction("salida")}
            />
          </View>
        </View>

        <View className="flex-row justify-center mt-[16] px-[20]">
          <Text className="uppercase mr-2 font-semibold text-base text-textSecondary">
            {text ? `${text}:` : ""}
          </Text>
          <Text className="text-base text-primary font-semibold">
            {showTime}
          </Text>
        </View>
      </View>
    </PageShell>
  );
}
