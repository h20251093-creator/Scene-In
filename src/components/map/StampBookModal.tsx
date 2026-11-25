import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stamp, WorkMission } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { EmptyState } from '../EmptyState';

interface StampBookModalProps {
  visible: boolean;
  onClose: () => void;
  stamps: Stamp[];
  missions: WorkMission[];
}

export const StampBookModal: React.FC<StampBookModalProps> = ({
  visible,
  onClose,
  stamps,
  missions,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{ko.stampBook.title}</Text>
          <View style={styles.stampCountBadge}>
            <Ionicons name="ribbon" size={14} color={colors.accent} />
            <Text style={styles.stampCountText}>{stamps.length}개</Text>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Work Missions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="trophy-outline" size={18} color={colors.accent} />
              <Text style={styles.sectionTitle}>{ko.stampBook.missionsTitle}</Text>
            </View>

            <View style={styles.missionsList}>
              {missions.map((mission) => {
                const isComplete = mission.completedCount >= mission.targetCount;
                const progressPercent = Math.min(
                  100,
                  Math.round((mission.completedCount / mission.targetCount) * 100)
                );

                return (
                  <View key={mission.id} style={styles.missionCard}>
                    <View style={styles.missionTopRow}>
                      <View style={styles.missionBadgeCircle}>
                        <Ionicons
                          name={isComplete ? 'checkmark-circle' : 'flag-outline'}
                          size={18}
                          color={isComplete ? colors.success : colors.accent}
                        />
                      </View>
                      <View style={styles.missionTitleWrapper}>
                        <Text style={styles.missionWorkTitle}>{mission.workTitle}</Text>
                        <Text style={styles.missionTitle}>{mission.title}</Text>
                      </View>
                      <Text
                        style={[
                          styles.missionCountText,
                          isComplete && { color: colors.success },
                        ]}
                      >
                        {mission.completedCount}/{mission.targetCount}
                      </Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${progressPercent}%`,
                            backgroundColor: isComplete
                              ? colors.success
                              : colors.accent,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Earned Digital Stamps Grid */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.accent} />
              <Text style={styles.sectionTitle}>{ko.stampBook.recentStamps}</Text>
            </View>

            {stamps.length === 0 ? (
              <EmptyState
                iconName="ribbon-outline"
                description={ko.stampBook.emptyStamps}
              />
            ) : (
              <View style={styles.stampsGrid}>
                {stamps.map((stamp) => (
                  <View key={stamp.id} style={styles.stampItemCard}>
                    <View style={styles.stampImgWrapper}>
                      {stamp.photoUri ? (
                        <Image source={{ uri: stamp.photoUri }} style={styles.stampImg} />
                      ) : (
                        <View style={styles.stampImgPlaceholder}>
                          <Ionicons name="film" size={24} color={colors.accent} />
                        </View>
                      )}
                      <View style={styles.stampSeal}>
                        <Ionicons name="ribbon" size={14} color={colors.accent} />
                      </View>
                    </View>
                    <Text style={styles.stampItemWork}>{stamp.workTitle}</Text>
                    <Text style={styles.stampItemLocation} numberOfLines={1}>
                      {stamp.locationName}
                    </Text>
                    <Text style={styles.stampItemDate}>{stamp.earnedAt}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
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
    paddingVertical: spacing.md,
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
  stampCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.chip,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stampCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  missionsList: {
    gap: spacing.sm,
  },
  missionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  missionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  missionBadgeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  missionTitleWrapper: {
    flex: 1,
  },
  missionWorkTitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  missionTitle: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    marginTop: 2,
  },
  missionCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceHigh,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  stampsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  stampItemCard: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stampImgWrapper: {
    width: '100%',
    height: 110,
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surfaceHigh,
  },
  stampImg: {
    width: '100%',
    height: '100%',
  },
  stampImgPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampSeal: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(12, 18, 36, 0.85)',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampItemWork: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  stampItemLocation: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    marginTop: 2,
  },
  stampItemDate: {
    fontSize: 10,
    color: colors.textDisabled,
    marginTop: 2,
  },
});
