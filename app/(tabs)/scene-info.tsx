import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Scene, Work } from '@/src/types';
import { useSceneStore } from '@/src/store/sceneStore';
import { useArchiveStore } from '@/src/store/archiveStore';
import { useMapStore } from '@/src/store/mapStore';
import { sceneService } from '@/src/services';
import { Header } from '@/src/components/Header';
import { LoadingIndicator } from '@/src/components/LoadingIndicator';
import { ErrorMessage } from '@/src/components/ErrorMessage';
import { PlaybackSimulator } from '@/src/components/scene/PlaybackSimulator';
import { SceneDetailCard } from '@/src/components/scene/SceneDetailCard';
import { ErrorReportBottomSheet } from '@/src/components/scene/ErrorReportBottomSheet';
import { RecommendedScenesList } from '@/src/components/scene/RecommendedScenesList';

export default function SceneInfoScreen() {
  const router = useRouter();
  const {
    works,
    currentWork,
    currentScene,
    playbackSeconds,
    totalDurationSeconds,
    isLoading,
    error,
    loadInitialData,
    selectWork,
    setPlaybackSeconds,
    selectScene,
  } = useSceneStore();

  const { addCard } = useArchiveStore();
  const { locations, setSelectedLocation, openBottomSheet } = useMapStore();

  const [recommendedScenes, setRecommendedScenes] = useState<Scene[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentScene) {
      sceneService.getRecommendedScenes(currentScene.id).then(setRecommendedScenes);
    }
  }, [currentScene]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveScene = async (scene: Scene) => {
    await addCard({
      sceneId: scene.id,
      workTitle: scene.workTitle,
      episode: scene.episode,
      timeFormatted: scene.timeFormatted,
      stillUrl: scene.stillUrl,
      quote: scene.quote || `"${scene.title}"`,
      memo: '이 장면 뭐야? 탭에서 바로 저장한 명장면.',
      emotionTag: scene.emotionTag || '설레는',
      tags: [scene.workTitle, `${scene.episode}화`],
      characterName: scene.actors?.[0]?.name,
    });
    showToast(ko.sceneInfo.savedSuccess);
  };

  const handleSaveOst = async (scene: Scene) => {
    if (!scene.ost) return;
    await addCard({
      sceneId: scene.id,
      workTitle: scene.workTitle,
      episode: scene.episode,
      timeFormatted: scene.timeFormatted,
      stillUrl: scene.stillUrl,
      quote: `[OST] ${scene.ost.title} - ${scene.ost.artist}`,
      memo: `기억하고 싶은 명장면 배경음악: ${scene.ost.title}`,
      emotionTag: '여운 깊은',
      tags: ['OST', scene.ost.artist],
    });
    showToast('OST가 명장면 서랍에 보관되었습니다.');
  };

  const handleViewLocationOnMap = (locationId: string) => {
    const loc = locations.find((l) => l.id === locationId);
    if (loc) {
      setSelectedLocation(loc);
      openBottomSheet(loc);
      router.push('/(tabs)/map');
    }
  };

  if (isLoading && !currentScene) {
    return <LoadingIndicator fullScreen message="장면 정보를 불러오는 중입니다..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadInitialData} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title={ko.sceneInfo.headerTitle} subtitle="실시간 시청 장면 정보 매칭" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Work Selection Horizontal Switcher */}
        <View style={styles.workSwitcherSection}>
          <Text style={styles.workSwitcherLabel}>시청 중인 작품 변경</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.worksList}>
            {works.map((work) => {
              const isSelected = currentWork?.id === work.id;
              return (
                <TouchableOpacity
                  key={work.id}
                  style={[styles.workChip, isSelected && styles.workChipSelected]}
                  onPress={() => selectWork(work)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: work.posterUrl }} style={styles.workPosterThumb} />
                  <Text
                    style={[styles.workChipText, isSelected && styles.workChipTextSelected]}
                    numberOfLines={1}
                  >
                    {work.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Playback Time Simulator */}
        {currentWork && (
          <PlaybackSimulator
            currentSeconds={playbackSeconds}
            totalSeconds={totalDurationSeconds}
            onSeek={setPlaybackSeconds}
            episode={currentScene?.episode || 1}
            workTitle={currentWork.title}
          />
        )}

        {/* Scene Details Card */}
        {currentScene ? (
          <SceneDetailCard
            scene={currentScene}
            onSaveScene={handleSaveScene}
            onViewLocationOnMap={handleViewLocationOnMap}
            onReportError={() => setIsReportModalOpen(true)}
            onSaveOst={handleSaveOst}
          />
        ) : (
          <View style={styles.emptyNotice}>
            <Ionicons name="film-outline" size={32} color={colors.textDisabled} />
            <Text style={styles.emptyNoticeText}>해당 시점에 매칭된 장면 정보가 없습니다.</Text>
          </View>
        )}

        {/* Recommended Scenes List */}
        <RecommendedScenesList scenes={recommendedScenes} onSelectScene={selectScene} />
      </ScrollView>

      {/* Toast Notification */}
      {toastMessage && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Error Report Modal */}
      <ErrorReportBottomSheet
        visible={isReportModalOpen}
        scene={currentScene}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitSuccess={() => showToast(ko.sceneInfo.reportSuccess)}
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
  workSwitcherSection: {
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  workSwitcherLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xs,
  },
  worksList: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  workChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  workChipSelected: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.accent,
  },
  workPosterThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  workChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  workChipTextSelected: {
    color: colors.accent,
    fontWeight: '700',
  },
  emptyNotice: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyNoticeText: {
    ...typography.body2,
    color: colors.textDisabled,
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    left: spacing.base,
    right: spacing.base,
    backgroundColor: colors.surfaceHigh,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 99,
  },
  toastText: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
