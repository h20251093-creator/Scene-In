import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerCard } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { MOCK_WORKS } from '@/src/data/mockData';

interface DrawerCardItemProps {
  card: DrawerCard;
  onEdit: (card: DrawerCard) => void;
  onDelete: (id: string) => void;
  onShare: (card: DrawerCard) => void;
}

export const DrawerCardItem: React.FC<DrawerCardItemProps> = ({
  card,
  onEdit,
  onDelete,
  onShare,
}) => {
  // Find OTT availability for this work
  const matchingWork = MOCK_WORKS.find((w) => w.title === card.workTitle);
  const availableOtt = matchingWork?.ottProviders.find((p) => p.isAvailable);

  const handleOpenOtt = () => {
    if (availableOtt?.deepLink) {
      Linking.openURL(availableOtt.deepLink).catch(() => {
        Alert.alert('OTT 연결', `${availableOtt.name} 앱 또는 웹페이지로 연결합니다.`);
      });
    } else {
      Alert.alert(ko.archive.ottUnavailable, '현재 시청 가능한 OTT 플랫폼을 준비 중입니다.');
    }
  };

  return (
    <View style={styles.card}>
      {/* Card Image Header */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: card.stillUrl }} style={styles.image} resizeMode="cover" />
        <View style={styles.badgeRow}>
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={11} color={colors.accent} />
            <Text style={styles.timeBadgeText}>{card.timeFormatted}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {card.isScraped ? (
              <View style={styles.scrapedBadge}>
                <Ionicons name="download-outline" size={10} color={colors.accent} />
                <Text style={styles.scrapedBadgeText}>스크랩됨</Text>
              </View>
            ) : (
              <View style={card.isPublic ? styles.publicBadge : styles.privateBadge}>
                <Ionicons
                  name={card.isPublic ? 'globe-outline' : 'lock-closed-outline'}
                  size={10}
                  color={card.isPublic ? colors.accent : colors.textMuted}
                />
                <Text style={card.isPublic ? styles.publicBadgeText : styles.privateBadgeText}>
                  {card.isPublic ? '공개' : '비공개'}
                </Text>
              </View>
            )}
            {card.emotionTag ? (
              <View style={styles.emotionBadge}>
                <Text style={styles.emotionBadgeText}>#{card.emotionTag}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.body}>
        <View style={styles.workRow}>
          <Text style={styles.workTitleText}>{card.workTitle}</Text>
          {card.characterName ? (
            <Text style={styles.characterText}>• {card.characterName}</Text>
          ) : null}
        </View>

        {card.quote ? (
          <View style={styles.quoteWrapper}>
            <Text style={styles.quoteText}>{card.quote}</Text>
          </View>
        ) : null}

        {card.memo ? <Text style={styles.memoText}>{card.memo}</Text> : null}

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {card.tags.map((t, idx) => (
              <View key={idx} style={styles.tagChip}>
                <Text style={styles.tagText}>#{t}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Row */}
        <View style={styles.footerRow}>
          {/* OTT Deep Link Button */}
          <TouchableOpacity
            style={[
              styles.ottButton,
              !availableOtt && styles.ottButtonDisabled,
            ]}
            onPress={handleOpenOtt}
            activeOpacity={availableOtt ? 0.8 : 1}
          >
            <Ionicons
              name="play"
              size={13}
              color={availableOtt ? colors.accent : colors.textDisabled}
            />
            <Text
              style={[
                styles.ottButtonText,
                !availableOtt && styles.ottButtonTextDisabled,
              ]}
            >
              {availableOtt
                ? `${availableOtt.name}에서 보기`
                : ko.archive.ottUnavailable}
            </Text>
          </TouchableOpacity>

          <View style={styles.rightIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => onShare(card)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="share-social-outline" size={18} color={colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => onEdit(card)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => onDelete(card.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: colors.surfaceHigh,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeBadge: {
    backgroundColor: 'rgba(12, 18, 36, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.chip,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
  },
  emotionBadge: {
    backgroundColor: 'rgba(245, 196, 81, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.chip,
  },
  emotionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
  },
  publicBadge: {
    backgroundColor: 'rgba(233, 139, 38, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(233, 139, 38, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.chip,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  publicBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
  },
  privateBadge: {
    backgroundColor: 'rgba(51, 48, 44, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.chip,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  privateBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  scrapedBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.chip,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  scrapedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  body: {
    padding: spacing.base,
  },
  workRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  workTitleText: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  characterText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  quoteWrapper: {
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    paddingLeft: spacing.sm,
    marginVertical: spacing.xs,
  },
  quoteText: {
    ...typography.body1,
    color: colors.accent,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  memoText: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  tagChip: {
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  tagText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ottButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.button,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ottButtonDisabled: {
    opacity: 0.5,
  },
  ottButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  ottButtonTextDisabled: {
    color: colors.textDisabled,
  },
  rightIcons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconBtn: {
    padding: 4,
  },
});
