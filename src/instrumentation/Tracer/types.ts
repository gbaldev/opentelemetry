export interface TraceAttribute {
  key: string;
  value: {
    stringValue?: string;
    intValue?: number;
    doubleValue?: number;
    boolValue?: boolean;
  };
}
  
export interface TraceEvent {
  name: string;
  timeUnixNano: number;
  attributes: TraceAttribute[];
}

export interface SpanStatus {
  code: number;
}
  
export interface TraceData {
  resourceSpans: Array<{
    resource: {
      attributes: TraceAttribute[];
      droppedAttributesCount: number;
    };
    scopeSpans: Array<{
      scope: {
        name: string;
        version: string;
      };
      spans: Array<{
        traceId: string;
        spanId: string;
        name: string;
        kind: number;
        startTimeUnixNano: string;
        endTimeUnixNano: string;
        attributes: TraceAttribute[];
        status: SpanStatus;
        events: TraceEvent[];
        droppedAttributesCount: number;
        droppedEventsCount: number;
        droppedLinksCount: number;
      }>;
    }>;
  }>;
}
