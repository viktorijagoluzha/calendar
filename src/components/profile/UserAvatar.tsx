import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface UserAvatarProps {
  name: string;
  size?: keyof typeof theme.avatarSizes | number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  size = 'large',
}) => {
  const avatarSize = useMemo(
    () =>
      typeof size === 'number'
        ? size
        : theme.avatarSizes[size] || theme.avatarSizes.large,
    [size],
  );

  const initial = useMemo(
    () => (name ? name.charAt(0).toUpperCase() : '?'),
    [name],
  );

  const dynamicStyles = useMemo(
    () => ({
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      fontSize: avatarSize * 0.4,
    }),
    [avatarSize],
  );

  return (
    <View
      style={[
        styles.avatar,
        {
          width: dynamicStyles.width,
          height: dynamicStyles.height,
          borderRadius: dynamicStyles.borderRadius,
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: dynamicStyles.fontSize }]}>
        {initial}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: '600',
    color: theme.colors.text.inverse,
  },
});
