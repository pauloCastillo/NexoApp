import axios from "axios";
const BaseUrl = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASEURL,
});

export default BaseUrl
