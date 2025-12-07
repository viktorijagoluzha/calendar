import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/calendar/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          paddingBottom: theme.spacing.xs,
          paddingTop: theme.spacing.xs,
          height: 60,
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          ...theme.typography.caption,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Calendar"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
