import { createContext, useContext } from 'react';

export type InstrumentationContextType = {
  tracer: any;
};

const InstrumentationContext = createContext<InstrumentationContextType | null>(null);
InstrumentationContext.displayName = 'InstrumentationContext';

export const Consumer = InstrumentationContext.Consumer;
export const Provider = InstrumentationContext.Provider;

export const useInstrumentation = () => {
  const context = useContext(InstrumentationContext);

  if (!context) {
    throw new Error(
      'useInstrumentationContext must be used within a UseInstrumentationContextProvider.',
    );
  }

  return context;
};
