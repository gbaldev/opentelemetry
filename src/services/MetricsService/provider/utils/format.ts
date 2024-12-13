import { MetricsPayload } from '../types';

export const convertToPrometheusFormat = (payload: MetricsPayload) => {
  return {
    timeseries: payload.timeseries.map(series => ({
      labels: series.labels,
      samples: series.samples.map(sample => ({
        value: sample.value,
        timestamp: sample.timestamp_ms,
      }))
    }))
  };
};