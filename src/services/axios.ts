import axios, {AxiosInstance, CancelTokenSource} from 'axios';
import {HttpRequests} from '../models';
import { sendLog } from '../instrumentation/Logger';
import { LOG_LEVEL } from '../instrumentation/Logger/consts';
import { ACTIONS } from './consts';

const GET_DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Cache-Control': 'no-cache',
};

class AxiosImpl implements HttpRequests {
  private axiosInstance: AxiosInstance;
  public signal: CancelTokenSource;

  constructor() {
    this.axiosInstance = axios.create();
    this.signal = axios.CancelToken.source();
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        const requestLogData = {
          url: config?.url,
          method: config.method,
          start_at: Date.now()
        };
        
        sendLog(requestLogData, 'info');
        
        config.metadata = { requestLogData };
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: any) => {
        const requestLogData = response.config.metadata?.requestLogData;
        if (requestLogData) {
          sendLog({
            ...requestLogData,
            end_at: Date.now(),
            status: response.status
          });
        }
        
        return response;
      },
      (error) => {
        const requestLogData = error.config?.metadata?.requestLogData;
        if (requestLogData) {
          sendLog({
            ...requestLogData,
            end_at: Date.now(),
            status: error.response?.status || 'error',
            error: error.message
          }, LOG_LEVEL.ERROR);
        }
        
        return Promise.reject(error);
      }
    );
  }

  cancelRequest = (reason: string) => {
    this.signal.cancel(reason);
    this.signal = axios.CancelToken.source();
  };

  setAxiosInstance = (axiosIns: AxiosInstance) => {
    this.axiosInstance = axiosIns;
    this.setupInterceptors();
  };

  setAuthHeader = (authHeader: string) => {
    this.axiosInstance.defaults.headers.common.Authorization = authHeader;
  };

  get = async (url: string, headers = GET_DEFAULT_HEADERS) => {
    const {data: _data} = await this.axiosInstance.request({
      method: ACTIONS.GET,
      headers,
      url,
      cancelToken: this.signal.token
    });
    return _data;
  };

  post = async (
    url: string,
    data: any,
    headers = GET_DEFAULT_HEADERS,
  ) => {
    const {data: _data} = await this.axiosInstance.request({
      method: ACTIONS.POST,
      headers,
      url,
      data,
      cancelToken: this.signal.token
    });
    return _data;
  };

  delete = async (url: string, headers = GET_DEFAULT_HEADERS) => {
    const {data: _data} = await this.axiosInstance.request({
      method: ACTIONS.DELETE,
      headers,
      url,
      cancelToken: this.signal.token
    });
    return _data;
  };

  put = async (
    url: string,
    data: any,
    headers = GET_DEFAULT_HEADERS,
  ) => {
    const {data: _data} = await this.axiosInstance.request({
      method: ACTIONS.PUT,
      headers,
      url,
      data,
      cancelToken: this.signal.token
    });
    return _data;
  };

  patch = async () => {};
}

export default AxiosImpl;