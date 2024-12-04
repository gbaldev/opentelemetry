import { BatchSpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { Resource } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { trace, diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';


export const Tracer = async () => {
    // diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

    const resource = new Resource({
      ["service.name"]: "reactnativeapp",
    });
    const provider = new WebTracerProvider({ resource });
    const exporter = new OTLPTraceExporter({
      url: `http://localhost:4320/v1/traces`,
    });
    const tracer = trace.getTracer('xhr-tracer');
    tracer.startSpan('initialization').setAttribute('name', 'test').end();
    provider.addSpanProcessor(
        new BatchSpanProcessor(
            exporter,
            {
                scheduledDelayMillis: 500,
            }
        )
    );

    try {
      provider.register({
          propagator: new CompositePropagator({
              propagators: [new W3CBaggagePropagator(), new W3CTraceContextPropagator()],
          }),
      });
    } catch (error) {
        console.error('Error en la configuración de OpenTelemetry:', error);
    }
    registerInstrumentations({
        tracerProvider: provider,
        instrumentations: [
          getWebAutoInstrumentations({
            '@opentelemetry/instrumentation-user-interaction': { enabled: false },
            '@opentelemetry/instrumentation-document-load': { enabled: false },
            '@opentelemetry/instrumentation-fetch': { enabled: false },
            '@opentelemetry/instrumentation-xml-http-request': { enabled: false },
          }),
        ],
      });
}

function makeRequest(url: string, method = 'GET', body = null) {
  const tracer = trace.getTracer('xhr-tracer');

  return new Promise((resolve, reject) => {
    // Crear span sin usar startActiveSpan
    const span = tracer.startSpan(`HTTP ${method}`);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      // Añadir atributos al span
      span.setAttribute('http.method', method);
      span.setAttribute('http.url', url);

      xhr.onload = () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            span.setAttribute('http.status_code', xhr.status);

            const contentType = xhr.getResponseHeader('Content-Type');

            if (contentType && contentType.includes('application/json')) {
              const responseJson = JSON.parse(xhr.responseText);
              span.setStatus({ code: 0 });
              resolve(responseJson);
            } else {
              span.setStatus({ 
                code: 1, 
                message: 'Expected JSON, but got: ' + contentType 
              });
              reject(new Error('Expected JSON, but got: ' + contentType));
            }
          } else {
            span.setStatus({ 
              code: 1, 
              message: xhr.statusText 
            });
            span.setAttribute('http.status_code', xhr.status);
            reject(new Error(xhr.statusText));
          }
        } catch (error: any) {
          span.setStatus({ 
            code: 1, 
            message: 'Error processing response: ' + error?.message 
          });
          reject(error);
        } finally {
          // Siempre finalizar el span
          span.end();
          console.log('finally end');
        }
      };

      xhr.onerror = () => {
        span.setStatus({ 
          code: 1, 
          message: 'Network error' 
        });
        span.end();
        console.log('on error end');
        reject(new Error('Network error'));
      };

      if (body) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(body));
      } else {
        xhr.send();
      }
    } catch (error) {
      span.setStatus({ 
        code: 1, 
        message: 'Error setting up request: ' + error.message 
      });
      span.end();
      console.log('catch end');
      reject(error);
    }
  });
}

export default makeRequest;