import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Button } from '../Button';

interface PermissionFallbackViewProps {
  onRequestPermission: () => void;
  onUseDemoLocation: () => void;
}

export const PermissionFallbackView: React.FC<PermissionFallbackViewProps> = ({
  onRequestPermission,
  onUseDemoLocation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="location-outline" size={44} color={colors.accent} />
      </View>
      <Text style={styles.title}>{ko.map.permissionDeniedTitle}</Text>
      <Text style={styles.description}>{ko.map.permissionDeniedDesc}</Text>

      <View style={styles.buttonStack}>
        <Button
          title={ko.map.openSettings}
          onPress={onRequestPermission}
          variant="primary"
          size="md"
          icon={<Ionicons name="settings-outline" size={16} color={colors.textInverse} />}
        />
        <Button
          title="체험용 시뮬레이션 위치로 보기 (서울 남산)"
          onPress={onUseDemoLocation}
          variant="secondary"
          size="md"
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  buttonStack: {
    width: '100%',
    maxWidth: 320,
  },
});
