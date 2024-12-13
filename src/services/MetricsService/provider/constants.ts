export const PROMETHEUS_ENDPOINT = 'http://localhost:9090/api/v1/write';

export const METRIC_TYPE = {
  COUNTER: 1,
  GAUGE: 2,
  HISTOGRAM: 3,
} as const;