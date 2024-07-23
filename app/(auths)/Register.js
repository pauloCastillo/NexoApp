<<<<<<< HEAD
import { useState } from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";
import { AuthContent } from "../../components/auth/authContent";
import { useGetEmployeesQuery } from "../../store/session";
import { signUp } from "../../utils/auth";

export default function RegisterLayout() {
  const [credentials, setCredentials] = useState({
    username: "",
    mail: "",
    password: "",
    confirmPassword: "",
    jobTitle: "",
    phone: "",
  });
  const [authenticate, setAuthenticate] = useState(null);
  const { data, isLoading, error } = useGetEmployeesQuery();
  console.log(error, data, isLoading);
  function handlerAuthenticated() {
    const response = signUp("signUp", credentials);
    console.log(response);
    setAuthenticate(response);
    return "isLogin";
  }
  handlerAuthenticated();
  return (
    <SafeAreaView style={styles.regContainer}>
      <Image source={require("../../assets/icon.png")} style={styles.image} />
      <AuthContent
        isLogin={handlerAuthenticated}
        onAutehnticated={authenticate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  regContainer: {
    flex: 1,
    justifyContent: "center",
  },

  image: {
    width: 150,
    height: 150,
    marginHorizontal: "auto",
    marginVertical: 20,
  },
});
=======
import AuthContent from "../../components/auth/content";

export default function RegisterLayout() {
  return <AuthContent formMode="signUp" />;
}
>>>>>>> lastWork2
