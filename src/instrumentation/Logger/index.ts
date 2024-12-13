import { LOG_LEVEL } from './constants';
import { getTimeInNanoseconds } from '../../utils/timeUtils';
import { lokiAxios } from '../../services/LogsService/provider';
import { LOGGER_CONFIG } from './config';

export const sendLog = async (
  logAction: { 
    url: string, 
    method: string, 
    start_at: number,
    ends_at?: number,
    latency?: number,
    status?: number,
  }, 
  level: string = LOG_LEVEL.INFO,
) => {
  const timestamp = getTimeInNanoseconds();

  const logData = {
    streams: [
      {
        stream: {
          service_name: LOGGER_CONFIG.SERVICE_NAME,
          log_level: level.toUpperCase(),
          http_method: logAction.method?.toUpperCase() || '',
          http_url: logAction.url || '',
          http_request_start_time: logAction.start_at.toString(),
          otelServiceName: LOGGER_CONFIG.SERVICE_NAME,
          start_at: logAction.start_at,
          ends_at: logAction.ends_at || '',
          latency: logAction.latency || '',
          response_status: logAction.status || '',
        },
        values: [
          [timestamp.toString(), 'HTTP_REQUEST']
        ],
      },
    ],
  };

  try {
    const response = await lokiAxios.post('/push', logData);
    console.log(`[SENDING LOG]: Method: ${logAction.method}, Url: ${logAction.url}, StartTime: ${logAction.start_at}, level: ${level}, response status: ${response.status}`);
  } catch (error) {
    console.log(`[ERROR SENDING LOG]: Method: ${logAction.method}, Url: ${logAction.url}, StartTime: ${logAction.start_at}, level: ${level}, error: ${error}`);
  }
};
