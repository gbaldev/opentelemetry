import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { trace, Tracer } from '@opentelemetry/api';

export const initializeTracing = (): Tracer => {
  const otlpExporter = new OTLPTraceExporter({
    url: "http://localhost:4317/v1/traces",
  });

  const provider = new WebTracerProvider({
    spanProcessors: [new BatchSpanProcessor(otlpExporter)],
  });
  

  provider.register();

  return trace.getTracer('todo-list-tracer');
};