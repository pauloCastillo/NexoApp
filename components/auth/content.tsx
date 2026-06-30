import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import verify from "../../constants/verify";
import {
  registerNewEmployee,
  selectEmployee,
  selectEmployeeID,
  selectStatus,
} from "../../store/employees";
import AuthForm from "./form";
import type { AppDispatch } from "../../types/store";
import type { RegisterEmployeePayload } from "../../types/employee";

interface AuthContentProps {
  formMode: string;
}

export default function AuthContent({ formMode }: AuthContentProps) {
  const [error, setError] = useState<Record<string, string>>({});
  const [checkError, setCheckError] = useState(false);

  const employee = useSelector(selectEmployee);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const id = useSelector(selectEmployeeID);
  const status = useSelector(selectStatus);

  useEffect(() => {
    if (status === "loading") {
      console.log(status);
    } else if (status === "succeeded") {
      router.replace("/");
      ToastAndroid.show("Usuario registrado exitosamente!", ToastAndroid.LONG);
    } else if (status === "rejected") {
      ToastAndroid.show(
        "Usuario no registrado!, intente de nuevo",
        ToastAndroid.LONG
      );
    }
  }, [status, id, router]);

  function onSubmitHandler() {
    if (!employee) return;

    const validationErrors = verify(employee, "sign-up");
    setError(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setCheckError(true);
      ToastAndroid.show(
        "Ocurrió un error: " + validationErrors.message,
        ToastAndroid.LONG
      );
    } else {
      dispatch(registerNewEmployee(employee as RegisterEmployeePayload));
    }
  }

  let content: React.ReactNode;
  if (formMode === "signUp") {
    content = (
      <Text className="text-center font-normal text-blue-500 my-[15]">
        Si ya tienes una cuenta{" "}
        <Link
          replace
          href={"/Login"}
          className="font-semibold uppercase text-blue-500"
        >
          ingresa aquí
        </Link>
      </Text>
    );
  }

  return (
    <AuthForm
      formMode={formMode}
      footerContent={content}
      onSubmit={onSubmitHandler}
      checkError={checkError}
      error={error}
    />
  );
}
