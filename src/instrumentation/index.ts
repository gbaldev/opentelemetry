import { initializeTracing } from './tracing';
import { initializeLogging } from './logging';
import { initializeMetrics } from './metrics';
import { diag, DiagAPI, Tracer } from '@opentelemetry/api';

interface Meter {
  registerCreate: (id: number) => void;
  registerDelete: (id: number) => void;
}
export type Instrumentation = { logger: DiagAPI, meter: Meter, tracing: Tracer };

export const initializeTelemetry = (): Instrumentation => {
  // Logging, use diag api to track later.
  initializeLogging();
  diag.info('App initialized: ', Date.now());

  // Metrics
  let meter = initializeMetrics();
 
  const createdCounter = meter.createCounter('todo_list_created', {
    description: 'Number of created items'
  });

  const deletedCounter = meter.createCounter('todo_list_deleted', {
    description: 'Number of deleted items'
  });

  const registerCreate = (id: number) => {
    createdCounter.add(1, { 
      'method': 'CREATE', 
      'endpoint': '/todos' 
    });
    diag.info(`New element created ${id}`);
  };

  const registerDelete = (id: number) => {
    deletedCounter.add(1, { 
      'method': 'DELETE', 
      'endpoint': '/todos' 
    });
    diag.info(`Deleted element ${id}`);
  };

  let tracing = initializeTracing();
  
  return { logger: diag, meter: { registerCreate, registerDelete }, tracing };
};
