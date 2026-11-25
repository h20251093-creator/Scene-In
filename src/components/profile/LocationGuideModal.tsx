import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Button } from '../Button';

interface LocationGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LocationGuideModal: React.FC<LocationGuideModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{ko.profile.locationPermission}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="navigate-circle" size={54} color={colors.accent} />
          </View>

          <Text style={styles.title}>촬영지 인증 및 위치 기반 서비스</Text>

          <View style={styles.guideCard}>
            <View style={styles.guideItem}>
              <Ionicons name="radio-outline" size={20} color={colors.accent} />
              <View style={styles.guideTextCol}>
                <Text style={styles.guideHeading}>100m 반경 성지순례 인증</Text>
                <Text style={styles.guideBody}>
                  SCENE-IN은 촬영지 명장면을 실제로 찾아간 팬분들의 경험을 기록하기 위해, 촬영지 좌표 반경 100m 이내에 도달했을 때 디지털 스탬프를 발급합니다.
                </Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
              <View style={styles.guideTextCol}>
                <Text style={styles.guideHeading}>위치 정보 보호</Text>
                <Text style={styles.guideBody}>
                  이용자의 현재 위치 정보는 오직 촬영지와의 거리 계산 및 방문 인증을 위해서만 일시적으로 사용되며, 서버에 기록되거나 보관되지 않습니다.
                </Text>
              </View>
            </View>

            <View style={styles.guideItem}>
              <Ionicons name="map-outline" size={20} color={colors.secondaryAccent} />
              <View style={styles.guideTextCol}>
                <Text style={styles.guideHeading}>위치 권한 거부 시</Text>
                <Text style={styles.guideBody}>
                  위치 권한을 거부하셔도 촬영지 정보 조회, 지도 탐색, 명장면 서랍 등 모든 기본 기능은 자유롭게 이용하실 수 있습니다.
                </Text>
              </View>
            </View>
          </View>

          <Button
            title="확인했습니다"
            onPress={onClose}
            variant="primary"
            size="lg"
            style={{ marginTop: spacing.xl }}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.base,
    alignItems: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  guideCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.lg,
  },
  guideItem: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  guideTextCol: {
    flex: 1,
  },
  guideHeading: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  guideBody: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
