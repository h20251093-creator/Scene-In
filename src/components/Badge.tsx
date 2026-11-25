import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, typography } from '@/src/theme';
import { EventType } from '../types';
import { ko } from '../i18n/ko';

interface BadgeProps {
  label?: string;
  type?: EventType;
  variant?: 'accent' | 'success' | 'warning' | 'error' | 'neutral' | 'event';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  type,
  variant = 'neutral',
  style,
}) => {
  const getEventBadgeDetails = () => {
    switch (type) {
      case 'festival':
        return { text: ko.categories.festival, bg: 'rgba(249, 248, 113, 0.2)', color: '#F9F871' };
      case 'gv':
        return { text: ko.categories.gv, bg: 'rgba(255, 150, 113, 0.2)', color: '#FF9671' };
      case 'stageGreeting':
        return { text: ko.categories.stageGreeting, bg: 'rgba(255, 199, 95, 0.2)', color: '#FFC75F' };
      case 'premiere':
        return { text: ko.categories.premiere, bg: 'rgba(255, 107, 139, 0.2)', color: '#FF6B8B' };
      case 'actorVisit':
        return { text: ko.categories.actorVisit, bg: 'rgba(132, 94, 194, 0.25)', color: '#D5C4FF' };
      case 'ottRelease':
        return { text: ko.categories.ottRelease, bg: 'rgba(108, 140, 255, 0.25)', color: colors.secondaryAccent };
      case 'popUp':
        return { text: ko.categories.popUp, bg: 'rgba(44, 115, 210, 0.25)', color: '#4EA8DE' };
      default:
        return { text: label || '', bg: colors.surfaceHigh, color: colors.textSecondary };
    }
  };

  if (type) {
    const details = getEventBadgeDetails();
    return (
      <View style={[styles.badge, { backgroundColor: details.bg }, style]}>
        <Text style={[styles.text, { color: details.color }]}>{details.text}</Text>
      </View>
    );
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'accent':
        return { bg: colors.accentSubtle, text: colors.accent };
      case 'success':
        return { bg: colors.successSubtle, text: colors.success };
      case 'warning':
        return { bg: colors.warningSubtle, text: colors.warning };
      case 'error':
        return { bg: colors.errorSubtle, text: colors.error };
      default:
        return { bg: colors.surfaceHigh, text: colors.textSecondary };
    }
  };

  const v = getVariantStyles();

  return (
    <View style={[styles.badge, { backgroundColor: v.bg }, style]}>
      <Text style={[styles.text, { color: v.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.badge,
  },
});
