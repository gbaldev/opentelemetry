import { useEffect } from "react";
import tracing from "../instrumentation/Tracer";
import { Platform } from "react-native";
import { getDeviceId, getSystemVersion, getVersion } from "react-native-device-info";

const useScreenFocusedTimeTracer = (screenName: string) => {
  useEffect(() => {
      // How much time an user spends in a particular screen
      // we should return span.end() within the clean up function
  
      const span = tracing.startSpan('Screen focused time');
      span.setAttribute('focused_screen', screenName);
      span.setAttribute("SERVICE_NAME", 'todo-lst-mobile');
      span.setAttribute('OS_NAME', Platform.OS);
      span.setAttribute('OS_VERSION', getSystemVersion()),
      span.setAttribute('SERVICE_VERSION', getVersion());
      span.setAttribute('DEVICE_ID', getDeviceId());
      
      // for simulating 10 seconds.
      setTimeout(() => {
        span.end();
      }, 10000);
  
      // This should be real implementation:
      //
      // return () => span.end();
    }, []);
}

export default useScreenFocusedTimeTracer;