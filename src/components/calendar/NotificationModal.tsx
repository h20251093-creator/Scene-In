import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CalendarEvent } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { BottomSheet } from '../BottomSheet';

interface NotificationModalProps {
  visible: boolean;
  event: CalendarEvent | null;
  currentTiming?: string | null;
  onClose: () => void;
  onSelectTiming: (
    eventId: string,
    timing: 'day_of' | '1_day_before' | '1_hour_before'
  ) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  event,
  currentTiming,
  onClose,
  onSelectTiming,
}) => {
  if (!event) return null;

  const handleTimingClick = (
    timing: 'day_of' | '1_day_before' | '1_hour_before'
  ) => {
    onSelectTiming(event.id, timing);
    onClose();
  };

  const options: Array<{
    timing: 'day_of' | '1_day_before' | '1_hour_before';
    label: string;
    sublabel: string;
  }> = [
    {
      timing: 'day_of',
      label: ko.calendar.notifDayOf,
      sublabel: '행사 당일 오전 9시에 푸시 알림 발송',
    },
    {
      timing: '1_day_before',
      label: ko.calendar.notif1DayBefore,
      sublabel: '행사 하루 전 오후 8시에 사전 안내',
    },
    {
      timing: '1_hour_before',
      label: ko.calendar.notif1HourBefore,
      sublabel: '행사 시작 1시간 전 긴급 리마인드',
    },
  ];

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={ko.calendar.setNotification}
      subtitle={event.title}
    >
      <View style={styles.container}>
        <Text style={styles.introText}>
          선택하신 일정의 예매 오픈 및 일정 변경 알림을 받아보실 수 있습니다.
        </Text>

        <View style={styles.optionsList}>
          {options.map((opt) => {
            const isSelected = currentTiming === opt.timing;
            return (
              <TouchableOpacity
                key={opt.timing}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => handleTimingClick(opt.timing)}
                activeOpacity={0.8}
              >
                <View style={styles.radioOuter}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text style={styles.optionSublabel}>{opt.sublabel}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.base,
  },
  introText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHigh,
    padding: spacing.base,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  optionCardSelected: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(245, 196, 81, 0.08)',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.accent,
    fontWeight: '700',
  },
  optionSublabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
