import React, { useMemo } from 'react';
import { InstrumentationContextType, Provider } from './context';
import { useTracer } from '../../hooks/useTracer';

type InstrumentationProviderProps = {};

export const InstrumentationProvider: React.ComponentType<InstrumentationProviderProps> = ({
  children,
}) => {
  const tracer = useTracer();

  const contextValue = useMemo<InstrumentationContextType>(
    () => ({
      tracer
    }),
    [tracer],
  );

  return <Provider value={contextValue}>{children}</Provider>;
};

export default InstrumentationProvider;
