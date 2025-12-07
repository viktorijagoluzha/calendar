import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { checkAuth } from '../store/slices/authSlice';
import { AuthStack } from './AuthStack';
import { MainStack } from './MainStack';
import { theme } from '../theme';

export const AppNavigator = () => {
  const { isAuthenticated, isLoading, dispatch } = useAuth();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      await dispatch(checkAuth());
      setInitializing(false);
    };
    checkAuthStatus();
  }, []);

  if (initializing || isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        {isAuthenticated ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
