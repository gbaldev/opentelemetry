import protobuf from 'protobufjs';
import snappy from 'snappyjs';
import { MetricsPayload } from '../types';
import { convertToPrometheusFormat } from './format';
import { protoText } from '../proto/prometheus';

export const compressMetricPayload = async (payload: MetricsPayload) => {
  try {
    const root = await protobuf.parse(protoText).root;
    const WriteRequest = root.lookupType('prometheus.WriteRequest');
    
    const prometheusPayload = convertToPrometheusFormat(payload);
    
    const message = WriteRequest.create(prometheusPayload);
    const errMsg = WriteRequest.verify(message);
    if (errMsg) throw Error(errMsg);
    
    const buffer = WriteRequest.encode(message).finish();
    return snappy.compress(buffer);
  } catch (error) {
    console.error('Error compressing metric payload:', error);
    throw error;
  }
};