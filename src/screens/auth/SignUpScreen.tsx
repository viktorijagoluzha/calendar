import React, { useState } from 'react';
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
import { signUp } from '../../store/slices/authSlice';
import { t } from '../../i18n';
import { AuthContainer, PasswordInput } from '../../components/auth';
import { theme } from '../../theme';

const SignUpScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isLoading, dispatch } = useAuth();
  const { loading, execute } = useAsyncAction();
  const {
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validateRequiredField,
  } = useFormValidation();

  const handleSignUp = async () => {
    if (!validateRequiredField(fullName, t('errors.enterFullName'))) return;
    if (!validateEmail(email)) return;
    if (!validatePassword(password)) return;
    if (!validatePasswordMatch(password, confirmPassword)) return;

    await execute(
      async () => {
        await dispatch(signUp({ fullName, email, password })).unwrap();
      },
      {
        successMessage: t('success.accountCreated'),
        errorMessage: t('errors.accountCreationFailed'),
      },
    );
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  return (
    <AuthContainer
      title={t('auth.signUp')}
      subtitle={t('auth.createAccount')}
      scrollable={true}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.fullName')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('auth.enterFullName')}
          placeholderTextColor={theme.colors.text.tertiary}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
      </View>

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
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.password')}</Text>
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder={t('auth.enterPassword')}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('auth.confirmPassword')}</Text>
        <PasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t('auth.reenterPassword')}
        />
      </View>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleSignUp}
        disabled={isLoading || loading}
      >
        {isLoading || loading ? (
          <ActivityIndicator color={theme.colors.text.inverse} />
        ) : (
          <Text style={styles.signUpButtonText}>{t('auth.signUp')}</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>{t('auth.alreadyHaveAccount')}</Text>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={styles.signInLink}>{t('auth.signIn')}</Text>
        </TouchableOpacity>
      </View>
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
  signUpButton: {
    backgroundColor: theme.colors.primary,
    height: 50,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  signUpButtonText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    ...theme.typography.body2,
  },
  signInLink: {
    ...theme.typography.body2,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default SignUpScreen;
