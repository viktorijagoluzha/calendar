import { useMemo } from 'react';
import { Alert } from 'react-native';
import { t } from '../i18n';
import { EMAIL_REGEX, MIN_PASSWORD_LENGTH } from '../constants';

export const useFormValidation = () => {
  const validateEmail = useMemo(
    () =>
      (email: string): boolean => {
        if (!email.trim()) {
          Alert.alert(t('common.error'), t('errors.enterEmail'));
          return false;
        }

        if (!EMAIL_REGEX.test(email)) {
          Alert.alert(t('common.error'), t('errors.invalidEmail'));
          return false;
        }

        return true;
      },
    [],
  );

  const validatePassword = useMemo(
    () =>
      (password: string, minLength: number = MIN_PASSWORD_LENGTH): boolean => {
        if (!password) {
          Alert.alert(t('common.error'), t('errors.enterPassword'));
          return false;
        }

        if (password.length < minLength) {
          Alert.alert(t('common.error'), t('errors.passwordMinLength'));
          return false;
        }

        return true;
      },
    [],
  );

  const validatePasswordMatch = useMemo(
    () =>
      (password: string, confirmPassword: string): boolean => {
        if (password !== confirmPassword) {
          Alert.alert(t('common.error'), t('errors.passwordsNotMatch'));
          return false;
        }
        return true;
      },
    [],
  );

  const validateRequiredField = useMemo(
    () =>
      (value: string, errorMessage: string): boolean => {
        if (!value.trim()) {
          Alert.alert(t('common.error'), errorMessage);
          return false;
        }
        return true;
      },
    [],
  );

  return useMemo(
    () => ({
      validateEmail,
      validatePassword,
      validatePasswordMatch,
      validateRequiredField,
    }),
    [
      validateEmail,
      validatePassword,
      validatePasswordMatch,
      validateRequiredField,
    ],
  );
};
