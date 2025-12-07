// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
}));

// Mock react-native-biometrics
jest.mock('react-native-biometrics', () => ({
  BiometryTypes: {
    TouchID: 'TouchID',
    FaceID: 'FaceID',
    Biometrics: 'Biometrics',
  },
  default: jest.fn(() => ({
    isSensorAvailable: jest.fn(() =>
      Promise.resolve({ available: true, biometryType: 'FaceID' }),
    ),
    simplePrompt: jest.fn(() => Promise.resolve({ success: true })),
  })),
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
  };
});

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
};
