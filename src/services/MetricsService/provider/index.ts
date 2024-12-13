import axios from 'axios';
import { PROMETHEUS_ENDPOINT } from './constants';

export const metricsAxios = axios.create({
  baseURL: PROMETHEUS_ENDPOINT,
  headers: {
    'Content-Type': 'application/x-protobuf',
    'X-Prometheus-Remote-Write-Version': '0.1.0'
  },
});
