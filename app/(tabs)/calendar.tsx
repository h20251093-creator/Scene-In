import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { CalendarEvent } from '@/src/types';
import { useCalendarStore } from '@/src/store/calendarStore';
import { Header } from '@/src/components/Header';
import { Chip } from '@/src/components/Chip';
import { EmptyState } from '@/src/components/EmptyState';
import { LoadingIndicator } from '@/src/components/LoadingIndicator';
import { ErrorMessage } from '@/src/components/ErrorMessage';
import { CalendarView } from '@/src/components/calendar/CalendarView';
import { EventCard } from '@/src/components/calendar/EventCard';
import { ManageInterestsModal } from '@/src/components/calendar/ManageInterestsModal';
import { NotificationModal } from '@/src/components/calendar/NotificationModal';
import { ReportEventModal } from '@/src/components/calendar/ReportEventModal';

export default function CalendarScreen() {
  const {
    events,
    interests,
    selectedDate,
    viewMode,
    onlyFollowed,
    scheduledNotifications,
    isLoading,
    error,
    loadCalendarData,
    setSelectedDate,
    setViewMode,
    setOnlyFollowed,
    toggleInterestFollow,
    toggleNotification,
    addReportedEvent,
  } = useCalendarStore();

  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [notificationEvent, setNotificationEvent] = useState<CalendarEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<'all' | 'actor' | 'director'>('all');
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  useEffect(() => {
    loadCalendarData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Followed titles / persons
  const followedNames = interests.filter((i) => i.isFollowed).map((i) => i.name);

  const actorList = ['정하람', '한서연', '신태환', '윤시아', '송도현'];
  const directorList = ['이진석 감독', '오건우 감독', '최민식 감독'];

  // Filter events
  const displayedEvents = events.filter((ev) => {
    // If interest filter active, only keep events matching followed names
    if (onlyFollowed) {
      const matchWork = ev.relatedWorkTitle && followedNames.includes(ev.relatedWorkTitle);
      const matchPerson = ev.relatedPersons?.some((p) => followedNames.includes(p));
      if (!matchWork && !matchPerson) return false;
    }

    // Role filter: Actor vs Director
    if (roleFilter === 'actor') {
      const hasActor = ev.relatedPersons?.some((p) => !p.includes('감독'));
      if (!hasActor) return false;
      if (selectedPerson && !ev.relatedPersons?.includes(selectedPerson)) return false;
    } else if (roleFilter === 'director') {
      const hasDirector = ev.relatedPersons?.some((p) => p.includes('감독'));
      if (!hasDirector) return false;
      if (selectedPerson && !ev.relatedPersons?.includes(selectedPerson)) return false;
    }

    // In monthly view, filter to selected date (or show all upcoming if in list view)
    if (viewMode === 'monthly') {
      return ev.date === selectedDate;
    }
    return true;
  });

  if (isLoading && events.length === 0) {
    return <LoadingIndicator fullScreen message="팬덤 캘린더를 동기화 중입니다..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadCalendarData} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header
        title={ko.calendar.headerTitle}
        subtitle="공식 영화제·GV·무대인사·시사회 일정"
        rightAction={{
          iconName: 'add-circle-outline',
          label: '일정 제보',
          onPress: () => setIsReportModalOpen(true),
        }}
      />

      <FlatList
        data={displayedEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            notificationTiming={scheduledNotifications[item.id]}
            onOpenNotificationModal={(ev) => setNotificationEvent(ev)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* View Mode & Interest Filter Controls */}
            <View style={styles.controlsBar}>
              {/* Segment Toggle: Monthly vs List */}
              <View style={styles.viewModeToggle}>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    viewMode === 'monthly' && styles.toggleBtnActive,
                  ]}
                  onPress={() => setViewMode('monthly')}
                >
                  <Ionicons
                    name="calendar"
                    size={14}
                    color={viewMode === 'monthly' ? colors.textInverse : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      viewMode === 'monthly' && styles.toggleTextActive,
                    ]}
                  >
                    {ko.calendar.monthlyView}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    viewMode === 'list' && styles.toggleBtnActive,
                  ]}
                  onPress={() => setViewMode('list')}
                >
                  <Ionicons
                    name="list"
                    size={14}
                    color={viewMode === 'list' ? colors.textInverse : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      viewMode === 'list' && styles.toggleTextActive,
                    ]}
                  >
                    {ko.calendar.listView}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Manage Interests Button */}
              <TouchableOpacity
                style={styles.manageInterestsBtn}
                onPress={() => setIsInterestsModalOpen(true)}
              >
                <Ionicons name="heart" size={14} color={colors.accent} />
                <Text style={styles.manageInterestsText}>
                  관심 관리 ({followedNames.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Interest Filter Toggle Chip */}
            <View style={styles.interestFilterRow}>
              <TouchableOpacity
                style={[
                  styles.interestFilterChip,
                  onlyFollowed && styles.interestFilterChipActive,
                ]}
                onPress={() => setOnlyFollowed(!onlyFollowed)}
              >
                <Ionicons
                  name={onlyFollowed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={onlyFollowed ? colors.accent : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.interestFilterText,
                    onlyFollowed && styles.interestFilterTextActive,
                  ]}
                >
                  {ko.calendar.interestFilter}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 감독과 배우 정보 스케줄 필터 */}
            <View style={styles.personFilterSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.personFilterScroll}>
                <TouchableOpacity
                  style={[styles.personTypeChip, roleFilter === 'all' && styles.personTypeChipActive]}
                  onPress={() => {
                    setRoleFilter('all');
                    setSelectedPerson(null);
                  }}
                >
                  <Text style={[styles.personTypeChipText, roleFilter === 'all' && styles.personTypeChipTextActive]}>
                    전체 스케줄
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.personTypeChip, roleFilter === 'actor' && styles.personTypeChipActive]}
                  onPress={() => {
                    setRoleFilter('actor');
                    setSelectedPerson(null);
                  }}
                >
                  <Ionicons name="person" size={12} color={roleFilter === 'actor' ? colors.surface : colors.textSecondary} />
                  <Text style={[styles.personTypeChipText, roleFilter === 'actor' && styles.personTypeChipTextActive]}>
                    {ko.calendar.filterActor}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.personTypeChip, roleFilter === 'director' && styles.personTypeChipActive]}
                  onPress={() => {
                    setRoleFilter('director');
                    setSelectedPerson(null);
                  }}
                >
                  <Ionicons name="videocam" size={12} color={roleFilter === 'director' ? colors.surface : colors.textSecondary} />
                  <Text style={[styles.personTypeChipText, roleFilter === 'director' && styles.personTypeChipTextActive]}>
                    {ko.calendar.filterDirector}
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Sub-chips for specific actor/director */}
              {roleFilter !== 'all' && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subPersonScroll}>
                  {(roleFilter === 'actor' ? actorList : directorList).map((person) => {
                    const isSelected = selectedPerson === person;
                    return (
                      <TouchableOpacity
                        key={person}
                        style={[styles.subPersonChip, isSelected && styles.subPersonChipActive]}
                        onPress={() => setSelectedPerson(isSelected ? null : person)}
                      >
                        <Text style={[styles.subPersonChipText, isSelected && styles.subPersonChipTextActive]}>
                          {person}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>

            {/* Monthly Calendar Grid View (shown if in monthly mode) */}
            {viewMode === 'monthly' && (
              <CalendarView
                events={events}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            )}

            {/* Day Header */}
            <View style={styles.dateHeaderRow}>
              <Text style={styles.dateHeaderText}>
                {viewMode === 'monthly'
                  ? `${selectedDate} 일정 (${displayedEvents.length})`
                  : `전체 예정 일정 (${displayedEvents.length})`}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            iconName="calendar-outline"
            title="등록된 일정이 없습니다"
            description={
              onlyFollowed
                ? '관심 등록된 작품/인물의 일정이 없습니다. 다른 대상을 팔로우해보세요!'
                : ko.calendar.emptyEvents
            }
            actionTitle="새로운 일정 제보하기"
            onAction={() => setIsReportModalOpen(true)}
          />
        }
      />

      {/* Toast Notification */}
      {toastMessage && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Manage Interests Modal */}
      <ManageInterestsModal
        visible={isInterestsModalOpen}
        interests={interests}
        onClose={() => setIsInterestsModalOpen(false)}
        onToggleFollow={toggleInterestFollow}
      />

      {/* Notification Timing Modal */}
      <NotificationModal
        visible={!!notificationEvent}
        event={notificationEvent}
        currentTiming={notificationEvent ? scheduledNotifications[notificationEvent.id] : null}
        onClose={() => setNotificationEvent(null)}
        onSelectTiming={async (id, timing) => {
          await toggleNotification(id, timing);
          showToast(ko.calendar.notifScheduled);
        }}
      />

      {/* Report Event Modal */}
      <ReportEventModal
        visible={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitSuccess={() => {
          showToast('일정 제보가 접수되었습니다. 검토 후 반영됩니다.');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.huge,
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 3,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.chip,
    gap: 4,
  },
  toggleBtnActive: {
    backgroundColor: colors.accent,
  },
  toggleText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  manageInterestsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  manageInterestsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  interestFilterRow: {
    marginBottom: spacing.xs,
  },
  personFilterSection: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  personFilterScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  personTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.chip,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  personTypeChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  personTypeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  personTypeChipTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },
  subPersonScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  subPersonChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subPersonChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  subPersonChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  subPersonChipTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },
  interestFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
    gap: 6,
  },
  interestFilterChipActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(245, 196, 81, 0.1)',
  },
  interestFilterText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  interestFilterTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  dateHeaderRow: {
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  dateHeaderText: {
    ...typography.subtitle1,
    color: colors.textPrimary,
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
