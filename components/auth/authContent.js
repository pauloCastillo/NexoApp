import PropTypes from "prop-types";
import { useState } from "react";
export default function AuthContent({ isLogin, onAutehnticated }) {
  const [error, setError] = useState({
    username: "",
    mail: "",
    password: "",
    jobTitle: "",
    confirmPassword: "",
    phone: "",
  });
  const [checkError, setCheckError] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const user = {
      username,
      mail,
      password,
      confirmPassword,
      jobTitle,
      phone,
    };

    setError(verify(user, "sign-up"));
    if (Object.getOwnPropertyNames(error).length !== 0) {
      setCheckError(true);
    } else {
      try {
        // const PORT = process.env.EXPO_PUBLIC_API_URL;
        // const url = `http://192.168.1.14:${PORT}/api`;
        // const response = await axios.post(url + "/employees", { user });
        // if (response.status === 201) {
        //   dispatch(addEmployeeID({ id: response.data.user._id }));
        //   ToastAndroid.show("Se registro existosamente!", ToastAndroid.LONG);
        //   router.push("/");
        // }
      } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
    }

    return (
      <AuthForm isLogin={isLogin} onSubmit={onSubmit} checkError={checkError} />
    );
  }
}

AuthContent.propTypes = {
  isLogin: PropTypes.bool,
};
