import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
// [cursor-add]: nav setup - Import new navigation structure
import AppNavigator from './src/navigation/AppNavigator';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <NavigationContainer>
      {/* [cursor-add]: nav setup - Using new AppNavigator component */}
      <AppNavigator />
      <StatusBar style="auto" />
      <Toaster />
    </NavigationContainer>
  );
}
