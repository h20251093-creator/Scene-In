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
import { FilmingLocation } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Button } from '../Button';
import { BottomSheet } from '../BottomSheet';

interface LocationBottomSheetProps {
  location: FilmingLocation | null;
  visible: boolean;
  onClose: () => void;
  userCoords: { latitude: number; longitude: number } | null;
  onSaveToArchive: (loc: FilmingLocation) => void;
  onStartCertification: (loc: FilmingLocation) => void;
}

// Haversine distance formula in meters
function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  location,
  visible,
  onClose,
  userCoords,
  onSaveToArchive,
  onStartCertification,
}) => {
  if (!location) return null;

  // Calculate real distance
  let distanceMeters = 50; // default near for testing if coords missing
  if (userCoords) {
    distanceMeters = calculateDistanceInMeters(
      userCoords.latitude,
      userCoords.longitude,
      location.latitude,
      location.longitude
    );
  }

  const isWithin100m = distanceMeters <= 100;

  const handleOpenDirections = () => {
    const url = `https://map.kakao.com/link/to/${encodeURIComponent(location.name)},${location.latitude},${location.longitude}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`);
    });
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={location.name}
      subtitle={location.workTitle}
    >
      <View style={styles.container}>
        {/* Scene Still Image with overlay badge */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: location.stillUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.regionBadge}>
            <Text style={styles.regionText}>{location.region}</Text>
          </View>
          <View style={styles.distanceBadge}>
            <Ionicons name="navigate-outline" size={13} color={colors.accent} />
            <Text style={styles.distanceText}>
              {distanceMeters < 1000
                ? `${distanceMeters}m`
                : `${(distanceMeters / 1000).toFixed(1)}km`}
            </Text>
          </View>
        </View>

        {/* Scene & Location Details */}
        <View style={styles.detailsSection}>
          <View style={styles.sceneTitleRow}>
            <Ionicons name="videocam-outline" size={16} color={colors.accent} />
            <Text style={styles.sceneTitleText}>{location.sceneTitle}</Text>
          </View>
          <Text style={styles.addressText}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />{' '}
            {location.address}
          </Text>
          <Text style={styles.descriptionText}>{location.description}</Text>

          {location.tips ? (
            <View style={styles.tipsBox}>
              <Ionicons name="bulb-outline" size={16} color={colors.accent} />
              <Text style={styles.tipsText}>{location.tips}</Text>
            </View>
          ) : null}
        </View>

        {/* Certification Status Callout */}
        <View
          style={[
            styles.certStatusBanner,
            isWithin100m ? styles.certStatusSuccess : styles.certStatusInfo,
          ]}
        >
          <Ionicons
            name={isWithin100m ? 'checkmark-circle' : 'information-circle'}
            size={18}
            color={isWithin100m ? colors.success : colors.warning}
          />
          <Text
            style={[
              styles.certStatusText,
              { color: isWithin100m ? colors.success : colors.warning },
            ]}
          >
            {isWithin100m ? ko.map.certifyAvailable : ko.map.certifyFarAway}
          </Text>
        </View>

        {/* 3 Main Action Buttons */}
        <View style={styles.actionRow}>
          <View style={styles.actionCol}>
            <Button
              title={ko.map.viewDirections}
              onPress={handleOpenDirections}
              variant="secondary"
              size="sm"
              icon={<Ionicons name="navigate" size={16} color={colors.textPrimary} />}
            />
          </View>
          <View style={styles.actionCol}>
            <Button
              title={ko.sceneInfo.saveToArchive}
              onPress={() => onSaveToArchive(location)}
              variant="secondary"
              size="sm"
              icon={<Ionicons name="bookmark-outline" size={16} color={colors.accent} />}
            />
          </View>
        </View>

        {/* 관련 팬덤 일정 보기 (시사회 / 팝업 연계) */}
        <View style={styles.certButtonContainer}>
          <Button
            title="관련 시사회·팝업 일정 보기"
            onPress={() => {
              onClose();
              Alert.alert('팬덤 캘린더 연계', `${location.workTitle} 관련 스케줄과 시사회 일정을 확인합니다.`);
            }}
            variant="primary"
            size="md"
            icon={<Ionicons name="calendar-outline" size={18} color={colors.textInverse} />}
          />
        </View>

        {/* 연계 기능 (팝업스토어 예약 & 시사회 티켓팅 알림) */}
        <View style={styles.comingSoonSection}>
          <Text style={styles.comingSoonTitle}>작품 연계 탐색</Text>
          <View style={styles.badgeRow}>
            <TouchableOpacity
              style={styles.expansionBadge}
              onPress={() => Alert.alert('팝업스토어', '해당 작품의 성수·더현대 팝업스토어 사전예약 기능이 곧 오픈됩니다.')}
            >
              <Ionicons name="storefront-outline" size={14} color={colors.secondaryAccent} />
              <Text style={styles.expansionBadgeText}>팝업스토어 예약</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.expansionBadge}
              onPress={() => Alert.alert('시사회 알림', 'GV 및 공식 무대인사 티켓팅 오픈 알림이 설정되었습니다.')}
            >
              <Ionicons name="ticket-outline" size={14} color={colors.accent} />
              <Text style={styles.expansionBadgeText}>시사회 알림</Text>
            </TouchableOpacity>
            <View style={styles.expansionBadge}>
              <Ionicons name="film-outline" size={14} color={colors.success} />
              <Text style={styles.expansionBadgeText}>공식 촬영지</Text>
            </View>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.base,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surfaceHigh,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  regionBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(12, 18, 36, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
  },
  regionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  distanceBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(12, 18, 36, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.chip,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  detailsSection: {
    marginTop: spacing.md,
  },
  sceneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
  },
  sceneTitleText: {
    ...typography.subtitle1,
    color: colors.textPrimary,
  },
  addressText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  tipsBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceHigh,
    padding: spacing.md,
    borderRadius: borderRadius.button,
    alignItems: 'flex-start',
    gap: 8,
    marginTop: spacing.xs,
  },
  tipsText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  certStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.md,
    borderRadius: borderRadius.button,
    marginTop: spacing.md,
    borderWidth: 1,
  },
  certStatusSuccess: {
    backgroundColor: 'rgba(61, 220, 151, 0.12)',
    borderColor: 'rgba(61, 220, 151, 0.3)',
  },
  certStatusInfo: {
    backgroundColor: 'rgba(255, 176, 32, 0.12)',
    borderColor: 'rgba(255, 176, 32, 0.3)',
  },
  certStatusText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionCol: {
    flex: 1,
  },
  certButtonContainer: {
    marginTop: spacing.sm,
  },
  comingSoonSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  comingSoonTitle: {
    ...typography.caption,
    color: colors.textDisabled,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  expansionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.button,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expansionBadgeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
