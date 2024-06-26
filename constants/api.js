import axios from "axios";

const url = "http://192.168.1.14:8000/api";

export const BASE_URL = axios.create({
  baseURL: url,
  responseType: "json",
});
