import axios from "axios";
import { OTLP_ENDPOINT } from "./constants";

export const traceAxios = axios.create({
  baseURL: OTLP_ENDPOINT,
  headers: {
    'Content-Type': 'application/json'
  }
});
