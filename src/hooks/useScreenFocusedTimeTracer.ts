import { useEffect } from "react";
import tracing from "../instrumentation/Tracer";

const useScreenFocusedTimeTracer = (screenName: string) => {
  useEffect(() => {
      // How much time an user spends in a particular screen
      // we should return span.end() within the clean up function
  
      const span = tracing.startSpan('Screen focused time');
      span.setAttribute('focused_screen', screenName);
      
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