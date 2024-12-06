import axios from 'axios';
import { LOG_LEVEL } from './consts';
import { getTimeInNanoseconds } from '../../utils/timeUtils';

const lokiAxios = axios.create({
  baseURL: 'http://localhost:3100/loki/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});


export const sendLog = async (
  logAction: { 
    url: string, 
    method: string, 
    start_at: number 
  }, 
  level: string = LOG_LEVEL.INFO,
) => {
  const timestamp = getTimeInNanoseconds();

  const logData = {
    streams: [
      {
        stream: {
          application: "todo-list-mobile",
          log_level: level,
          http_method: logAction.method,
          http_url: logAction.url
        },
        values: [
          [timestamp.toString(), 'HTTP_REQUEST']
        ],
      },
    ],
  };

  try {
    const response = await lokiAxios.post('/push', logData);
    console.log(`[SENDING LOG]: Method: ${logAction.method}, Url: ${logAction.url}, StartTime: ${logAction.start_at}, level: ${level}`);
    console.log(response);
  } catch (error) {
    console.log(`[ERROR SENDING LOG]: Method: ${logAction.method}, Url: ${logAction.url}, StartTime: ${logAction.start_at}, level: ${level}`);
    console.error('Logging error:', error);
  }
};
