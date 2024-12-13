const generateRandomHex = (length: number): string => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };
  
  export const generateTraceId = (): string => {
    const timestamp = Date.now().toString(16).padStart(16, '0');
    const random = generateRandomHex(16);
    return `${timestamp}${random}`;
  };
  
  export const generateSpanId = (): string => {
    return generateRandomHex(16);
  };