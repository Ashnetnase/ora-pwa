import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';

// Define the tab navigator types
type TabParamList = {
  Dashboard: undefined;
  Map: undefined;
  Roads: undefined;
  Report: undefined;
  Info: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Placeholder components - these will be replaced with your actual screen components
const DashboardScreen = () => (
  <View style={styles.container}>
    <Text>Dashboard Screen - Import your Dashboard component here</Text>
  </View>
);

const MapScreen = () => (
  <View style={styles.container}>
    <Text>Map Screen - Import your MapScreen component here</Text>
  </View>
);

const RoadsScreen = () => (
  <View style={styles.container}>
    <Text>Roads Screen - Import your RoadsScreen component here</Text>
  </View>
);

const ReportScreen = () => (
  <View style={styles.container}>
    <Text>Report Screen - Import your ReportScreen component here</Text>
  </View>
);

const InfoScreen = () => (
  <View style={styles.container}>
    <Text>Info Screen - Import your InfoScreen component here</Text>
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
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          // Add tabBarIcon here when you have icons
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
        }}
      />
      <Tab.Screen 
        name="Roads" 
        component={RoadsScreen}
        options={{
          tabBarLabel: 'Roads',
        }}
      />
      <Tab.Screen 
        name="Report" 
        component={ReportScreen}
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
