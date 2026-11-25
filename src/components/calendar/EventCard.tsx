import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CalendarEvent } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Badge } from '../Badge';

interface EventCardProps {
  event: CalendarEvent;
  notificationTiming?: string | null;
  onOpenNotificationModal: (event: CalendarEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  notificationTiming,
  onOpenNotificationModal,
}) => {
  const handleBooking = () => {
    if (event.bookingUrl) {
      Linking.openURL(event.bookingUrl).catch(() => {
        Alert.alert('예매처 이동', '공식 예매 페이지로 이동합니다.');
      });
    } else {
      Alert.alert('예매 안내', '현장 참여 또는 무료 관람 일정입니다.');
    }
  };

  const getNotificationTimingLabel = (t?: string | null) => {
    if (!t) return null;
    if (t === 'day_of') return ko.calendar.notifDayOf;
    if (t === '1_day_before') return ko.calendar.notif1DayBefore;
    if (t === '1_hour_before') return ko.calendar.notif1HourBefore;
    return '알림 설정됨';
  };

  const notifLabel = getNotificationTimingLabel(notificationTiming);

  return (
    <View style={styles.card}>
      {/* Top Meta Row */}
      <View style={styles.topRow}>
        <View style={styles.badgeGroup}>
          <Badge type={event.type} />
          {!event.isVerified && (
            <View style={styles.reviewBadge}>
              <Ionicons name="time" size={11} color={colors.warning} />
              <Text style={styles.reviewBadgeText}>{ko.calendar.eventUnderReview}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.notifBtn, !!notifLabel && styles.notifBtnActive]}
          onPress={() => onOpenNotificationModal(event)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={notifLabel ? 'notifications' : 'notifications-outline'}
            size={18}
            color={notifLabel ? colors.accent : colors.textSecondary}
          />
          {notifLabel ? (
            <Text style={styles.notifBtnLabel}>{notifLabel}</Text>
          ) : null}
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>{event.title}</Text>

      {/* Date & Location Details */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.accent} />
          <Text style={styles.infoText}>
            {event.date} {event.time ? `(${event.time})` : ''}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
          <Text style={styles.sourceText}>출처: {event.source}</Text>
        </View>
      </View>

      {/* Unverified Explanation if applicable */}
      {!event.isVerified && (
        <View style={styles.unverifiedBanner}>
          <Text style={styles.unverifiedText}>
            {ko.calendar.eventUnderReviewNotice}
          </Text>
        </View>
      )}

      {/* Bottom Booking Button */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={[
            styles.bookingButton,
            !event.bookingUrl && styles.bookingButtonDisabled,
          ]}
          onPress={handleBooking}
          activeOpacity={0.8}
        >
          <Text style={styles.bookingButtonText}>
            {event.bookingUrl ? ko.calendar.officialBooking : '상세 정보 확인'}
          </Text>
          <Ionicons
            name="open-outline"
            size={14}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 176, 32, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    gap: 4,
  },
  reviewBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.warning,
  },
  notifBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    gap: 4,
  },
  notifBtnActive: {
    backgroundColor: 'rgba(245, 196, 81, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.chip,
  },
  notifBtnLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
  },
  title: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  infoSection: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  sourceText: {
    ...typography.caption,
    color: colors.textDisabled,
  },
  unverifiedBanner: {
    backgroundColor: 'rgba(255, 176, 32, 0.08)',
    borderLeftWidth: 2,
    borderLeftColor: colors.warning,
    padding: spacing.xs,
    paddingLeft: spacing.sm,
    marginTop: spacing.sm,
  },
  unverifiedText: {
    fontSize: 11,
    color: colors.warning,
    lineHeight: 16,
  },
  footerRow: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHigh,
    paddingVertical: 10,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  bookingButtonDisabled: {
    opacity: 0.7,
  },
  bookingButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
