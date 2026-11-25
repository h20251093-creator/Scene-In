import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Header } from '@/src/components/Header';
import { ProfileHeader } from '@/src/components/profile/ProfileHeader';
import { OttLinkModal } from '@/src/components/profile/OttLinkModal';
import { MyReportsModal } from '@/src/components/profile/MyReportsModal';
import { LocationGuideModal } from '@/src/components/profile/LocationGuideModal';
import { TermsModal } from '@/src/components/profile/TermsModal';
import { StampBookModal } from '@/src/components/map/StampBookModal';
import { ManageInterestsModal } from '@/src/components/calendar/ManageInterestsModal';
import { useArchiveStore } from '@/src/store/archiveStore';
import { useMapStore } from '@/src/store/mapStore';
import { useCalendarStore } from '@/src/store/calendarStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { cards, collections } = useArchiveStore();
  const { stamps, missions } = useMapStore();
  const { interests, toggleInterestFollow } = useCalendarStore();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);
  const [locationPermEnabled, setLocationPermEnabled] = useState(true);
  const [nightMuteEnabled, setNightMuteEnabled] = useState(true);
  const [isOttModalOpen, setIsOttModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isStampBookOpen, setIsStampBookOpen] = useState(false);
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const [termsModalType, setTermsModalType] = useState<'terms' | 'privacy' | null>(null);

  const followedCount = interests.filter((i) => i.isFollowed).length;

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: ko.common.cancel, style: 'cancel' },
      {
        text: ko.profile.logout,
        style: 'destructive',
        onPress: () => {
          Alert.alert('로그아웃 완료', '안전하게 로그아웃되었습니다.');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title={ko.profile.headerTitle} subtitle={ko.profile.subtitle} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <ProfileHeader
          nickname={ko.profile.nickname}
          bio={ko.profile.bio}
          avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
          savedScenesCount={cards.length}
          stampsCount={stamps.length}
          followingCount={followedCount}
          onPressSavedScenes={() => router.push('/(tabs)/archive')}
          onPressStamps={() => setIsStampBookOpen(true)}
          onPressFollowing={() => setIsInterestsModalOpen(true)}
        />

        {/* Section 1: My Fandom Activity */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>나의 팬덤 아카이브</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => router.push('/(tabs)/archive')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="bookmark-outline" size={20} color={colors.accent} />
                <Text style={styles.menuLabel}>{ko.profile.myCollections}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{collections.length}개</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => setIsStampBookOpen(true)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="ribbon-outline" size={20} color={colors.accent} />
                <Text style={styles.menuLabel}>나의 촬영지 스탬프북</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{stamps.length}개 획득</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => setIsInterestsModalOpen(true)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="heart-outline" size={20} color={colors.accent} />
                <Text style={styles.menuLabel}>{ko.profile.interestsSection}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{followedCount}개 팔로우</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => setIsReportsModalOpen(true)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="chatbubbles-outline" size={20} color={colors.accent} />
                <Text style={styles.menuLabel}>{ko.profile.myReports}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 2: Settings & Integrations */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>{ko.profile.settingsSection}</Text>
          <View style={styles.menuCard}>
            {/* OTT Integration */}
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => setIsOttModalOpen(true)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="tv-outline" size={20} color={colors.secondaryAccent} />
                <Text style={styles.menuLabel}>{ko.profile.ottLink}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={[styles.menuValue, { color: colors.success }]}>
                  연동 관리
                </Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Push Notifications Toggle */}
            <View style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <Ionicons name="notifications-outline" size={20} color={colors.accent} />
                <Text style={styles.menuLabel}>{ko.profile.notificationSettings}</Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={(val) => {
                  setPushEnabled(val);
                  Alert.alert('알림 설정', val ? '🔔 시사회·팝업·일정 알림이 켜졌습니다.' : '🔕 알림이 꺼졌습니다.');
                }}
                trackColor={{ false: colors.surfaceHigh, true: colors.accent }}
                thumbColor={pushEnabled ? colors.textInverse : colors.textSecondary}
              />
            </View>

            <View style={styles.divider} />

            {/* Night Mode Toggle */}
            <View style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <Ionicons name="moon-outline" size={20} color={colors.accent} />
                <Text style={styles.menuLabel}>나이트 모드 (다크 테마)</Text>
              </View>
              <Switch
                value={isNightMode}
                onValueChange={(val) => {
                  setIsNightMode(val);
                  Alert.alert('테마 설정', val ? '🌙 나이트 모드가 활성화되었습니다.' : '☀️ 라이트 모드로 전환되었습니다.');
                }}
                trackColor={{ false: colors.surfaceHigh, true: colors.accent }}
                thumbColor={isNightMode ? colors.textInverse : colors.textSecondary}
              />
            </View>

            <View style={styles.divider} />

            {/* Location Permission Toggle */}
            <View style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <Ionicons name="location-outline" size={20} color={colors.accent} />
                <Text style={styles.menuLabel}>위치 기반 촬영지·팝업 탐색 권한</Text>
              </View>
              <Switch
                value={locationPermEnabled}
                onValueChange={(val) => {
                  setLocationPermEnabled(val);
                  Alert.alert('위치 권한 설정', val ? '📍 위치 정보 사용 권한이 허용되었습니다.' : '🚫 위치 권한이 비활성화되었습니다.');
                }}
                trackColor={{ false: colors.surfaceHigh, true: colors.accent }}
                thumbColor={locationPermEnabled ? colors.textInverse : colors.textSecondary}
              />
            </View>

            <View style={styles.divider} />

            {/* Night Quiet Hours Toggle */}
            <View style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <Ionicons name="alarm-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>심야 시간 알림 제한 (22:00 ~ 08:00)</Text>
              </View>
              <Switch
                value={nightMuteEnabled}
                onValueChange={(val) => {
                  setNightMuteEnabled(val);
                  Alert.alert('심야 알림 제한', val ? '🔕 22시부터 08시까지 알림이 제한됩니다.' : '🔔 심야 알림 제한이 해제되었습니다.');
                }}
                trackColor={{ false: colors.surfaceHigh, true: colors.accent }}
                thumbColor={nightMuteEnabled ? colors.textInverse : colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Section 3: Legal & Account */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>이용 정보</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => setTermsModalType('terms')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>{ko.profile.terms}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => setTermsModalType('privacy')}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="shield-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>{ko.profile.privacy}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuRow} onPress={handleLogout}>
              <View style={styles.menuLeft}>
                <Ionicons name="log-out-outline" size={20} color={colors.error} />
                <Text style={[styles.menuLabel, { color: colors.error }]}>
                  {ko.profile.logout}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Version info */}
        <Text style={styles.versionText}>SCENE-IN App v1.0.0 (Build 2026.11)</Text>
      </ScrollView>

      {/* Modals */}
      <OttLinkModal visible={isOttModalOpen} onClose={() => setIsOttModalOpen(false)} />
      <MyReportsModal visible={isReportsModalOpen} onClose={() => setIsReportsModalOpen(false)} />
      <LocationGuideModal visible={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
      <StampBookModal
        visible={isStampBookOpen}
        onClose={() => setIsStampBookOpen(false)}
        stamps={stamps}
        missions={missions}
      />
      <ManageInterestsModal
        visible={isInterestsModalOpen}
        interests={interests}
        onClose={() => setIsInterestsModalOpen(false)}
        onToggleFollow={toggleInterestFollow}
      />
      <TermsModal
        visible={termsModalType !== null}
        type={termsModalType || 'terms'}
        onClose={() => setTermsModalType(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.huge,
  },
  menuSection: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.base,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: spacing.xs,
    paddingLeft: spacing.xs,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuLabel: {
    ...typography.body1,
    color: colors.textPrimary,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  menuValue: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.base,
  },
  fixedThemeTag: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
    backgroundColor: 'rgba(245, 196, 81, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textDisabled,
    marginTop: spacing.md,
  },
});
