import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';

const STORAGE_KEYS = {
  USER: '@calendar_user',
  LAST_USER: '@calendar_last_user',
  CREDENTIALS: '@calendar_credentials',
  BIOMETRICS_ENABLED: '@calendar_biometrics',
};

export interface Credentials {
  email: string;
  password: string;
}

export const authService = {
  async signUp(
    fullName: string,
    email: string,
    password: string,
  ): Promise<User> {
    try {
      const existingUsers = await this.getAllUsers();
      const userExists = existingUsers.find(u => u.email === email);

      if (userExists) {
        throw new Error('User with this email already exists');
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        fullName,
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        `${STORAGE_KEYS.USER}_${email}`,
        JSON.stringify(newUser),
      );

      const credentials: Credentials = { email, password };
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.CREDENTIALS}_${email}`,
        JSON.stringify(credentials),
      );

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_USER,
        JSON.stringify(newUser),
      );

      await this.enableBiometrics(true);

      return newUser;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    try {
      const storedCredentials = await AsyncStorage.getItem(
        `${STORAGE_KEYS.CREDENTIALS}_${email}`,
      );

      if (!storedCredentials) {
        throw new Error('User not found');
      }

      const credentials: Credentials = JSON.parse(storedCredentials);

      if (credentials.password !== password) {
        throw new Error('Invalid password');
      }

      const userData = await AsyncStorage.getItem(
        `${STORAGE_KEYS.USER}_${email}`,
      );

      if (!userData) {
        throw new Error('User data not found');
      }

      const user: User = JSON.parse(userData);

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      await AsyncStorage.setItem(STORAGE_KEYS.LAST_USER, JSON.stringify(user));

      await this.enableBiometrics(true);

      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  async signInWithBiometrics(): Promise<User | null> {
    try {
      const lastUserData = await AsyncStorage.getItem(STORAGE_KEYS.LAST_USER);

      if (!lastUserData) {
        return null;
      }

      const user = JSON.parse(lastUserData);

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Biometric sign in error:', error);
      return null;
    }
  },

  async signOut(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async enableBiometrics(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.BIOMETRICS_ENABLED,
        JSON.stringify(enabled),
      );
    } catch (error) {
      console.error('Enable biometrics error:', error);
      throw error;
    }
  },

  async isBiometricsEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(
        STORAGE_KEYS.BIOMETRICS_ENABLED,
      );
      return enabled ? JSON.parse(enabled) : false;
    } catch (error) {
      console.error('Check biometrics error:', error);
      return false;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const userKeys = keys.filter(key =>
        key.startsWith(`${STORAGE_KEYS.USER}_`),
      );
      const users = await AsyncStorage.multiGet(userKeys);
      return users.map(([_, value]) => JSON.parse(value!));
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  },

  async updateProfile(
    currentEmail: string,
    updates: {
      fullName?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    },
  ): Promise<User> {
    try {
      const userData = await AsyncStorage.getItem(
        `${STORAGE_KEYS.USER}_${currentEmail}`,
      );

      if (!userData) {
        throw new Error('User not found');
      }

      const user: User = JSON.parse(userData);

      if (updates.currentPassword && updates.newPassword) {
        const storedCredentials = await AsyncStorage.getItem(
          `${STORAGE_KEYS.CREDENTIALS}_${currentEmail}`,
        );

        if (!storedCredentials) {
          throw new Error('Credentials not found');
        }

        const credentials: Credentials = JSON.parse(storedCredentials);

        if (credentials.password !== updates.currentPassword) {
          throw new Error('Current password is incorrect');
        }

        const newCredentials: Credentials = {
          email: updates.email || currentEmail,
          password: updates.newPassword,
        };

        await AsyncStorage.setItem(
          `${STORAGE_KEYS.CREDENTIALS}_${currentEmail}`,
          JSON.stringify(newCredentials),
        );

        if (updates.email && updates.email !== currentEmail) {
          await AsyncStorage.setItem(
            `${STORAGE_KEYS.CREDENTIALS}_${updates.email}`,
            JSON.stringify(newCredentials),
          );
          await AsyncStorage.removeItem(
            `${STORAGE_KEYS.CREDENTIALS}_${currentEmail}`,
          );
        }
      }

      const updatedUser: User = {
        ...user,
        fullName: updates.fullName || user.fullName,
        email: updates.email || user.email,
      };

      if (updates.email && updates.email !== currentEmail) {
        await AsyncStorage.setItem(
          `${STORAGE_KEYS.USER}_${updates.email}`,
          JSON.stringify(updatedUser),
        );
        await AsyncStorage.removeItem(`${STORAGE_KEYS.USER}_${currentEmail}`);
      } else {
        await AsyncStorage.setItem(
          `${STORAGE_KEYS.USER}_${currentEmail}`,
          JSON.stringify(updatedUser),
        );
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(updatedUser),
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_USER,
        JSON.stringify(updatedUser),
      );

      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};
