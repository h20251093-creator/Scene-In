import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { DrawerCard, ShareTemplateType } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Button } from '../Button';

interface ShareCardGeneratorModalProps {
  visible: boolean;
  card: DrawerCard | null;
  onClose: () => void;
}

const TEMPLATES: Array<{ id: ShareTemplateType; label: string; icon: string }> = [
  { id: 'minimal', label: '미니멀', icon: 'square-outline' },
  { id: 'filmstrip', label: '필름 스트립', icon: 'film-outline' },
  { id: 'neon', label: '네온 글로우', icon: 'flash-outline' },
  { id: 'editorial', label: '에디토리얼', icon: 'newspaper-outline' },
  { id: 'polaroid', label: '폴라로이드', icon: 'image-outline' },
];

export const ShareCardGeneratorModal: React.FC<ShareCardGeneratorModalProps> = ({
  visible,
  card,
  onClose,
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<ShareTemplateType>('minimal');
  const [accentPalette, setAccentPalette] = useState<'gold' | 'blue' | 'pink'>('gold');
  const [isSharing, setIsSharing] = useState(false);
  const cardViewRef = useRef<View>(null);

  if (!card) return null;

  const getAccentColor = () => {
    switch (accentPalette) {
      case 'blue':
        return colors.secondaryAccent;
      case 'pink':
        return '#FF6B8B';
      default:
        return colors.accent;
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (Platform.OS === 'web') {
        // Web share API or alert
        if (navigator.share) {
          await navigator.share({
            title: `[SCENE-IN] ${card.workTitle}`,
            text: `${card.quote} - ${card.workTitle} (${card.timeFormatted})`,
          });
        } else {
          Alert.alert(
            '공유 카드 완성',
            `"${card.quote}" 명장면 카드가 클립보드에 복사할 수 있도록 준비되었습니다!`
          );
        }
      } else {
        if (cardViewRef.current) {
          const uri = await captureRef(cardViewRef, {
            format: 'png',
            quality: 0.95,
          });
          const isAvailable = await Sharing.isAvailableAsync();
          if (isAvailable) {
            await Sharing.shareAsync(uri);
          } else {
            Alert.alert('공유', '이 기기에서는 직접 공유 기능을 지원하지 않습니다.');
          }
        }
      }
    } catch (err: any) {
      Alert.alert('공유 안내', '공유 카드가 준비되었습니다.');
    } finally {
      setIsSharing(false);
    }
  };

  const dynamicAccent = getAccentColor();

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{ko.archive.shareCard}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Card Preview Frame */}
          <View style={styles.previewContainer}>
            <View
              ref={cardViewRef}
              collapsable={false}
              style={[
                styles.cardCanvas,
                currentTemplate === 'minimal' && styles.canvasMinimal,
                currentTemplate === 'filmstrip' && styles.canvasFilmstrip,
                currentTemplate === 'neon' && [
                  styles.canvasNeon,
                  { borderColor: dynamicAccent },
                ],
                currentTemplate === 'editorial' && styles.canvasEditorial,
                currentTemplate === 'polaroid' && styles.canvasPolaroid,
              ]}
            >
              {/* Template 1: Minimal */}
              {currentTemplate === 'minimal' && (
                <View style={styles.minimalInner}>
                  <Image source={{ uri: card.stillUrl }} style={styles.minimalImage} />
                  <View style={styles.minimalMeta}>
                    <Text style={[styles.minimalQuote, { color: dynamicAccent }]}>
                      {card.quote}
                    </Text>
                    <View style={styles.minimalBottomRow}>
                      <Text style={styles.minimalWork}>{card.workTitle}</Text>
                      <Text style={styles.minimalTime}>{card.timeFormatted}</Text>
                    </View>
                    <Text style={styles.watermark}>SCENE-IN</Text>
                  </View>
                </View>
              )}

              {/* Template 2: Film Strip */}
              {currentTemplate === 'filmstrip' && (
                <View style={styles.filmstripInner}>
                  <View style={styles.filmPerforationsRow}>
                    {[...Array(8)].map((_, i) => (
                      <View key={i} style={styles.filmHole} />
                    ))}
                  </View>
                  <Image source={{ uri: card.stillUrl }} style={styles.filmImage} />
                  <View style={styles.filmContent}>
                    <Text style={styles.filmWorkTitle}>{card.workTitle} 35MM</Text>
                    <Text style={styles.filmQuote}>{card.quote}</Text>
                  </View>
                  <View style={styles.filmPerforationsRow}>
                    {[...Array(8)].map((_, i) => (
                      <View key={i} style={styles.filmHole} />
                    ))}
                  </View>
                </View>
              )}

              {/* Template 3: Neon */}
              {currentTemplate === 'neon' && (
                <View style={styles.neonInner}>
                  <Image source={{ uri: card.stillUrl }} style={styles.neonImage} />
                  <View style={styles.neonGlowBar} />
                  <View style={styles.neonMeta}>
                    <Text style={[styles.neonQuote, { color: dynamicAccent }]}>
                      {card.quote}
                    </Text>
                    <Text style={styles.neonWork}>{card.workTitle}</Text>
                    <Text style={styles.neonLogo}>SCENE // IN</Text>
                  </View>
                </View>
              )}

              {/* Template 4: Editorial */}
              {currentTemplate === 'editorial' && (
                <View style={styles.editorialInner}>
                  <Text style={styles.editorialHeader}>CINEMA ISSUE #08</Text>
                  <Image source={{ uri: card.stillUrl }} style={styles.editorialImage} />
                  <Text style={styles.editorialQuote}>{card.quote}</Text>
                  <View style={styles.editorialFooter}>
                    <Text style={styles.editorialWork}>{card.workTitle}</Text>
                    <Text style={styles.editorialChar}>{card.characterName || '명장면'}</Text>
                  </View>
                </View>
              )}

              {/* Template 5: Polaroid */}
              {currentTemplate === 'polaroid' && (
                <View style={styles.polaroidInner}>
                  <View style={styles.polaroidPhotoFrame}>
                    <Image source={{ uri: card.stillUrl }} style={styles.polaroidImage} />
                  </View>
                  <View style={styles.polaroidFooter}>
                    <Text style={styles.polaroidQuote}>{card.quote}</Text>
                    <Text style={styles.polaroidDate}>
                      {card.workTitle} • {card.createdAt}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Controls: Template Selection */}
          <Text style={styles.sectionLabel}>템플릿 스타일 선택 (5종)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templatesRow}>
            {TEMPLATES.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.templateOption,
                  currentTemplate === t.id && styles.templateOptionActive,
                ]}
                onPress={() => setCurrentTemplate(t.id)}
              >
                <Ionicons
                  name={t.icon as any}
                  size={20}
                  color={currentTemplate === t.id ? colors.accent : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.templateOptionText,
                    currentTemplate === t.id && styles.templateOptionTextActive,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Controls: Color Palette Customization */}
          <Text style={styles.sectionLabel}>포인트 컬러</Text>
          <View style={styles.paletteRow}>
            <TouchableOpacity
              style={[
                styles.paletteBtn,
                { backgroundColor: colors.accent },
                accentPalette === 'gold' && styles.paletteBtnActive,
              ]}
              onPress={() => setAccentPalette('gold')}
            />
            <TouchableOpacity
              style={[
                styles.paletteBtn,
                { backgroundColor: colors.secondaryAccent },
                accentPalette === 'blue' && styles.paletteBtnActive,
              ]}
              onPress={() => setAccentPalette('blue')}
            />
            <TouchableOpacity
              style={[
                styles.paletteBtn,
                { backgroundColor: '#FF6B8B' },
                accentPalette === 'pink' && styles.paletteBtnActive,
              ]}
              onPress={() => setAccentPalette('pink')}
            />
          </View>

          {/* Action Button: Share */}
          <Button
            title="이미지로 저장 및 SNS 공유"
            onPress={handleShare}
            variant="primary"
            size="lg"
            loading={isSharing}
            icon={<Ionicons name="share-social" size={20} color={colors.textInverse} />}
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
  scrollContent: {
    padding: spacing.base,
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  cardCanvas: {
    width: 320,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  // Minimal Template Styles
  canvasMinimal: {
    backgroundColor: '#0A0F1E',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  minimalInner: {
    alignItems: 'center',
  },
  minimalImage: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.button,
  },
  minimalMeta: {
    width: '100%',
    marginTop: spacing.md,
  },
  minimalQuote: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  minimalBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  minimalWork: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  minimalTime: {
    fontSize: 11,
    color: colors.textDisabled,
  },
  watermark: {
    fontSize: 9,
    color: colors.textDisabled,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  // Film Strip Template Styles
  canvasFilmstrip: {
    backgroundColor: '#05070D',
    borderWidth: 2,
    borderColor: '#222',
    paddingVertical: spacing.sm,
  },
  filmstripInner: {},
  filmPerforationsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  filmHole: {
    width: 14,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#333',
  },
  filmImage: {
    width: '90%',
    height: 170,
    alignSelf: 'center',
  },
  filmContent: {
    padding: spacing.md,
    alignItems: 'center',
  },
  filmWorkTitle: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 2,
  },
  filmQuote: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 4,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Neon Template Styles
  canvasNeon: {
    backgroundColor: '#090D1A',
    borderWidth: 2,
    padding: spacing.md,
  },
  neonInner: {},
  neonImage: {
    width: '100%',
    height: 170,
    borderRadius: borderRadius.button,
  },
  neonGlowBar: {
    height: 3,
    backgroundColor: colors.accent,
    marginVertical: spacing.sm,
  },
  neonMeta: {
    alignItems: 'center',
  },
  neonQuote: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  neonWork: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  neonLogo: {
    fontSize: 9,
    letterSpacing: 3,
    color: colors.textDisabled,
    marginTop: spacing.xs,
  },

  // Editorial Template Styles
  canvasEditorial: {
    backgroundColor: '#121726',
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#394774',
  },
  editorialInner: {},
  editorialHeader: {
    fontSize: 10,
    color: colors.accent,
    letterSpacing: 2,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  editorialImage: {
    width: '100%',
    height: 160,
    borderRadius: 4,
  },
  editorialQuote: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginTop: spacing.md,
    lineHeight: 22,
  },
  editorialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
  },
  editorialWork: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  editorialChar: {
    fontSize: 11,
    color: colors.textDisabled,
  },

  // Polaroid Template Styles
  canvasPolaroid: {
    backgroundColor: '#F5F5F0',
    padding: spacing.md,
    paddingBottom: spacing.xl,
    borderRadius: 8,
  },
  polaroidInner: {},
  polaroidPhotoFrame: {
    backgroundColor: '#000',
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  polaroidImage: {
    width: '100%',
    height: '100%',
  },
  polaroidFooter: {
    marginTop: spacing.md,
  },
  polaroidQuote: {
    fontSize: 14,
    color: '#222',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  polaroidDate: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
  },

  sectionLabel: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  templatesRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  templateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  templateOptionActive: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceHigh,
  },
  templateOptionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  templateOptionTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  paletteRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  paletteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paletteBtnActive: {
    borderColor: '#FFF',
  },
});
