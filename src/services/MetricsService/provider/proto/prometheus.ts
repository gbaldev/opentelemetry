// Prometheus Remote Write Protocol
// https://github.com/prometheus/prometheus/blob/main/prompb/remote.proto
export const protoText = `
syntax = "proto3";
package prometheus;

message WriteRequest {
  repeated TimeSeries timeseries = 1;
}

message TimeSeries {
  repeated Label labels = 1;
  repeated Sample samples = 2;
}

message Label {
  string name = 1;
  string value = 2;
}

message Sample {
  double value = 1;
  int64 timestamp = 2;
}
`;