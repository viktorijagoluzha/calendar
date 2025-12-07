import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { t } from '../../i18n';
import { theme } from '../../theme';

interface AuthContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  scrollable?: boolean;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  title,
  subtitle,
  scrollable = false,
}) => {
  const content = (
    <View style={styles.content}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>{t('common.appName')}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {scrollable ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.huge,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.massive,
  },
  logoText: {
    ...theme.typography.body1,
    fontWeight: '500',
  },
  title: {
    ...theme.typography.h2,
  },
  subtitle: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.huge,
  },
});
