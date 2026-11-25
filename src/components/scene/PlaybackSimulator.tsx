import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';

interface PlaybackSimulatorProps {
  currentSeconds: number;
  totalSeconds: number;
  onSeek: (seconds: number) => void;
  episode: number;
  workTitle: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const PlaybackSimulator: React.FC<PlaybackSimulatorProps> = ({
  currentSeconds,
  totalSeconds,
  onSeek,
  episode,
  workTitle,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        onSeek(Math.min(totalSeconds, currentSeconds + 5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSeconds, totalSeconds]);

  const progressPercent = Math.min(100, (currentSeconds / totalSeconds) * 100);

  const handleStep = (delta: number) => {
    const next = Math.max(0, Math.min(totalSeconds, currentSeconds + delta));
    onSeek(next);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <Text style={styles.simulatorTag}>{ko.sceneInfo.simulatorTitle}</Text>
          <Text style={styles.workTitleText}>{workTitle} 제{episode}화</Text>
        </View>
        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          onPress={() => setIsPlaying(!isPlaying)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={18}
            color={isPlaying ? colors.accent : colors.textInverse}
          />
          <Text
            style={[
              styles.playButtonText,
              isPlaying && { color: colors.accent },
            ]}
          >
            {isPlaying ? '일시정지' : '실시간 시뮬레이션'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Scrub Bar */}
      <View style={styles.scrubberContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          <View style={[styles.scrubberThumb, { left: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Timestamp Indicators & Quick Seek Buttons */}
      <View style={styles.controlsRow}>
        <Text style={styles.timeText}>
          {formatTime(currentSeconds)} / {formatTime(totalSeconds)}
        </Text>

        <View style={styles.seekButtonGroup}>
          <TouchableOpacity
            style={styles.seekBtn}
            onPress={() => handleStep(-30)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="play-back" size={14} color={colors.textSecondary} />
            <Text style={styles.seekBtnText}>-30초</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.seekBtn}
            onPress={() => handleStep(30)}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.seekBtnText}>+30초</Text>
            <Ionicons name="play-forward" size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleWrapper: {
    flex: 1,
  },
  simulatorTag: {
    ...typography.badge,
    color: colors.accent,
  },
  workTitleText: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginTop: 2,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.button,
    gap: 4,
  },
  playButtonActive: {
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  playButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textInverse,
  },
  scrubberContainer: {
    height: 20,
    justifyContent: 'center',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceHigh,
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  scrubberThumb: {
    position: 'absolute',
    top: -4,
    marginLeft: -7,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  timeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  seekButtonGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  seekBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
    gap: 2,
  },
  seekBtnText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
