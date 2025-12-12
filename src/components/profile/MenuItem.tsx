import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../../theme';

interface MenuItemProps {
  icon: string;
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  disabled?: boolean;
  testID?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onPress,
  showChevron = true,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  disabled = false,
  testID,
}) => {
  const iconColor = useMemo(
    () => (disabled ? theme.colors.text.tertiary : theme.colors.primary),
    [disabled],
  );

  const containerStyle = useMemo(
    () => [styles.menuItem, disabled && styles.menuItemDisabled],
    [disabled],
  );

  const labelStyle = useMemo(
    () => [styles.menuLabel, disabled && styles.menuLabelDisabled],
    [disabled],
  );

  const renderRightElement = useMemo(() => {
    if (showSwitch) {
      return (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          disabled={disabled}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary,
          }}
          thumbColor={theme.colors.background}
          testID={testID ? `${testID}-switch` : undefined}
        />
      );
    }
    if (showChevron) {
      return (
        <Icon
          name="chevron-forward"
          size={24}
          color={theme.colors.text.tertiary}
        />
      );
    }
    return null;
  }, [showSwitch, showChevron, switchValue, onSwitchChange, disabled, testID]);

  const content = (
    <>
      <View style={styles.menuItemLeft}>
        <Icon name={icon} size={24} color={iconColor} style={styles.menuIcon} />
        <Text style={labelStyle}>{label}</Text>
      </View>
      {renderRightElement}
    </>
  );

  if (showSwitch || !onPress) {
    return (
      <View style={containerStyle} testID={testID}>
        {content}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: theme.spacing.md,
  },
  menuLabel: {
    ...theme.typography.body1,
  },
  menuLabelDisabled: {
    color: theme.colors.text.tertiary,
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
});
