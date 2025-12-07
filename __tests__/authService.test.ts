import { authService } from '../src/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([]);
      (AsyncStorage.multiGet as jest.Mock).mockResolvedValue([]);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const user = await authService.signUp(
        'John Doe',
        'john@example.com',
        'password123',
      );

      expect(user.fullName).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      const existingUser = {
        id: '1',
        email: 'john@example.com',
        fullName: 'John Doe',
        createdAt: '2025-12-06T00:00:00.000Z',
      };

      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        '@calendar_user_john@example.com',
      ]);
      (AsyncStorage.multiGet as jest.Mock).mockResolvedValue([
        ['@calendar_user_john@example.com', JSON.stringify(existingUser)],
      ]);

      await expect(
        authService.signUp('John Doe', 'john@example.com', 'password123'),
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('signIn', () => {
    it('should sign in user with correct credentials', async () => {
      const storedUser = {
        id: '1',
        email: 'john@example.com',
        fullName: 'John Doe',
        createdAt: '2025-12-06T00:00:00.000Z',
      };

      const storedCreds = {
        email: 'john@example.com',
        password: 'password123',
      };

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(storedCreds))
        .mockResolvedValueOnce(JSON.stringify(storedUser));

      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const user = await authService.signIn('john@example.com', 'password123');

      expect(user.email).toBe('john@example.com');
      expect(user.fullName).toBe('John Doe');
    });

    it('should throw error with invalid password', async () => {
      const storedCreds = {
        email: 'john@example.com',
        password: 'password123',
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(storedCreds),
      );

      await expect(
        authService.signIn('john@example.com', 'wrongpassword'),
      ).rejects.toThrow('Invalid password');
    });

    it('should throw error when user not found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.signIn('notfound@example.com', 'password123'),
      ).rejects.toThrow('User not found');
    });
  });

  describe('signOut', () => {
    it('should remove current user from storage', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await authService.signOut();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@calendar_user');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user if exists', async () => {
      const user = {
        id: '1',
        email: 'john@example.com',
        fullName: 'John Doe',
        createdAt: '2025-12-06T00:00:00.000Z',
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(user),
      );

      const currentUser = await authService.getCurrentUser();

      expect(currentUser).toEqual(user);
    });

    it('should return null if no current user', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const currentUser = await authService.getCurrentUser();

      expect(currentUser).toBeNull();
    });
  });
});
