import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Collection } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Button } from '../Button';
import { MOCK_SCENES } from '@/src/data/mockData';

interface CreateCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (collection: Omit<Collection, 'id' | 'createdAt' | 'cardCount'>) => void;
}

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [coverUrl, setCoverUrl] = useState(MOCK_SCENES[0].stillUrl);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      coverUrl,
      isPrivate,
    });
    setTitle('');
    setDescription('');
    setIsPrivate(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{ko.archive.createCollection}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>{ko.archive.collectionName} *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="예: 비 내리는 날 보고 싶은 장면들"
            placeholderTextColor={colors.textDisabled}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>{ko.archive.collectionDesc}</Text>
          <TextInput
            style={[styles.textInput, { minHeight: 70 }]}
            placeholder="컬렉션에 대한 간단한 소개를 적어주세요."
            placeholderTextColor={colors.textDisabled}
            multiline
            numberOfLines={2}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>커버 이미지 선택</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.coversRow}>
            {MOCK_SCENES.slice(0, 5).map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.coverThumbWrapper,
                  coverUrl === s.stillUrl && styles.coverThumbActive,
                ]}
                onPress={() => setCoverUrl(s.stillUrl)}
              >
                <Image source={{ uri: s.stillUrl }} style={styles.coverThumb} />
                {coverUrl === s.stillUrl && (
                  <View style={styles.coverSelectedCheck}>
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>{ko.archive.isPrivate}</Text>
              <Text style={styles.switchDesc}>나만 볼 수 있는 비밀 컬렉션으로 설정합니다.</Text>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: colors.surfaceHigh, true: colors.accent }}
              thumbColor={isPrivate ? colors.textInverse : colors.textSecondary}
            />
          </View>

          <Button
            title="컬렉션 생성하기"
            onPress={handleSave}
            variant="primary"
            size="lg"
            disabled={!title.trim()}
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
  },
  label: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
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
  coversRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  coverThumbWrapper: {
    width: 100,
    height: 70,
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  coverThumbActive: {
    borderColor: colors.accent,
  },
  coverThumb: {
    width: '100%',
    height: '100%',
  },
  coverSelectedCheck: {
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
  },
  switchTitle: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  switchDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
