import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/screens/RootStack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
