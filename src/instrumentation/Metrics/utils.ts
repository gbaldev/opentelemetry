import protobuf from "protobufjs";
import { protoText } from "./schema";
import snappy from 'snappyjs';

export const getCompressedPayload = async (payload: any) => {
    const root = await protobuf.parse(protoText, { keepCase: true }).root;
    const MetricMessage = root.lookupType('MetricMessage');
    const message = MetricMessage.create(payload);
    const buffer = MetricMessage.encode(message).finish();
    const compressedBuffer = snappy.compress(buffer);

    return compressedBuffer;
}