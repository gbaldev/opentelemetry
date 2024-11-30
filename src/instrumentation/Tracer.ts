import { BatchSpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { Resource } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';

export const Tracer = async () => {
    const resource = new Resource({
      ["service.name"]: "reactnativeapp",
    });
    const provider = new WebTracerProvider({ resource });

    provider.addSpanProcessor(
        new BatchSpanProcessor(
            new OTLPTraceExporter({
                url: `http://tempo:4317/v1/traces`,
            }),
            {
                scheduledDelayMillis: 500,
            }
        )
    );

    provider.register({
        propagator: new CompositePropagator({
            propagators: [new W3CBaggagePropagator(), new W3CTraceContextPropagator()],
      }),
    });

    registerInstrumentations({
        tracerProvider: provider,
        instrumentations: [
          getWebAutoInstrumentations({
            '@opentelemetry/instrumentation-user-interaction': { enabled: false },
            '@opentelemetry/instrumentation-document-load': { enabled: false },
            '@opentelemetry/instrumentation-fetch': {
              propagateTraceHeaderCorsUrls: /.*/,
              clearTimingResources: false,
            },
          }),
        ],
      });
}