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
import { Collection } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';

interface CollectionsSectionProps {
  collections: Collection[];
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
  onCreateCollection: () => void;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  collections,
  selectedCollectionId,
  onSelectCollection,
  onCreateCollection,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <Ionicons name="albums-outline" size={18} color={colors.accent} />
          <Text style={styles.sectionTitle}>{ko.archive.myCollections}</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={onCreateCollection}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={16} color={colors.accent} />
          <Text style={styles.createButtonText}>컬렉션 추가</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* "View All" Collection chip */}
        <TouchableOpacity
          style={[
            styles.collectionCard,
            styles.allCard,
            selectedCollectionId === null && styles.collectionCardActive,
          ]}
          onPress={() => onSelectCollection(null)}
          activeOpacity={0.8}
        >
          <View style={styles.allIconCircle}>
            <Ionicons name="grid-outline" size={24} color={colors.accent} />
          </View>
          <Text style={styles.allTitle}>전체 서랍</Text>
        </TouchableOpacity>

        {collections.map((col) => {
          const isSelected = selectedCollectionId === col.id;
          return (
            <TouchableOpacity
              key={col.id}
              style={[
                styles.collectionCard,
                isSelected && styles.collectionCardActive,
              ]}
              onPress={() =>
                onSelectCollection(isSelected ? null : col.id)
              }
              activeOpacity={0.8}
            >
              <Image source={{ uri: col.coverUrl }} style={styles.coverImage} />
              <View style={styles.overlay}>
                {col.isPrivate && (
                  <View style={styles.lockBadge}>
                    <Ionicons name="lock-closed" size={10} color="#FFF" />
                  </View>
                )}
                <Text style={styles.colTitle} numberOfLines={2}>
                  {col.title}
                </Text>
                <Text style={styles.cardCountText}>{col.cardCount}개 장면</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  createButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  collectionCard: {
    width: 140,
    height: 100,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  collectionCardActive: {
    borderColor: colors.accent,
  },
  allCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHigh,
  },
  allIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 196, 81, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  allTitle: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 18, 36, 0.65)',
    padding: spacing.sm,
    justifyContent: 'flex-end',
  },
  lockBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderRadius: 8,
  },
  colTitle: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
    lineHeight: 14,
  },
  cardCountText: {
    fontSize: 9,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
});
