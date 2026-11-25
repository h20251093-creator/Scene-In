import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';

interface ProfileHeaderProps {
  nickname: string;
  bio: string;
  avatarUrl: string;
  savedScenesCount: number;
  stampsCount: number;
  followingCount: number;
  onPressSavedScenes: () => void;
  onPressStamps: () => void;
  onPressFollowing: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  nickname,
  bio,
  avatarUrl,
  savedScenesCount,
  stampsCount,
  followingCount,
  onPressSavedScenes,
  onPressStamps,
  onPressFollowing,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View style={styles.vipBadge}>
            <Ionicons name="star" size={10} color={colors.textInverse} />
          </View>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.nickname}>{nickname}</Text>
          <Text style={styles.bio}>{bio}</Text>
        </View>
      </View>

      {/* 3 Stats Counters */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          style={styles.statBox}
          onPress={onPressSavedScenes}
          activeOpacity={0.7}
        >
          <Text style={styles.statCount}>{savedScenesCount}</Text>
          <Text style={styles.statLabel}>{ko.profile.savedScenesCount}</Text>
        </TouchableOpacity>

        <View style={styles.statDivider} />

        <TouchableOpacity
          style={styles.statBox}
          onPress={onPressStamps}
          activeOpacity={0.7}
        >
          <Text style={styles.statCount}>{stampsCount}</Text>
          <Text style={styles.statLabel}>{ko.profile.stampsCount}</Text>
        </TouchableOpacity>

        <View style={styles.statDivider} />

        <TouchableOpacity
          style={styles.statBox}
          onPress={onPressFollowing}
          activeOpacity={0.7}
        >
          <Text style={styles.statCount}>{followingCount}</Text>
          <Text style={styles.statLabel}>{ko.profile.followingCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  vipBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  infoCol: {
    flex: 1,
  },
  nickname: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  bio: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statCount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
});
