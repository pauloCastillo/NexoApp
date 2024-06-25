import axios from "axios";
const PORT = 3200;

export const BASE_URL = axios.create({
  baseUrl: `http://localhost:${PORT}/api/`,
  timeout: 1000,
  responseType: "json",
});
