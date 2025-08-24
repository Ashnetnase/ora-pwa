import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './Tabs';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // For now, show AuthStack first - you can toggle this to test
  const isAuthenticated = false; // Set to true to skip login and go straight to tabs

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={Tabs} />
      )}
    </Stack.Navigator>
  );
}
