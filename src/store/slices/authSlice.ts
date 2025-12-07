import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { biometricService } from '../../services/biometricService';
import { AuthState, User } from '../../types/User';

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

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    {
      fullName,
      email,
      currentPassword,
      newPassword,
    }: {
      fullName: string;
      email: string;
      currentPassword?: string;
      newPassword?: string;
    },
    { getState },
  ) => {
    const state = getState() as any;
    const currentEmail = state.auth.user.email;

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
      .addCase(signUp.pending, state => {
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, state => {
        state.isLoading = false;
      });

    builder
      .addCase(signIn.pending, state => {
        state.isLoading = true;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, state => {
        state.isLoading = false;
      });

    builder
      .addCase(signInWithBiometrics.pending, state => {
        state.isLoading = true;
      })
      .addCase(
        signInWithBiometrics.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isAuthenticated = true;
        },
      )
      .addCase(signInWithBiometrics.rejected, state => {
        state.isLoading = false;
      });

    builder
      .addCase(signOut.pending, state => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(signOut.rejected, state => {
        state.isLoading = false;
      });

    builder
      .addCase(checkAuth.pending, state => {
        state.isLoading = true;
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
          state.isLoading = false;
          state.user = action.payload.user;
          state.isAuthenticated = !!action.payload.user;
          state.biometricsEnabled = action.payload.biometricsEnabled;
        },
      )
      .addCase(checkAuth.rejected, state => {
        state.isLoading = false;
      });

    builder.addCase(
      toggleBiometrics.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        state.biometricsEnabled = action.payload;
      },
    );

    builder
      .addCase(updateProfile.pending, state => {
        state.isLoading = true;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.user = action.payload;
        },
      )
      .addCase(updateProfile.rejected, state => {
        state.isLoading = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
