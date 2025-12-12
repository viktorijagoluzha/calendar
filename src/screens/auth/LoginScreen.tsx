import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useFormValidation } from '../../hooks/useFormValidation';
import { signIn, signInWithBiometrics } from '../../store/slices/authSlice';
import { biometricService } from '../../services/biometricService';
import { t } from '../../i18n';
import { AuthContainer, PasswordInput } from '../../components/auth';
import { theme } from '../../theme';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showBiometric, setShowBiometric] = useState(false);
  const { isLoading, biometricsEnabled, user, dispatch } = useAuth();
  const { loading, execute } = useAsyncAction();
  const { validateRequiredField } = useFormValidation();

  useEffect(() => {
    checkBiometricAvailability();
  }, [biometricsEnabled, user]);

  const checkBiometricAvailability = async () => {
    const { available } = await biometricService.isBiometricAvailable();
    const { authService } = await import('../../services/authService');
    const AsyncStorage = (
      await import('@react-native-async-storage/async-storage')
    ).default;
    const lastUserData = await AsyncStorage.getItem('@calendar_last_user');
    const biometricsEnabledCheck = await authService.isBiometricsEnabled();

    setShowBiometric(
      available && biometricsEnabledCheck && lastUserData !== null,
    );
  };

  const handleSignIn = async () => {
    if (
      !validateRequiredField(email, t('errors.enterEmail')) ||
      !validateRequiredField(password, t('errors.enterPassword'))
    ) {
      return;
    }

    await execute(
      async () => {
        await dispatch(signIn({ email, password })).unwrap();
      },
      {
        errorMessage: t('errors.invalidCredentials'),
      },
    );
  };

  const handleBiometricSignIn = async () => {
    await execute(
      async () => {
        await dispatch(signInWithBiometrics()).unwrap();
      },
      {
        errorMessage: t('errors.authFailed'),
      },
    );
  };

  return (
    <AuthContainer title={t('auth.signIn')} subtitle="Welcome back!">
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.email')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('auth.enterEmail')}
          placeholderTextColor={theme.colors.text.tertiary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading && !loading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.password')}</Text>
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder={t('auth.enterPassword')}
          editable={!isLoading && !loading}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>{t('auth.forgotPassword')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signInButton}
        onPress={handleSignIn}
        disabled={isLoading || loading}
      >
        {isLoading || loading ? (
          <ActivityIndicator color={theme.colors.text.inverse} />
        ) : (
          <Text style={styles.signInButtonText}>{t('auth.signIn')}</Text>
        )}
      </TouchableOpacity>

      {showBiometric && (
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleBiometricSignIn}
          disabled={isLoading || loading}
        >
          <Text style={styles.biometricButtonText}>
            {t('auth.biometricLogin')}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>{t('auth.signUp')}</Text>
      </TouchableOpacity>
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...theme.typography.label,
    marginBottom: theme.spacing.sm,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    ...theme.typography.body1,
  },
  forgotPassword: {
    ...theme.typography.body2,
    marginBottom: theme.spacing.xxxl,
  },
  signInButton: {
    backgroundColor: theme.colors.primary,
    height: 50,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  signInButtonText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
  biometricButton: {
    backgroundColor: theme.colors.background,
    height: 50,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing.xl,
  },
  biometricButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary,
  },
  signUpText: {
    ...theme.typography.body1,
    textAlign: 'center',
  },
});

export default LoginScreen;
