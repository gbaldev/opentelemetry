import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

export const initializeMetrics = () => {
  const prometheusExporter = new PrometheusExporter({
    endpoint: 'http://tempo:9090/metrics',
  });

  const meterProvider = new MeterProvider({
    readers: [prometheusExporter]
  });

  return meterProvider.getMeter('todo-list-meter');
};

export const meter = initializeMetrics();

// use case
// import { meter } from './metrics';

// // Crear un contador
// const requestCounter = meter.createCounter('todo_list_requests', {
//   description: 'Número de solicitudes al todo list'
// });

// // Crear un medidor (gauge)
// const activeRequestsGauge = meter.createObservableGauge('todo_list_active_requests', {
//   description: 'Número de solicitudes activas'
// });

// // Ejemplo de uso
// function handleRequest() {
//   // Incrementar el contador de solicitudes
//   requestCounter.add(1, { 'method': 'POST' });

//   // Actualizar el gauge de solicitudes activas
//   activeRequestsGauge.observe(1);
// }