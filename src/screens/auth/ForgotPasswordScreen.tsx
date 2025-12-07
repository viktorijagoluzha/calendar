import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { t } from '../../i18n';
import { AuthContainer } from '../../components/auth';
import { theme } from '../../theme';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    Alert.alert(t('common.success'), t('success.passwordResetSent'));
    console.log('Reset password for:', email);
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <AuthContainer
      title={t('auth.forgotPassword')}
      subtitle={t('auth.resetPasswordInstructions')}
    >
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

      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetPassword}
      >
        <Text style={styles.resetButtonText}>{t('auth.resetPassword')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleBackToLogin}>
        <Text style={styles.backToLoginText}>{t('auth.signIn')}</Text>
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
  resetButton: {
    backgroundColor: theme.colors.primary,
    height: 50,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  resetButtonText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
  backToLoginText: {
    ...theme.typography.body1,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
