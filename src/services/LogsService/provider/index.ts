import axios from "axios";
import { LOKI_ENDPOINT } from "./constants";

export const lokiAxios = axios.create({
  baseURL: LOKI_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  }
});
