import axios from "axios";

const PORT = process.env.EXPO_PUBLIC_API_URL;
const url = `http://192.168.1.14:${PORT}/api`;

async function authenticated(mode, userData) {
  let response;
  if (mode === "login") {
    response = await axios.get(`${url}/employees`);
  } else if (mode === "signUp") {
    response = await axios.post(`${url}/employees`);
  }

  return [...response.data];
}

export function login(mode, user) {
  return authenticated(mode, user);
}

export function signUp(mode, user) {
  return authenticated(mode, user);
}
