import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

export const initializeMetrics = () => {
  const prometheusExporter = new PrometheusExporter({
    endpoint: 'http://localhost:9009/metrics',
  });

  const meterProvider = new MeterProvider({
    readers: [prometheusExporter]
  });

  return meterProvider.getMeter('todo-list-meter');
};
