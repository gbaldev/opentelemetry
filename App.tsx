import React from 'react';
import { StatusBar } from 'react-native';
import Home from './src/containers/Home';
import InstrumentationProvider from './src/providers/Instrumentation/provider';

export default function App() {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        translucent 
        backgroundColor="transparent" 
        />
      <InstrumentationProvider>
        <Home />
      </InstrumentationProvider>
    </>
  );
}
