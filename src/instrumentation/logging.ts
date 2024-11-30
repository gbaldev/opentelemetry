import { diag, DiagLogger, DiagLogLevel } from '@opentelemetry/api';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

class LokiExporter {
  private url: string;
  private serviceName: string;

  constructor(url: string, serviceName: string = 'reat-native-todo-list-app') {
    this.url = url;
    this.serviceName = serviceName;
  }

   async export(message: string, level: string): Promise<void> {
      const deviceId = await DeviceInfo.getUniqueId();

     const logData = {
       streams: [
         {
           stream: {
             job: 'react-native-logs',
             service: this.serviceName,
             device_id: deviceId,
             level: level,
             platform: DeviceInfo.getSystemName(),
             app_version: DeviceInfo.getVersion()
           },
           values: [
             [
               `${Date.now() * 1000000}`, 
               message,
             ],
           ],
         },
       ],
     };

     try {
       await axios.post(this.url, logData, {
         headers: { 'Content-Type': 'application/json' },
         timeout: 5000 
       });
     } catch (error) {
       console.error('Error sending logs to Loki', error);
     }
   }
}

class CustomLogger implements DiagLogger {
   private lokiExporter: LokiExporter;

   constructor(serviceName: string) {
     this.lokiExporter = new LokiExporter('http://tempo:3100/loki/api/v1/push', serviceName);
   }

   verbose(message: string): void {
     const logMessage = `[VERBOSE] ${message}`;
     this.lokiExporter.export(logMessage, 'verbose');
   }

   debug(message: string): void {
     const logMessage = `[DEBUG] ${message}`;
     this.lokiExporter.export(logMessage, 'debug');
   }

   info(message: string): void {
     const logMessage = `[INFO] ${message}`;
     this.lokiExporter.export(logMessage, 'info');
   }

   warn(message: string): void {
     const logMessage = `[WARN] ${message}`;
     this.lokiExporter.export(logMessage, 'warn');
   }

   error(message: string): void {
     const logMessage = `[ERROR] ${message}`;
     this.lokiExporter.export(logMessage, 'error');
   }
}

export const initializeLogging = (serviceName: string = 'react-native-todo-app'): void => {
   diag.setLogger(new CustomLogger(serviceName), DiagLogLevel.DEBUG);
   diag.debug('Logger initialized succesfully');
};
