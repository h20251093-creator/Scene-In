import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'surface' | 'high' | 'elevated';
  onPress?: () => void;
  activeOpacity?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'surface',
  onPress,
  activeOpacity = 0.85,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'high':
        return colors.surfaceHigh;
      case 'elevated':
        return colors.surfaceElevated;
      default:
        return colors.surface;
    }
  };

  const cardStyle = [
    styles.card,
    { backgroundColor: getBackgroundColor() },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={activeOpacity}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.card, // 16px per spec
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    overflow: 'hidden',
  },
});
