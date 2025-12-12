import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { signOut, toggleBiometrics } from '../../store/slices/authSlice';
import { biometricService } from '../../services/biometricService';
import { UserAvatar, MenuItem } from '../../components/profile';
import { t } from '../../i18n';
import { theme } from '../../theme';

const ProfileScreen = ({ navigation }: any) => {
  const { user, biometricsEnabled, dispatch } = useAuth();
  const { loading: signingOut, execute } = useAsyncAction();
  const [togglingBiometric, setTogglingBiometric] = useState(false);

  const handleSignOut = () => {
    Alert.alert(t('confirmations.signOut'), t('confirmations.signOutMessage'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('confirmations.signOut'),
        style: 'destructive',
        onPress: async () => {
          await execute(
            async () => {
              await dispatch(signOut()).unwrap();
            },
            {
              errorMessage: t('errors.signOutFailed'),
            },
          );
        },
      },
    ]);
  };

  const handleToggleBiometrics = async (value: boolean) => {
    if (value) {
      const { available } = await biometricService.isBiometricAvailable();
      if (!available) {
        Alert.alert(t('common.error'), t('errors.biometricNotAvailable'));
        return;
      }
    }

    try {
      setTogglingBiometric(true);
      await dispatch(toggleBiometrics(value)).unwrap();
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error.message || t('errors.biometricToggleFailed'),
      );
    } finally {
      setTogglingBiometric(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      <View style={styles.blueHeader}>
        <Text style={styles.headerTitle}>{t('profile.profile')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.userSection}>
          <UserAvatar
            name={user?.fullName || 'U'}
            size={theme.avatarSizes.large}
          />
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.menuSection}>
          <MenuItem
            icon="create-outline"
            label={t('profile.editProfile')}
            onPress={() => navigation.navigate('EditProfile')}
            disabled={signingOut || togglingBiometric}
          />

          <MenuItem
            icon="finger-print-outline"
            label={t('profile.biometricLogin')}
            showChevron={false}
            showSwitch={true}
            switchValue={biometricsEnabled}
            onSwitchChange={handleToggleBiometrics}
            disabled={signingOut || togglingBiometric}
          />

          <MenuItem
            icon="log-out-outline"
            label={t('profile.logout')}
            onPress={handleSignOut}
            disabled={signingOut || togglingBiometric}
          />
        </View>

        {(signingOut || togglingBiometric) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  blueHeader: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  headerTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.inverse,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  userSection: {
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingVertical: theme.spacing.huge,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userName: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.lg,
  },
  userEmail: {
    ...theme.typography.body2,
  },
  menuSection: {
    backgroundColor: theme.colors.background,
    marginTop: theme.spacing.md,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
  },
});

export default ProfileScreen;
