import { SPAN_KIND, STATUS_CODE } from './constants';
import type { TraceAttribute, TraceData, TraceEvent } from './types';
import { getTimeInNanoseconds } from '../../utils/timeUtils';
import { generateSpanId, generateTraceId } from './utils/idGenerator';
import { TRACE_CONFIG } from './config';
import { traceAxios } from '../../services/TracesService/provider';

export class Span {
  private _name: string;
  private _attributes: Record<string, any> = {};
  private _startTimeUnixNano: bigint;
  private _endTimeUnixNano?: bigint;
  private _traceId: string;
  private _spanId: string;
  private _status: { code: number } = { code: STATUS_CODE.UNSET };
  private _events: TraceEvent[] = [];

  constructor(name: string) {
    this._name = name;
    this._startTimeUnixNano = BigInt(getTimeInNanoseconds());
    this._traceId = generateTraceId();
    this._spanId = generateSpanId();
  }

  setAttribute(key: string, value: string | number | boolean): this {
    this._attributes[key] = value;
    return this;
  }

  setStatus(code: number): this {
    this._status.code = code;
    return this;
  }

  addEvent(name: string, attributes: Record<string, any> = {}): this {
    this._events.push({
      name,
      timeUnixNano: getTimeInNanoseconds(),
      attributes: Object.entries(attributes).map(([key, value]) => ({
        key,
        value: this.convertValue(value)
      }))
    });
    return this;
  }

  end() {
    this._endTimeUnixNano = BigInt(getTimeInNanoseconds());
    this.sendTrace();
  }

  private async sendTrace() {
    const traceData: TraceData = {
      resourceSpans: [{
        resource: {
          attributes: [{
            key: "service.name",
            value: { stringValue: TRACE_CONFIG.SERVICE_NAME }
          }, {
            key: "service.version",
            value: { stringValue: TRACE_CONFIG.SERVICE_VERSION }
          }],
          droppedAttributesCount: 0
        },
        scopeSpans: [{
          scope: {
            name: TRACE_CONFIG.INSTRUMENTATION_NAME,
            version: TRACE_CONFIG.INSTRUMENTATION_VERSION
          },
          spans: [{
            traceId: this._traceId,
            spanId: this._spanId,
            name: this._name,
            kind: SPAN_KIND.SERVER,
            startTimeUnixNano: this._startTimeUnixNano.toString(),
            endTimeUnixNano: this._endTimeUnixNano!.toString(),
            attributes: Object.entries(this._attributes).map(([key, value]) => ({
              key,
              value: this.convertValue(value)
            })),
            status: this._status,
            events: this._events,
            droppedAttributesCount: 0,
            droppedEventsCount: 0,
            droppedLinksCount: 0
          }]
        }]
      }]
    };

    try {
      await traceAxios.post('/traces', traceData);
      console.log(`Trace sent successfully: ${this._traceId}`);
    } catch (error) {
      console.error('Error sending trace:', error);
    }
  }

  private convertValue(value: any): TraceAttribute['value'] {
    switch (typeof value) {
      case 'string':
        return { stringValue: value };
      case 'number':
        return Number.isInteger(value) ? 
          { intValue: value } : 
          { doubleValue: value };
      case 'boolean':
        return { boolValue: value };
      default:
        return { stringValue: String(value) };
    }
  }
}

const tracing = {
  startSpan: (name: string) => new Span(name)
};

export default tracing;