import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Scene } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Button } from '../Button';
import { Card } from '../Card';

interface SceneDetailCardProps {
  scene: Scene;
  onSaveScene: (scene: Scene) => void;
  onViewLocationOnMap: (locationId: string) => void;
  onReportError: () => void;
  onSaveOst: (scene: Scene) => void;
}

export const SceneDetailCard: React.FC<SceneDetailCardProps> = ({
  scene,
  onSaveScene,
  onViewLocationOnMap,
  onReportError,
  onSaveOst,
}) => {
  const handleOpenLink = (url?: string, fallbackNotice = '링크로 이동합니다') => {
    if (url) {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <View style={styles.container}>
      {/* Hero Scene Still */}
      <View style={styles.heroWrapper}>
        <Image source={{ uri: scene.stillUrl }} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay}>
          <View style={styles.timeTag}>
            <Ionicons name="time-outline" size={12} color={colors.accent} />
            <Text style={styles.timeTagText}>{scene.timeFormatted}</Text>
          </View>
          {scene.emotionTag ? (
            <View style={styles.emotionTag}>
              <Text style={styles.emotionTagText}>#{scene.emotionTag}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Scene Title & Dialogue */}
      <View style={styles.titleSection}>
        <Text style={styles.sceneTitle}>{scene.title}</Text>
        {scene.quote ? (
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>{scene.quote}</Text>
          </View>
        ) : null}
        <Text style={styles.descriptionText}>{scene.description}</Text>
      </View>

      {/* Main Action Buttons */}
      <View style={styles.actionRow}>
        <View style={styles.actionCol}>
          <Button
            title={ko.sceneInfo.saveToArchive}
            onPress={() => onSaveScene(scene)}
            variant="primary"
            size="md"
            icon={<Ionicons name="bookmark" size={18} color={colors.textInverse} />}
          />
        </View>
        <TouchableOpacity
          style={styles.reportIconButton}
          onPress={onReportError}
          activeOpacity={0.7}
        >
          <Ionicons name="alert-circle-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.reportIconText}>{ko.sceneInfo.reportError}</Text>
        </TouchableOpacity>
      </View>

      {/* 1. Cast / Actors Section */}
      {scene.actors && scene.actors.length > 0 && (
        <Card style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="people-outline" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>{ko.sceneInfo.actors}</Text>
          </View>
          <View style={styles.actorsRow}>
            {scene.actors.map((actor) => (
              <View key={actor.id} style={styles.actorItem}>
                {actor.avatarUrl ? (
                  <Image source={{ uri: actor.avatarUrl }} style={styles.actorAvatar} />
                ) : (
                  <View style={styles.actorAvatarPlaceholder}>
                    <Ionicons name="person" size={18} color={colors.textSecondary} />
                  </View>
                )}
                <Text style={styles.actorName}>{actor.name}</Text>
                <Text style={styles.actorRole}>{actor.character}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* 2. OST Section */}
      {scene.ost && (
        <Card style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="musical-notes-outline" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>{ko.sceneInfo.ost}</Text>
          </View>
          <View style={styles.ostRow}>
            <View style={styles.ostIconBox}>
              <Ionicons name="disc-outline" size={26} color={colors.accent} />
            </View>
            <View style={styles.ostTextContainer}>
              <Text style={styles.ostTitle}>{scene.ost.title}</Text>
              <Text style={styles.ostArtist}>{scene.ost.artist}</Text>
            </View>
          </View>
          <View style={styles.ostActions}>
            <TouchableOpacity
              style={styles.ostActionBtn}
              onPress={() => handleOpenLink(scene.ost?.externalMusicUrl)}
            >
              <Ionicons name="play-circle-outline" size={16} color={colors.secondaryAccent} />
              <Text style={[styles.ostActionText, { color: colors.secondaryAccent }]}>
                {ko.sceneInfo.listenOst}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ostActionBtn}
              onPress={() => onSaveOst(scene)}
            >
              <Ionicons name="bookmark-outline" size={16} color={colors.accent} />
              <Text style={styles.ostActionText}>서랍에 OST 보관</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* 3. Costumes & Props Section */}
      {scene.items && scene.items.length > 0 && (
        <Card style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="shirt-outline" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>{ko.sceneInfo.costumeAndProps}</Text>
          </View>
          <View style={styles.itemsList}>
            {scene.items.map((item) => (
              <View key={item.id} style={styles.propItemRow}>
                <View style={styles.propMeta}>
                  <View style={styles.propCategoryBadge}>
                    <Text style={styles.propCategoryText}>{item.category}</Text>
                  </View>
                  <View style={styles.propTextCol}>
                    <Text style={styles.propName}>{item.name}</Text>
                    <Text style={styles.propBrand}>브랜드: {item.brand}</Text>
                  </View>
                </View>
                {item.buyUrl ? (
                  <TouchableOpacity
                    style={styles.buyBtn}
                    onPress={() => handleOpenLink(item.buyUrl)}
                  >
                    <Text style={styles.buyBtnText}>{ko.sceneInfo.buyProduct}</Text>
                    <Ionicons name="open-outline" size={12} color={colors.accent} />
                  </TouchableOpacity>
                ) : null}
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* 4. Filming Location Section */}
      {scene.filmingLocationId && (
        <Card style={styles.infoCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="location-outline" size={18} color={colors.accent} />
            <Text style={styles.cardTitle}>{ko.sceneInfo.location}</Text>
          </View>
          <View style={styles.locationContainer}>
            <Text style={styles.locationName}>{scene.filmingLocationName}</Text>
            <TouchableOpacity
              style={styles.viewMapButton}
              onPress={() => onViewLocationOnMap(scene.filmingLocationId!)}
              activeOpacity={0.8}
            >
              <Ionicons name="map" size={16} color={colors.textInverse} />
              <Text style={styles.viewMapButtonText}>{ko.sceneInfo.viewOnMap}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxl,
  },
  heroWrapper: {
    width: '100%',
    height: 220,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeTag: {
    backgroundColor: 'rgba(12, 18, 36, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.chip,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  emotionTag: {
    backgroundColor: 'rgba(245, 196, 81, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.chip,
  },
  emotionTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  titleSection: {
    marginTop: spacing.base,
  },
  sceneTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  quoteBox: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingLeft: spacing.md,
    marginVertical: spacing.sm,
  },
  quoteText: {
    ...typography.subtitle1,
    color: colors.accent,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  descriptionText: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.base,
    marginBottom: spacing.lg,
  },
  actionCol: {
    flex: 1,
  },
  reportIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  reportIconText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  actorsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  actorItem: {
    alignItems: 'center',
  },
  actorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: spacing.xs,
  },
  actorAvatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actorName: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  actorRole: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  ostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ostIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ostTextContainer: {
    flex: 1,
  },
  ostTitle: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  ostArtist: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ostActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ostActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ostActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  itemsList: {
    gap: spacing.sm,
  },
  propItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceHigh,
    padding: spacing.sm,
    borderRadius: borderRadius.button,
  },
  propMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  propCategoryBadge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  propCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
  },
  propTextCol: {
    flex: 1,
  },
  propName: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  propBrand: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 196, 81, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.button,
    gap: 4,
  },
  buyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationName: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    flex: 1,
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.button,
    gap: 6,
  },
  viewMapButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textInverse,
  },
});
