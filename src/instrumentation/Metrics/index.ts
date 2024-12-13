import { metricsAxios } from "../../services/MetricsService/provider";
import { MetricsPayload } from "../../services/MetricsService/provider/types";
import { compressMetricPayload } from "../../services/MetricsService/provider/utils/compression";

export const sendMetric = async (payload: MetricsPayload) => {
  try {
    if (!payload.timeseries?.length) {
      throw new Error('Invalid metric payload: no timeseries data');
    }

    const compressedPayload = await compressMetricPayload(payload);
    const response = await metricsAxios.post('', compressedPayload);
    
    if (response.status !== 204) {
      console.warn('Unexpected response status:', response.status);
    }
    
    return response;
  } catch (error: any) {
    console.error('Error sending metric:', error.message);
    throw error;
  }
};