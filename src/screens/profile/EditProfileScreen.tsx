import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useFormValidation } from '../../hooks/useFormValidation';
import { updateProfile } from '../../store/slices/authSlice';
import { Header, InputField, Button } from '../../components/common';
import { PasswordInput } from '../../components/auth';
import { UserAvatar } from '../../components/profile';
import { t } from '../../i18n';
import { theme } from '../../theme';

const EditProfileScreen = ({ navigation }: any) => {
  const { user, dispatch } = useAuth();
  const { loading, execute } = useAsyncAction();
  const {
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validateRequiredField,
  } = useFormValidation();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async () => {
    if (!validateRequiredField(fullName, t('errors.enterFullName'))) return;
    if (!validateEmail(email)) return;

    if (newPassword || confirmPassword) {
      if (
        !validateRequiredField(
          currentPassword,
          t('errors.enterCurrentPassword'),
        )
      )
        return;
      if (!validatePasswordMatch(newPassword, confirmPassword)) return;
      if (!validatePassword(newPassword)) return;
    }

    await execute(
      async () => {
        await dispatch(
          updateProfile({
            fullName,
            email,
            currentPassword: currentPassword || undefined,
            newPassword: newPassword || undefined,
          }),
        ).unwrap();
      },
      {
        successMessage: t('success.profileUpdated'),
        errorMessage: t('errors.updateProfileFailed'),
        onSuccess: () => navigation.goBack(),
      },
    );
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
          <UserAvatar name={fullName || 'U'} size={theme.avatarSizes.xlarge} />
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
            <PasswordInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder={t('auth.enterCurrentPassword')}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.newPassword')}</Text>
            <PasswordInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder={t('auth.enterNewPassword')}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.confirmNewPassword')}</Text>
            <PasswordInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t('auth.confirmNewPasswordPlaceholder')}
            />
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
  buttonContainer: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
});

export default EditProfileScreen;
