import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Scene } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';

interface RecommendedScenesListProps {
  scenes: Scene[];
  onSelectScene: (scene: Scene) => void;
}

export const RecommendedScenesList: React.FC<RecommendedScenesListProps> = ({
  scenes,
  onSelectScene,
}) => {
  if (!scenes || scenes.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="sparkles" size={18} color={colors.accent} />
        <Text style={styles.sectionTitle}>{ko.sceneInfo.recommendedScenes}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {scenes.map((scene) => (
          <TouchableOpacity
            key={scene.id}
            style={styles.card}
            onPress={() => onSelectScene(scene)}
            activeOpacity={0.8}
          >
            <View style={styles.thumbnailWrapper}>
              <Image source={{ uri: scene.stillUrl }} style={styles.thumbnail} />
              <View style={styles.timeBadge}>
                <Text style={styles.timeBadgeText}>{scene.timeFormatted}</Text>
              </View>
            </View>
            <Text style={styles.sceneTitle} numberOfLines={1}>
              {scene.title}
            </Text>
            <Text style={styles.workTitle} numberOfLines={1}>
              {scene.workTitle}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  card: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumbnailWrapper: {
    width: '100%',
    height: 100,
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surfaceHigh,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  timeBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(12, 18, 36, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  timeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.accent,
  },
  sceneTitle: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  workTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
