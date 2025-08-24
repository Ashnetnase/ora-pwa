import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useAuth } from '../state/AuthContext';
// [cursor-add]: import Dashboard screen
import Dashboard from '../screens/Dashboard';
// [cursor-add]: import Map screen
import Map from '../screens/Map';
// [cursor-add]: import Roads screen
import Roads from '../screens/Roads';
// [cursor-add]: import Report screen
import Report from '../screens/Report';

// Define the tab navigator types
type TabParamList = {
  Dashboard: undefined;
  Map: undefined;
  Roads: undefined;
  Report: undefined;
  Info: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// [cursor-add]: Dashboard screen is now imported and used
const InfoScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Info Screen</Text>
    <Text>Import your InfoScreen component here</Text>
  </View>
);

export function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB', // Using theme blue color
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{
          tabBarLabel: 'Home',
          // Add tabBarIcon here when you have icons
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={Map}
        options={{
          tabBarLabel: 'Map',
        }}
      />
      <Tab.Screen 
        name="Roads" 
        component={Roads}
        options={{
          tabBarLabel: 'Roads',
        }}
      />
      <Tab.Screen 
        name="Report" 
        component={Report}
        options={{
          tabBarLabel: 'Report',
        }}
      />
      <Tab.Screen 
        name="Info" 
        component={InfoScreen}
        options={{
          tabBarLabel: 'Info',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
