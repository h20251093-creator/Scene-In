import React, { useState, useEffect } from 'react';
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
import { DrawerCard } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Button } from '../Button';
import { MOCK_WORKS, MOCK_SCENES } from '@/src/data/mockData';

interface CreateCardModalProps {
  visible: boolean;
  editingCard?: DrawerCard | null;
  onClose: () => void;
  onSave: (card: Omit<DrawerCard, 'id' | 'createdAt'>, editingId?: string) => void;
}

const EMOTIONS = [
  '설레는',
  '가슴 벅찬',
  '눈물 나는',
  '심장 쫄깃한',
  '소름 돋는',
  '유쾌한',
  '여운 깊은',
];

export const CreateCardModal: React.FC<CreateCardModalProps> = ({
  visible,
  editingCard,
  onClose,
  onSave,
}) => {
  const [selectedWorkTitle, setSelectedWorkTitle] = useState(MOCK_WORKS[0].title);
  const [quote, setQuote] = useState('');
  const [memo, setMemo] = useState('');
  const [emotionTag, setEmotionTag] = useState(EMOTIONS[0]);
  const [characterName, setCharacterName] = useState('');
  const [customTagInput, setCustomTagInput] = useState('');
  const [stillUrl, setStillUrl] = useState(MOCK_SCENES[0].stillUrl);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  useEffect(() => {
    if (editingCard) {
      setSelectedWorkTitle(editingCard.workTitle);
      setQuote(editingCard.quote);
      setMemo(editingCard.memo);
      setEmotionTag(editingCard.emotionTag);
      setCharacterName(editingCard.characterName || '');
      setStillUrl(editingCard.stillUrl);
      setIsPublic(editingCard.isPublic ?? true);
    } else {
      setSelectedWorkTitle(MOCK_WORKS[0].title);
      setQuote('');
      setMemo('');
      setEmotionTag(EMOTIONS[0]);
      setCharacterName('');
      setStillUrl(MOCK_SCENES[0].stillUrl);
      setIsPublic(true);
    }
  }, [editingCard, visible]);

  const handleSave = () => {
    if (!quote.trim()) return;

    const tags = [selectedWorkTitle, emotionTag];
    if (customTagInput.trim()) {
      tags.push(customTagInput.trim());
    }

    onSave(
      {
        sceneId: `scene-${Date.now()}`,
        workTitle: selectedWorkTitle,
        episode: 1,
        timeFormatted: '명장면 기록',
        stillUrl,
        quote: quote.trim(),
        memo: memo.trim(),
        emotionTag,
        tags,
        characterName: characterName.trim() || undefined,
        isPublic,
        isScraped: false,
      },
      editingCard?.id
    );
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editingCard ? '명장면 카드 수정' : '새 명장면 기록'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Work Selection */}
          <Text style={styles.label}>{ko.archive.selectWork}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {MOCK_WORKS.map((w) => (
              <TouchableOpacity
                key={w.id}
                style={[
                  styles.chip,
                  selectedWorkTitle === w.title && styles.chipActive,
                ]}
                onPress={() => setSelectedWorkTitle(w.title)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedWorkTitle === w.title && styles.chipTextActive,
                  ]}
                >
                  {w.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Still Photo Preview & Selector */}
          <Text style={styles.label}>대표 스틸컷 선택</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stillsRow}>
            {MOCK_SCENES.slice(0, 6).map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.stillThumbWrapper,
                  stillUrl === s.stillUrl && styles.stillThumbActive,
                ]}
                onPress={() => setStillUrl(s.stillUrl)}
              >
                <Image source={{ uri: s.stillUrl }} style={styles.stillThumb} />
                {stillUrl === s.stillUrl && (
                  <View style={styles.stillSelectedCheck}>
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Quote Input */}
          <Text style={styles.label}>{ko.archive.dialogue} *</Text>
          <TextInput
            style={styles.textInput}
            placeholder={ko.archive.quotePlaceholder}
            placeholderTextColor={colors.textDisabled}
            multiline
            numberOfLines={2}
            value={quote}
            onChangeText={setQuote}
          />

          {/* Personal Memo Input */}
          <Text style={styles.label}>{ko.archive.personalMemo}</Text>
          <TextInput
            style={[styles.textInput, { minHeight: 80 }]}
            placeholder={ko.archive.memoPlaceholder}
            placeholderTextColor={colors.textDisabled}
            multiline
            numberOfLines={3}
            value={memo}
            onChangeText={setMemo}
          />

          {/* Character Name */}
          <Text style={styles.label}>대사를 한 인물 / 배우</Text>
          <TextInput
            style={[styles.textInput, { minHeight: 44 }]}
            placeholder="예: 차은호, 한도경"
            placeholderTextColor={colors.textDisabled}
            value={characterName}
            onChangeText={setCharacterName}
          />

          {/* Emotion Tag Selection */}
          <Text style={styles.label}>{ko.archive.selectEmotion}</Text>
          <View style={styles.emotionsContainer}>
            {EMOTIONS.map((emo) => (
              <TouchableOpacity
                key={emo}
                style={[
                  styles.emotionChip,
                  emotionTag === emo && styles.emotionChipActive,
                ]}
                onPress={() => setEmotionTag(emo)}
              >
                <Text
                  style={[
                    styles.emotionChipText,
                    emotionTag === emo && styles.emotionChipTextActive,
                  ]}
                >
                  #{emo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Public / Private Option */}
          <Text style={styles.label}>공개 설정 (익명 데이터베이스 공유 여부) *</Text>
          <View style={styles.visibilityRow}>
            <TouchableOpacity
              style={[
                styles.visibilityBtn,
                isPublic && styles.visibilityBtnActive,
              ]}
              onPress={() => setIsPublic(true)}
            >
              <Ionicons
                name="globe-outline"
                size={16}
                color={isPublic ? colors.textInverse : colors.textSecondary}
              />
              <Text
                style={[
                  styles.visibilityBtnText,
                  isPublic && styles.visibilityBtnTextActive,
                ]}
              >
                공개 (탐색 DB 공유)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.visibilityBtn,
                !isPublic && styles.visibilityBtnActive,
              ]}
              onPress={() => setIsPublic(false)}
            >
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color={!isPublic ? colors.textInverse : colors.textSecondary}
              />
              <Text
                style={[
                  styles.visibilityBtnText,
                  !isPublic && styles.visibilityBtnTextActive,
                ]}
              >
                비공개 (나만의 보관)
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.visibilityHint}>
            {isPublic
              ? '💡 공개 시 다른 팬들이 탐색 탭에서 익명으로 장면을 확인하고 서랍에 스크랩할 수 있습니다.'
              : '🔒 비공개 시 오직 나의 서랍에만 안전하게 보관됩니다.'}
          </Text>

          {/* Submit Button */}
          <Button
            title={editingCard ? '수정 완료' : '명장면 서랍에 기록하기'}
            onPress={handleSave}
            variant="primary"
            size="lg"
            disabled={!quote.trim()}
            style={{ marginTop: spacing.xl, marginBottom: spacing.huge }}
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
  },
  label: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  chipsRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  stillsRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  stillThumbWrapper: {
    width: 90,
    height: 60,
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stillThumbActive: {
    borderColor: colors.accent,
  },
  stillThumb: {
    width: '100%',
    height: '100%',
  },
  stillSelectedCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.accent,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.button,
    padding: spacing.md,
    color: colors.textPrimary,
    ...typography.body2,
    textAlignVertical: 'top',
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  emotionChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emotionChipActive: {
    backgroundColor: 'rgba(245, 196, 81, 0.25)',
    borderColor: colors.accent,
  },
  emotionChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emotionChipTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  visibilityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  visibilityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: borderRadius.button,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  visibilityBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  visibilityBtnText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  visibilityBtnTextActive: {
    color: colors.textInverse,
  },
  visibilityHint: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    marginBottom: spacing.md,
  },
});
