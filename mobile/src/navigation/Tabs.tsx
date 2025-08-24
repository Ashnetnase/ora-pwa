import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MapPin, Car, FileText, Info as InfoIcon } from 'lucide-react';
import Dashboard from '../screens/Dashboard';
import Map from '../screens/Map';
import Roads from '../screens/Roads';
import Report from '../screens/Report';
import Info from '../screens/Info';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={Map}
        options={{
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Roads" 
        component={Roads}
        options={{
          tabBarIcon: ({ color, size }) => <Car size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Report" 
        component={Report}
        options={{
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Info" 
        component={Info}
        options={{
          tabBarIcon: ({ color, size }) => <InfoIcon size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
