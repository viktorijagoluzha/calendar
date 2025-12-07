import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import CreateEventScreen from '../screens/calendar/CreateEventScreen';
import EditEventScreen from '../screens/calendar/EditEventScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

const Stack = createNativeStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="EditEvent"
        component={EditEventScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};
