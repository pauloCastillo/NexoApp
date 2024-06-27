import axios from "axios";
import { config } from "dotenv";

config();
const PORT = process.env.PORT || 8000;
const url = `http://192.168.1.12:${PORT}/api/`;
export const BASE_URL = axios.create({
  baseUrl: url,
});
