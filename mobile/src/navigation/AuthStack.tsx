import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

// Define the auth stack types
type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Placeholder components - these will be replaced with your actual auth components
const LoginScreen = () => (
  <View style={styles.container}>
    <Text>Login Screen - Import your LoginScreen component here</Text>
  </View>
);

const SignupScreen = () => (
  <View style={styles.container}>
    <Text>Signup Screen - Import your SignupScreen component here</Text>
  </View>
);

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
