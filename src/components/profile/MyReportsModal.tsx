import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ErrorReport, UserEventReport } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { reportService } from '@/src/services';

interface MyReportsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const MyReportsModal: React.FC<MyReportsModalProps> = ({ visible, onClose }) => {
  const [tab, setTab] = useState<'errors' | 'events'>('errors');
  const [errorReports, setErrorReports] = useState<ErrorReport[]>([]);
  const [eventReports, setEventReports] = useState<UserEventReport[]>([]);

  useEffect(() => {
    if (visible) {
      reportService.getErrorReports().then(setErrorReports);
      reportService.getEventReports().then(setEventReports);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>내 제보 내역</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'errors' && styles.tabBtnActive]}
            onPress={() => setTab('errors')}
          >
            <Text style={[styles.tabText, tab === 'errors' && styles.tabTextActive]}>
              장면 오류 제보 ({errorReports.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'events' && styles.tabBtnActive]}
            onPress={() => setTab('events')}
          >
            <Text style={[styles.tabText, tab === 'events' && styles.tabTextActive]}>
              팬덤 일정 제보 ({eventReports.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {tab === 'errors' ? (
            errorReports.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={40} color={colors.textDisabled} />
                <Text style={styles.emptyText}>등록하신 장면 정보 제보 내역이 없습니다.</Text>
              </View>
            ) : (
              errorReports.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{item.category}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.itemTitle}>{item.sceneTitle}</Text>
                  <Text style={styles.itemContent}>{item.content}</Text>
                  <Text style={styles.itemDate}>{item.createdAt}</Text>
                </View>
              ))
            )
          ) : eventReports.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={40} color={colors.textDisabled} />
              <Text style={styles.emptyText}>등록하신 팬덤 일정 제보 내역이 없습니다.</Text>
            </View>
          ) : (
            eventReports.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.type}</Text>
                  </View>
                  <View style={[styles.statusBadge, styles.statusUnderReview]}>
                    <Text style={[styles.statusBadgeText, { color: colors.warning }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemContent}>{item.content || item.location}</Text>
                <Text style={styles.itemDate}>일시: {item.date}</Text>
              </View>
            ))
          )}
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: colors.accent,
  },
  tabText: {
    ...typography.subtitle2,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  content: {
    padding: spacing.base,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: 'rgba(61, 220, 151, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusUnderReview: {
    backgroundColor: 'rgba(255, 176, 32, 0.15)',
  },
  statusBadgeText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '700',
  },
  itemTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginTop: 2,
  },
  itemContent: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  itemDate: {
    fontSize: 11,
    color: colors.textDisabled,
    marginTop: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body2,
    color: colors.textDisabled,
    textAlign: 'center',
  },
});
