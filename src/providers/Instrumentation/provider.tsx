import React, { useMemo } from 'react';
import { initializeTelemetry } from '../../instrumentation';
import { InstrumentationContextType, Provider } from './context';

type InstrumentationProviderProps = {};

export const InstrumentationProvider: React.ComponentType<InstrumentationProviderProps> = ({
  children,
}) => {
  const instrumentation = initializeTelemetry();

  const contextValue = useMemo<InstrumentationContextType>(
    () => ({
      instrumentation
    }),
    [instrumentation],
  );

  return <Provider value={contextValue}>{children}</Provider>;
};

export default InstrumentationProvider;
