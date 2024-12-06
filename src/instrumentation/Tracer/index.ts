import axios from 'axios';
import { getTimeInNanoseconds } from '../../utils/timeUtils';

export class Span {
  private _name: string;
  private _attributes: Record<string, string | number | boolean> = {};
  private _startTime: number;
  private _endTime?: number;
  private _traceId: string;
  private _spanId: string;

  constructor(name: string) {
    this._name = name;
    this._startTime = Date.now();
    this._traceId = this.generateTraceId();
    this._spanId = this.generateSpanId();
  }

  setAttribute(key: string, value: string | number | boolean): this {
    this._attributes[key] = value;
    return this;
  }

  end() {
    this._endTime = Date.now();
    this.sendTrace();
  }

  private generateTraceId(): string {
    const timestamp = Date.now().toString(16).padStart(16, '0');
    const randomPart = Array.from(
      { length: 16 }, 
      () => Math.floor(Math.random() * 16).toString(16)
    ).join('');
    return (timestamp + randomPart).slice(0, 32).toUpperCase();
  }

  private generateSpanId(): string {
    return Array.from(
      { length: 16 }, 
      () => Math.floor(Math.random() * 16).toString(16)
    ).join('').toUpperCase();
  }


  private async sendTrace() {
    const traceAxios = axios.create({
      baseURL: 'http://localhost:4318/v1',
      headers: { 'Content-Type': 'application/json' }
    });

    const traceData = {
      resourceSpans: [{
        resource: {
          attributes: [{
            key: "service.name",
            value: { stringValue: "todo-list-mobile-service" }
          }]
        },
        scopeSpans: [{
          scope: {
            name: "custom-tracing",
            version: "1.0.0"
          },
          spans: [{
            traceId: this._traceId,
            spanId: this._spanId,
            name: this._name,
            startTimeUnixNano: this._startTime * 1e6,
            endTimeUnixNano: (this._endTime || getTimeInNanoseconds()),
            kind: 2,
            attributes: Object.entries(this._attributes).map(([key, value]) => ({
              key,
              value: this.convertValue(value)
            }))
          }]
        }]
      }]
    };

    try {
      const response = await traceAxios.post('/traces', traceData);
      console.log(`[SENDING TRACE]: Span name: ${this._name}, Trace id: ${this._traceId}, Span id: ${this._spanId}, start time: ${this._startTime}, end time: ${this._endTime}, duration: ${((this._endTime! - this._startTime) / 1000).toFixed(3)} seconds`);
      console.log(response);
    } catch (error) {
      console.log(`[ERROR SENDING TRACE]: Name: ${this._name}, Trace id: ${this._traceId}, Span id: ${this._spanId}, start time: ${this._startTime}, end time: ${this._endTime}`);
      console.log(error);
      console.error('Trace sending error:', error);
    }
  }

  private convertValue(value: string | number | boolean) {
    switch (typeof value) {
      case 'string': return { stringValue: value };
      case 'number': return { doubleValue: value };
      case 'boolean': return { boolValue: value };
      default: return { stringValue: String(value) };
    }
  }
}

const tracing = {
  startSpan: (name: string) => new Span(name)
};

export default tracing;
