import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Scene, ErrorReport } from '@/src/types';
import { BottomSheet } from '../BottomSheet';
import { Button } from '../Button';
import { reportService } from '@/src/services';

interface ErrorReportBottomSheetProps {
  visible: boolean;
  scene: Scene | null;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const CATEGORIES: Array<ErrorReport['category']> = [
  '배우',
  'OST',
  '소품/의상',
  '촬영지',
  '기타',
];

export const ErrorReportBottomSheet: React.FC<ErrorReportBottomSheetProps> = ({
  visible,
  scene,
  onClose,
  onSubmitSuccess,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ErrorReport['category']>('배우');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!scene) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await reportService.submitErrorReport({
        sceneId: scene.id,
        sceneTitle: scene.title,
        category: selectedCategory,
        content: content.trim(),
      });
      setContent('');
      setIsSubmitting(false);
      onClose();
      onSubmitSuccess();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={ko.sceneInfo.reportModalTitle}
      subtitle={scene.title}
    >
      <View style={styles.container}>
        <Text style={styles.label}>{ko.sceneInfo.reportCategory}</Text>
        <View style={styles.categoriesRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>오류 및 추가 정보 내용</Text>
        <TextInput
          style={styles.textInput}
          placeholder={ko.sceneInfo.reportContentPlaceholder}
          placeholderTextColor={colors.textDisabled}
          multiline
          numberOfLines={4}
          value={content}
          onChangeText={setContent}
        />

        <View style={styles.submitWrapper}>
          <Button
            title={ko.sceneInfo.reportSubmit}
            onPress={handleSubmit}
            variant="primary"
            size="md"
            disabled={!content.trim()}
            loading={isSubmitting}
          />
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.base,
  },
  label: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.chip,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  categoryChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categoryChipTextSelected: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: colors.surfaceHigh,
    borderRadius: borderRadius.button,
    padding: spacing.md,
    color: colors.textPrimary,
    ...typography.body2,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitWrapper: {
    marginTop: spacing.lg,
  },
});
