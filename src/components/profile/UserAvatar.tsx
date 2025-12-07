import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UserAvatarProps {
  name: string;
  size?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, size = 80 }) => {
  const initial = name.charAt(0).toUpperCase();
  const radius = size / 2;
  const fontSize = size * 0.4;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize }]}>{initial}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#4C7EFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: '600',
    color: '#fff',
  },
});
