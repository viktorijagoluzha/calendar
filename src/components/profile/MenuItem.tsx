import React from 'react';
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
}) => {
  const content = (
    <>
      <View style={styles.menuItemLeft}>
        <Icon
          name={icon}
          size={24}
          color={disabled ? theme.colors.text.tertiary : theme.colors.primary}
          style={styles.menuIcon}
        />
        <Text style={[styles.menuLabel, disabled && styles.menuLabelDisabled]}>
          {label}
        </Text>
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          disabled={disabled}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary,
          }}
          thumbColor={theme.colors.background}
        />
      ) : showChevron ? (
        <Icon
          name="chevron-forward"
          size={24}
          color={theme.colors.text.tertiary}
        />
      ) : null}
    </>
  );

  if (showSwitch || !onPress) {
    return (
      <View style={[styles.menuItem, disabled && styles.menuItemDisabled]}>
        {content}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.menuItem, disabled && styles.menuItemDisabled]}
      onPress={onPress}
      disabled={disabled}
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
