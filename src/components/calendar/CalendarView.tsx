import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { CalendarEvent } from '@/src/types';

interface CalendarViewProps {
  events: CalendarEvent[];
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  selectedDate,
  onSelectDate,
}) => {
  // Calendar header month state
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11); // November

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // Days in month calculation
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Find events for each day
  const getEventsForDay = (day: number) => {
    const formattedDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return events.filter((e) => e.date === formattedDate);
  };

  const daysGrid: Array<{ day: number | null; dateString?: string }> = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    daysGrid.push({ day: null });
  }

  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dateString = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    daysGrid.push({ day: d, dateString });
  }

  return (
    <View style={styles.container}>
      {/* Month Navigation */}
      <View style={styles.monthHeader}>
        <TouchableOpacity
          onPress={handlePrevMonth}
          style={styles.navBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {currentYear}년 {currentMonth}월
        </Text>
        <TouchableOpacity
          onPress={handleNextMonth}
          style={styles.navBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Weekday Labels */}
      <View style={styles.weekRow}>
        {weekDays.map((w, index) => (
          <Text
            key={w}
            style={[
              styles.weekText,
              index === 0 && { color: colors.error },
              index === 6 && { color: colors.secondaryAccent },
            ]}
          >
            {w}
          </Text>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.gridContainer}>
        {daysGrid.map((item, index) => {
          if (!item.day) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const isSelected = item.dateString === selectedDate;
          const dayEvents = getEventsForDay(item.day);
          const hasEvents = dayEvents.length > 0;

          return (
            <TouchableOpacity
              key={`day-${item.day}`}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
              ]}
              onPress={() => item.dateString && onSelectDate(item.dateString)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                  hasEvents && !isSelected && styles.dayTextHasEvents,
                ]}
              >
                {item.day}
              </Text>

              {/* Event Indicator Dots */}
              {hasEvents && (
                <View style={styles.dotsRow}>
                  {dayEvents.slice(0, 3).map((ev, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        isSelected && { backgroundColor: colors.textInverse },
                      ]}
                    />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navBtn: {
    padding: spacing.xs,
  },
  monthTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  weekText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
    width: 38,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.button,
  },
  dayCellSelected: {
    backgroundColor: colors.accent,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  dayTextSelected: {
    color: colors.textInverse,
    fontWeight: '800',
  },
  dayTextHasEvents: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
});
