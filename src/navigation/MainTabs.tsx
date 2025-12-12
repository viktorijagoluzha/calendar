import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/calendar/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

const TAB_BAR_HEIGHT = 60;

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: theme.colors.text.tertiary,
  tabBarStyle: {
    paddingBottom: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    height: TAB_BAR_HEIGHT,
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.border,
  },
  tabBarLabelStyle: {
    ...theme.typography.caption,
    fontWeight: '500',
  },
};

const getTabBarIcon =
  (iconName: string) =>
  ({ color, size }: { color: string; size: number }) =>
    <Icon name={iconName} size={size} color={color} />;

export const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Calendar"
        component={HomeScreen}
        options={{
          tabBarIcon: getTabBarIcon('calendar-outline'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: getTabBarIcon('person-outline'),
        }}
      />
    </Tab.Navigator>
  );
};
