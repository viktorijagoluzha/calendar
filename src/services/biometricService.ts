import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const biometricService = {
  async isBiometricAvailable(): Promise<{
    available: boolean;
    biometryType?: string;
  }> {
    try {
      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();
      return { available, biometryType };
    } catch (error) {
      console.error('Biometric availability check error:', error);
      return { available: false };
    }
  },

  async authenticate(): Promise<boolean> {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to sign in',
      });
      return success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  },

  getBiometryTypeName(biometryType?: string): string {
    switch (biometryType) {
      case BiometryTypes.FaceID:
        return 'Face ID';
      case BiometryTypes.TouchID:
        return 'Touch ID';
      case BiometryTypes.Biometrics:
        return 'Biometrics';
      default:
        return 'Biometric Authentication';
    }
  },
};
