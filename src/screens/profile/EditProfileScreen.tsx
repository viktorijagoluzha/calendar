import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../store/slices/authSlice';
import { Header, InputField, Button } from '../../components/common';
import { UserAvatar } from '../../components/profile';
import { t } from '../../i18n';
import { theme } from '../../theme';

const EditProfileScreen = ({ navigation }: any) => {
  const { user, dispatch } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert(t('common.error'), t('errors.enterFullName'));
      return;
    }

    if (!email.trim()) {
      Alert.alert(t('common.error'), t('errors.enterEmail'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common.error'), t('errors.invalidEmail'));
      return;
    }

    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        Alert.alert(t('common.error'), t('errors.enterCurrentPassword'));
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert(t('common.error'), t('errors.passwordsNotMatch'));
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert(t('common.error'), t('errors.passwordMinLength'));
        return;
      }
    }

    try {
      setLoading(true);
      await dispatch(
        updateProfile({
          fullName,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      ).unwrap();

      Alert.alert(t('common.success'), t('success.profileUpdated'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error.message || 'Failed to update profile',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      <Header
        title={t('profile.editProfile')}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <UserAvatar name={fullName || 'U'} size={100} />
          <TouchableOpacity>
            <Text style={styles.changePhoto}>{t('profile.changePhoto')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('profile.personalInformation')}
          </Text>

          <InputField
            label={t('auth.fullName')}
            value={fullName}
            onChangeText={setFullName}
            placeholder={t('auth.enterFullName')}
          />

          <InputField
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.enterEmail')}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.changePassword')}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.currentPassword')}</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t('auth.enterCurrentPassword')}
                placeholderTextColor={theme.colors.text.tertiary}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showCurrentPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.newPassword')}</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t('auth.enterNewPassword')}
                placeholderTextColor={theme.colors.text.tertiary}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showNewPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.confirmNewPassword')}</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t('auth.confirmNewPassword')}
                placeholderTextColor={theme.colors.text.tertiary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t('profile.saveChanges')}
            onPress={handleSave}
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  changePhoto: {
    ...theme.typography.body2,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: theme.spacing.sm,
  },
  section: {
    backgroundColor: theme.colors.background,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.body1,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    ...theme.typography.body1,
    color: theme.colors.text.primary,
  },
  eyeIcon: {
    padding: theme.spacing.sm,
  },
  buttonContainer: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
});

export default EditProfileScreen;
