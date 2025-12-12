import { Alert } from 'react-native';
import { t } from '../i18n';

export const useFormValidation = () => {
  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      Alert.alert(t('common.error'), t('errors.enterEmail'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common.error'), t('errors.invalidEmail'));
      return false;
    }

    return true;
  };

  const validatePassword = (
    password: string,
    minLength: number = 6,
  ): boolean => {
    if (!password) {
      Alert.alert(t('common.error'), t('errors.enterPassword'));
      return false;
    }

    if (password.length < minLength) {
      Alert.alert(t('common.error'), t('errors.passwordMinLength'));
      return false;
    }

    return true;
  };

  const validatePasswordMatch = (
    password: string,
    confirmPassword: string,
  ): boolean => {
    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('errors.passwordsNotMatch'));
      return false;
    }
    return true;
  };

  const validateRequiredField = (
    value: string,
    errorMessage: string,
  ): boolean => {
    if (!value.trim()) {
      Alert.alert(t('common.error'), errorMessage);
      return false;
    }
    return true;
  };

  return {
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validateRequiredField,
  };
};
