import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InterestItem } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';

interface ManageInterestsModalProps {
  visible: boolean;
  interests: InterestItem[];
  onClose: () => void;
  onToggleFollow: (id: string) => void;
}

export const ManageInterestsModal: React.FC<ManageInterestsModalProps> = ({
  visible,
  interests,
  onClose,
  onToggleFollow,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'work' | 'actor' | 'director'>('all');

  const filtered = interests.filter((item) => {
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesSearch =
      search.trim() === '' ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{ko.calendar.manageInterest}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search Input */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="작품명, 배우, 감독 검색..."
              placeholderTextColor={colors.textDisabled}
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Type Filter Chips */}
        <View style={styles.chipsRow}>
          {(['all', 'work', 'actor', 'director'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeChip, typeFilter === t && styles.typeChipActive]}
              onPress={() => setTypeFilter(t)}
            >
              <Text
                style={[
                  styles.typeChipText,
                  typeFilter === t && styles.typeChipTextActive,
                ]}
              >
                {t === 'all'
                  ? '전체'
                  : t === 'work'
                  ? '작품'
                  : t === 'actor'
                  ? '배우'
                  : '감독'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Interests List */}
        <ScrollView contentContainerStyle={styles.listContent}>
          {filtered.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
              <View style={styles.textContainer}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>
                      {item.type === 'work'
                        ? '작품'
                        : item.type === 'actor'
                        ? '배우'
                        : '감독'}
                    </Text>
                  </View>
                </View>
                {item.description ? (
                  <Text style={styles.desc}>{item.description}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={[
                  styles.followBtn,
                  item.isFollowed ? styles.followingBtn : styles.unfollowedBtn,
                ]}
                onPress={() => onToggleFollow(item.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={item.isFollowed ? 'checkmark' : 'add'}
                  size={14}
                  color={item.isFollowed ? colors.textPrimary : colors.textInverse}
                />
                <Text
                  style={[
                    styles.followBtnText,
                    item.isFollowed && styles.followingBtnText,
                  ]}
                >
                  {item.isFollowed ? '팔로잉' : '팔로우'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
  searchSection: {
    padding: spacing.base,
    paddingBottom: spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    ...typography.body2,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.chip,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  typeChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  typeChipTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  listContent: {
    padding: spacing.base,
    gap: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceHigh,
  },
  textContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  typeBadge: {
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 9,
    color: colors.accent,
    fontWeight: '700',
  },
  desc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.chip,
    gap: 4,
  },
  unfollowedBtn: {
    backgroundColor: colors.accent,
  },
  followingBtn: {
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textInverse,
  },
  followingBtnText: {
    color: colors.textSecondary,
  },
});
