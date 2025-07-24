import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/screens/RootStack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserContextProvide } from './contexts/UserContext';

const queryClient = new QueryClient();

function App() {
  return (
    <UserContextProvide>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </QueryClientProvider>
    </UserContextProvide>
  );
}

export default App;
