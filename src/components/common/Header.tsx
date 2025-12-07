import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../../theme';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  backgroundColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  rightIcon,
  onRightPress,
  backgroundColor = theme.colors.primary,
}) => {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <Text style={styles.headerTitle}>{title}</Text>

      {rightIcon && onRightPress ? (
        <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
          <Icon name={rightIcon} size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  backButton: {
    padding: theme.spacing.xs,
    width: theme.spacing.huge,
  },
  rightButton: {
    padding: theme.spacing.xs,
    width: theme.spacing.huge,
    alignItems: 'flex-end',
  },
  headerTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.inverse,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: theme.spacing.huge,
  },
});
