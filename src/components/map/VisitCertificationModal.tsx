import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilmingLocation } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Button } from '../Button';

interface VisitCertificationModalProps {
  visible: boolean;
  location: FilmingLocation | null;
  onClose: () => void;
  onCompleteCertification: (photoUri?: string) => void;
}

export const VisitCertificationModal: React.FC<VisitCertificationModalProps> = ({
  visible,
  location,
  onClose,
  onCompleteCertification,
}) => {
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.4);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isStampEarned, setIsStampEarned] = useState<boolean>(false);

  if (!location) return null;

  const handleCapture = () => {
    // Simulate photo capture with location's still image
    setCapturedPhoto(location.stillUrl);
    setIsStampEarned(true);
  };

  const handleFinish = () => {
    onCompleteCertification(capturedPhoto || undefined);
    // Reset state
    setCapturedPhoto(null);
    setIsStampEarned(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Top Navigation */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{location.name}</Text>
            <Text style={styles.subtitleText}>구도 재현 방문 인증</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {isStampEarned ? (
          // Digital Stamp Celebration View
          <View style={styles.celebrationContainer}>
            <View style={styles.stampCircle}>
              <Ionicons name="ribbon" size={64} color={colors.accent} />
              <Text style={styles.stampWorkTitle}>{location.workTitle}</Text>
              <Text style={styles.stampLocationName}>{location.name}</Text>
              <Text style={styles.stampDate}>
                {new Date().toISOString().split('T')[0]} 인증 완료
              </Text>
            </View>

            <Text style={styles.earnedTitle}>{ko.map.stampEarned}</Text>
            <Text style={styles.earnedDesc}>{ko.map.stampDesc}</Text>

            <View style={styles.stampPhotoWrapper}>
              <Image source={{ uri: location.stillUrl }} style={styles.stampPhoto} />
              <View style={styles.stampBadgeOverlay}>
                <Ionicons name="checkmark-done-circle" size={20} color={colors.success} />
                <Text style={styles.stampBadgeText}>방문 인증 뱃지 획득</Text>
              </View>
            </View>

            <Button
              title="스탬프북에 보관하기"
              onPress={handleFinish}
              variant="primary"
              size="lg"
              style={{ width: '100%', marginTop: spacing.xl }}
            />
          </View>
        ) : (
          // Camera Viewfinder with Overlay Guide
          <View style={styles.viewfinderWrapper}>
            {/* Camera Preview Simulation */}
            <View style={styles.cameraFrame}>
              {/* Background live world camera simulation */}
              <Image
                source={{ uri: location.stillUrl }}
                style={[styles.cameraPreview, { filter: 'blur(2px)' } as any]}
                blurRadius={2}
              />

              {/* Translucent original scene still overlay guide */}
              <Image
                source={{ uri: location.stillUrl }}
                style={[styles.overlayGuide, { opacity: overlayOpacity }]}
                resizeMode="cover"
              />

              {/* Viewfinder crosshairs and grid */}
              <View style={styles.crosshairH} />
              <View style={styles.crosshairV} />
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />

              <View style={styles.guideBadge}>
                <Ionicons name="scan-outline" size={14} color={colors.accent} />
                <Text style={styles.guideBadgeText}>
                  스틸컷 구도와 현실 풍경을 맞춰보세요
                </Text>
              </View>
            </View>

            {/* Overlay transparency adjustment buttons */}
            <View style={styles.opacityControls}>
              <Text style={styles.opacityLabel}>가이드 투명도</Text>
              <View style={styles.opacityButtonRow}>
                {[0.2, 0.4, 0.6, 0.8].map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={[
                      styles.opacityBtn,
                      overlayOpacity === val && styles.opacityBtnActive,
                    ]}
                    onPress={() => setOverlayOpacity(val)}
                  >
                    <Text
                      style={[
                        styles.opacityBtnText,
                        overlayOpacity === val && styles.opacityBtnTextActive,
                      ]}
                    >
                      {Math.round(val * 100)}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bottom Shutter Action Bar */}
            <View style={styles.shutterBar}>
              <TouchableOpacity
                style={styles.shutterButtonOuter}
                onPress={handleCapture}
                activeOpacity={0.7}
              >
                <View style={styles.shutterButtonInner} />
              </TouchableOpacity>
              <Text style={styles.shutterLabel}>셔터를 눌러 인증하기</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
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
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    ...typography.subtitle1,
    color: colors.textPrimary,
  },
  subtitleText: {
    ...typography.caption,
    color: colors.accent,
  },
  viewfinderWrapper: {
    flex: 1,
    padding: spacing.base,
    justifyContent: 'space-between',
  },
  cameraFrame: {
    flex: 1,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraPreview: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  overlayGuide: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  crosshairH: {
    position: 'absolute',
    width: 60,
    height: 1,
    backgroundColor: 'rgba(245, 196, 81, 0.6)',
  },
  crosshairV: {
    position: 'absolute',
    height: 60,
    width: 1,
    backgroundColor: 'rgba(245, 196, 81, 0.6)',
  },
  cornerTL: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 24,
    height: 24,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.accent,
  },
  cornerTR: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.accent,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 24,
    height: 24,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.accent,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 24,
    height: 24,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.accent,
  },
  guideBadge: {
    position: 'absolute',
    bottom: spacing.base,
    backgroundColor: 'rgba(12, 18, 36, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.chip,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guideBadgeText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  opacityControls: {
    marginVertical: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  opacityLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  opacityButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  opacityBtn: {
    flex: 1,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.button,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
  },
  opacityBtnActive: {
    backgroundColor: colors.accent,
  },
  opacityBtnText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  opacityBtnTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  shutterBar: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  shutterButtonOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
  },
  shutterLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  celebrationContainer: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    backgroundColor: 'rgba(245, 196, 81, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  stampWorkTitle: {
    ...typography.badge,
    color: colors.accent,
    marginTop: 4,
  },
  stampLocationName: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 2,
  },
  stampDate: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  earnedTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  earnedDesc: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  stampPhotoWrapper: {
    width: '100%',
    height: 160,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stampPhoto: {
    width: '100%',
    height: '100%',
  },
  stampBadgeOverlay: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(12, 18, 36, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.chip,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stampBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
});
