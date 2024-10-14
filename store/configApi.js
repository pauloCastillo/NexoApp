import axios from "axios";
export const BASEURL = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASEURL,
});
