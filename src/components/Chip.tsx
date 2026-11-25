import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, spacing, borderRadius, typography, layout } from '@/src/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  count?: number;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  count,
  icon,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
    >
      {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
      <Text
        style={[
          styles.label,
          selected ? styles.labelSelected : styles.labelUnselected,
        ]}
      >
        {label}
      </Text>
      {count !== undefined ? (
        <View
          style={[
            styles.countBadge,
            selected ? styles.countBadgeSelected : styles.countBadgeUnselected,
          ]}
        >
          <Text
            style={[
              styles.countText,
              selected ? styles.countTextSelected : styles.countTextUnselected,
            ]}
          >
            {count}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.chip,
    minHeight: layout.minTouchTarget,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  label: {
    ...typography.subtitle2,
    fontSize: 13,
  },
  labelSelected: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  labelUnselected: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  countBadge: {
    marginLeft: spacing.xs,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(12, 18, 36, 0.25)',
  },
  countBadgeUnselected: {
    backgroundColor: colors.surfaceHigh,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
  countTextSelected: {
    color: colors.textInverse,
  },
  countTextUnselected: {
    color: colors.textSecondary,
  },
});
