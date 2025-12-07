import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { signOut, toggleBiometrics } from '../../store/slices/authSlice';
import { biometricService } from '../../services/biometricService';
import { UserAvatar, MenuItem } from '../../components/profile';
import { t } from '../../i18n';
import { theme } from '../../theme';

const ProfileScreen = ({ navigation }: any) => {
  const { user, biometricsEnabled, dispatch } = useAuth();

  const handleSignOut = () => {
    Alert.alert(t('confirmations.signOut'), t('confirmations.signOutMessage'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('confirmations.signOut'),
        style: 'destructive',
        onPress: () => {
          dispatch(signOut());
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
    dispatch(toggleBiometrics(value));
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
          <UserAvatar name={user?.fullName || 'U'} size={80} />
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.menuSection}>
          <MenuItem
            icon="create-outline"
            label={t('profile.editProfile')}
            onPress={() => navigation.navigate('EditProfile')}
          />

          <MenuItem
            icon="finger-print-outline"
            label={t('profile.biometricLogin')}
            showChevron={false}
            showSwitch={true}
            switchValue={biometricsEnabled}
            onSwitchChange={handleToggleBiometrics}
          />

          <MenuItem
            icon="log-out-outline"
            label={t('profile.logout')}
            onPress={handleSignOut}
          />
        </View>
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
});

export default ProfileScreen;
