export interface Label {
    name: string;
    value: string;
  }
  
  export interface Sample {
    value: number;
    timestamp_ms?: number;
  }
  
  export interface TimeSeries {
    labels: Label[];
    samples: Sample[];
  }
  
  export interface MetricsPayload {
    timeseries: TimeSeries[];
    Source?: number;
    metadata?: Array<{
      type: number;
      metric_family_name: string;
      help: string;
      unit?: string;
    }>;
    skip_label_validation?: boolean;
    skip_label_count_validation?: boolean;
  }