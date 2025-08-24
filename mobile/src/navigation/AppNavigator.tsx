import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { Tabs } from './Tabs';

// Define the root stack types
type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored authentication on app load
  useEffect(() => {
    // TODO: Replace with AsyncStorage check when you're ready
    // const checkAuth = async () => {
    //   try {
    //     const auth = await AsyncStorage.getItem('alartd_auth');
    //     setIsAuthenticated(auth === 'true');
    //   } catch (error) {
    //     console.error('Failed to check auth status:', error);
    //   }
    // };
    // checkAuth();
    
    // For now, start with auth screen
    setIsAuthenticated(false);
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={Tabs} />
      )}
    </Stack.Navigator>
  );
}
