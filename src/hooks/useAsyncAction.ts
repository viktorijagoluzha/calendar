import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { t } from '../i18n';

interface UseAsyncActionOptions {
  onSuccess?: (result?: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useAsyncAction = () => {
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (action: () => Promise<any>, options: UseAsyncActionOptions = {}) => {
      try {
        setLoading(true);
        const result = await action();

        if (options.successMessage) {
          Alert.alert(t('common.success'), options.successMessage, [
            {
              text: t('common.ok'),
              onPress: () => options.onSuccess?.(result),
            },
          ]);
        } else if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : options.errorMessage || t('common.error');
        Alert.alert(t('common.error'), errorMsg);

        if (options.onError) {
          options.onError(error);
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, execute };
};
