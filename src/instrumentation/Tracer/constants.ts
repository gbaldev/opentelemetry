export const SPAN_KIND = {
    INTERNAL: 1,
    SERVER: 2,
    CLIENT: 3,
    PRODUCER: 4,
    CONSUMER: 5,
  } as const;
  
  export const STATUS_CODE = {
    UNSET: 0,
    OK: 1,
    ERROR: 2,
  } as const;