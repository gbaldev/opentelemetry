import axios from 'axios';
import { getCompressedPayload } from './utils';

const mimirAxios = axios.create({
  baseURL: 'http://localhost:9009/api/v1/push',
  headers: {
    'Content-Type': 'application/x-protobuf',
  },
});

type Label = {
  name: string;
  value: string;
};

type Sample = {
  value: number;
  timestamp_ms: number;
};

type TimeSeries = {
  labels: Label[];
  samples: Sample[];
  exemplars: { labels: Label[]; value: number; timestamp_ms: number }[];
  histograms: {
    count_int?: number;
    count_float?: number;
    sum: number;
    schema: number;
    zero_threshold: number;
    zero_count_int?: number;
    zero_count_float?: number;
    negative_spans: { offset: number; length: number }[];
    negative_deltas: number[];
    negative_counts: number[];
    positive_spans: { offset: number; length: number }[];
    positive_deltas: number[];
    positive_counts: number[];
    reset_hint: number;
    timestamp: number;
  }[];
};

type MetricsPayload = {
  timeseries: TimeSeries[];
  Source: "API" | "RULE";
  metadata: {
    type: number;
    metric_family_name: string;
    help: string;
    unit: string;
  }[];
  skip_label_validation: boolean;
  skip_label_count_validation: boolean;
};


const sendMetric = async (payload : MetricsPayload) => {
  const compressedPayload = await getCompressedPayload(payload);

  console.log({compressedPayload})
  try {
    const response = await mimirAxios.post('', compressedPayload);
    console.log('Métrica enviada a Mimir:', response.data);
    console.log(response);
  } catch (error) {
    console.error('Error enviando métrica a Mimir:', error);
  }
};

const Metrics = {sendMetric};

export default Metrics;
