import { useEffect, useState } from "react";
import { Tracer } from "../instrumentation/Tracer";

export interface TracerResult {
    loaded: boolean;
  }
  
  export const useTracer = () : TracerResult => {
    const [loaded, setLoaded] = useState<boolean>(false);
  
    useEffect(() => {
       if (!loaded) {
        Tracer()
          .catch((e) => console.warn("failed to setup tracer", e))
          .finally(() => setLoaded(true))
      }
    }, [loaded]);
  
    return {
      loaded
    }
  }