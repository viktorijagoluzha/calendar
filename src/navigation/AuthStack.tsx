import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  LoginScreen,
  SignUpScreen,
  ForgotPasswordScreen,
} from '../screens/auth';

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};
