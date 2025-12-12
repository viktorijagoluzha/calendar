import React, { ReactNode, useMemo } from 'react';
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
  testID?: string;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  title,
  subtitle,
  scrollable = false,
  testID,
}) => {
  const keyboardBehavior = useMemo(
    () => (Platform.OS === 'ios' ? 'padding' : 'height'),
    [],
  );

  const appName = useMemo(() => t('common.appName'), []);

  const content = useMemo(
    () => (
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text
            style={styles.logoText}
            accessibilityRole="header"
            accessibilityLabel={appName}
          >
            {appName}
          </Text>
        </View>

        <Text
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel={title}
        >
          {title}
        </Text>
        <Text style={styles.subtitle} accessibilityLabel={subtitle}>
          {subtitle}
        </Text>

        {children}
      </View>
    ),
    [children, title, subtitle, appName],
  );

  return (
    <SafeAreaView style={styles.container} testID={testID}>
      <KeyboardAvoidingView
        behavior={keyboardBehavior}
        style={styles.keyboardView}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
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
    color: theme.colors.text.primary,
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
