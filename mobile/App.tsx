import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
// [cursor-add]: nav setup - Import new navigation structure
import { AppNavigator } from './src/navigation/AppNavigator';
// [cursor-add]: auth setup - Import AuthProvider
import { AuthProvider } from './src/state/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        {/* [cursor-add]: nav setup - Using new AppNavigator component */}
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
