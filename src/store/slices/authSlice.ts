import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { biometricService } from '../../services/biometricService';
import { AuthState, User } from '../../types/User';
import type { RootState } from '../index';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  biometricsEnabled: false,
};

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({
    fullName,
    email,
    password,
  }: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    const user = await authService.signUp(fullName, email, password);
    return user;
  },
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    const user = await authService.signIn(email, password);
    return user;
  },
);

export const signInWithBiometrics = createAsyncThunk(
  'auth/signInWithBiometrics',
  async () => {
    const authenticated = await biometricService.authenticate();
    if (!authenticated) {
      throw new Error('Biometric authentication failed');
    }
    const user = await authService.signInWithBiometrics();
    if (!user) {
      throw new Error('No user found');
    }
    return user;
  },
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await authService.signOut();
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const user = await authService.getCurrentUser();
  const biometricsEnabled = await authService.isBiometricsEnabled();
  return { user, biometricsEnabled };
});

export const toggleBiometrics = createAsyncThunk(
  'auth/toggleBiometrics',
  async (enabled: boolean) => {
    await authService.enableBiometrics(enabled);
    return enabled;
  },
);

export const updateProfile = createAsyncThunk<
  User,
  {
    fullName: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
  },
  { state: RootState }
>(
  'auth/updateProfile',
  async ({ fullName, email, currentPassword, newPassword }, { getState }) => {
    const state = getState();
    const currentEmail = state.auth.user?.email;

    if (!currentEmail) {
      throw new Error('No user logged in');
    }

    const user = await authService.updateProfile(currentEmail, {
      fullName,
      email,
      currentPassword,
      newPassword,
    });
    return user;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.isLoading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signUp.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(
        signInWithBiometrics.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.isAuthenticated = true;
        },
      )
      .addCase(signOut.fulfilled, state => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(
        checkAuth.fulfilled,
        (
          state,
          action: PayloadAction<{
            user: User | null;
            biometricsEnabled: boolean;
          }>,
        ) => {
          state.user = action.payload.user;
          state.isAuthenticated = !!action.payload.user;
          state.biometricsEnabled = action.payload.biometricsEnabled;
        },
      )
      .addCase(
        toggleBiometrics.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.biometricsEnabled = action.payload;
        },
      )
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
        },
      )
      .addMatcher(
        action =>
          action.type.endsWith('/pending') && action.type.startsWith('auth/'),
        state => {
          state.isLoading = true;
        },
      )
      .addMatcher(
        action =>
          (action.type.endsWith('/fulfilled') ||
            action.type.endsWith('/rejected')) &&
          action.type.startsWith('auth/'),
        state => {
          state.isLoading = false;
        },
      );
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
