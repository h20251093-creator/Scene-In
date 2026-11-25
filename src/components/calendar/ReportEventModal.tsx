import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventType } from '@/src/types';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { Button } from '../Button';
import { reportService } from '@/src/services';

interface ReportEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const EVENT_TYPES: Array<{ type: EventType; label: string }> = [
  { type: 'gv', label: 'GV' },
  { type: 'stageGreeting', label: '무대인사' },
  { type: 'premiere', label: '시사회' },
  { type: 'festival', label: '영화제' },
  { type: 'actorVisit', label: '배우 내한' },
  { type: 'ottRelease', label: 'OTT 공개' },
  { type: 'popUp', label: '팝업/전시' },
];

const POPULAR_VENUES = [
  'CGV 용산아이파크몰',
  '메가박스 코엑스',
  '롯데시네마 월드타워',
  '영화의전당 야외극장',
  '예술의전당 음악당',
  '성수동 팝업스퀘어',
];

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = ['00', '15', '30', '45'];

export const ReportEventModal: React.FC<ReportEventModalProps> = ({
  visible,
  onClose,
  onSubmitSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<EventType>('stageGreeting');
  const [date, setDate] = useState('2026-11-25');
  const [location, setLocation] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time Dial State
  const [isAm, setIsAm] = useState<boolean>(false); // Default PM (오후)
  const [selectedHour, setSelectedHour] = useState<number>(7); // 7시 (19:00)
  const [selectedMinute, setSelectedMinute] = useState<string>('30'); // 30분
  const [showTimeDial, setShowTimeDial] = useState<boolean>(true);

  // Computed 24-hour time string
  const getFormatted24Hour = () => {
    let hour24 = selectedHour;
    if (!isAm && selectedHour < 12) hour24 += 12;
    if (isAm && selectedHour === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, '0')}:${selectedMinute}`;
  };

  const getDisplayTime = () => {
    return `${isAm ? '오전' : '오후'} ${selectedHour}:${selectedMinute} (${getFormatted24Hour()})`;
  };

  const handleSubmit = async () => {
    if (!title.trim() || !location.trim()) return;

    setIsSubmitting(true);
    try {
      await reportService.submitEventReport({
        title: title.trim(),
        type: selectedType,
        date,
        location: `${location.trim()} [${getFormatted24Hour()}]`,
        sourceUrl: sourceUrl.trim(),
        content: content.trim(),
      });
      setIsSubmitting(false);
      onClose();
      onSubmitSuccess();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Modal Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{ko.calendar.reportModalTitle}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Information Notice */}
          <View style={styles.noticeBox}>
            <Ionicons name="shield-checkmark" size={20} color={colors.accent} />
            <Text style={styles.noticeText}>{ko.calendar.reportNotice}</Text>
          </View>

          {/* 1. Event Title */}
          <Text style={styles.label}>일정 제목 *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="예: <달빛이 머무는 밤> 종영 기념 앵콜 무대인사"
            placeholderTextColor={colors.textDisabled}
            value={title}
            onChangeText={setTitle}
          />

          {/* 2. Event Type Chips */}
          <Text style={styles.label}>행사 유형 *</Text>
          <View style={styles.typesRow}>
            {EVENT_TYPES.map((t) => (
              <TouchableOpacity
                key={t.type}
                style={[
                  styles.typeChip,
                  selectedType === t.type && styles.typeChipActive,
                ]}
                onPress={() => setSelectedType(t.type)}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    selectedType === t.type && styles.typeChipTextActive,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 3. Event Date (YYYY-MM-DD) */}
          <Text style={styles.label}>일자 (YYYY-MM-DD) *</Text>
          <View style={styles.dateRow}>
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textDisabled}
              value={date}
              onChangeText={setDate}
            />
            <TouchableOpacity
              style={styles.quickDateBtn}
              onPress={() => setDate('2026-11-20')}
            >
              <Text style={styles.quickDateBtnText}>11/20(오늘)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickDateBtn}
              onPress={() => setDate('2026-11-25')}
            >
              <Text style={styles.quickDateBtnText}>11/25</Text>
            </TouchableOpacity>
          </View>

          {/* 4. Interactive Time Setting Dial & Clock Picker */}
          <View style={styles.timeSectionHeader}>
            <Text style={styles.label}>시작 시간 설정 (다이얼 선택) *</Text>
            <TouchableOpacity
              onPress={() => setShowTimeDial(!showTimeDial)}
              style={styles.toggleDialBtn}
            >
              <Text style={styles.timeValueBadge}>{getDisplayTime()}</Text>
              <Ionicons
                name={showTimeDial ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.accent}
              />
            </TouchableOpacity>
          </View>

          {showTimeDial && (
            <View style={styles.dialCard}>
              {/* AM / PM Segment Toggle */}
              <View style={styles.ampmRow}>
                <TouchableOpacity
                  style={[styles.ampmBtn, isAm && styles.ampmBtnActive]}
                  onPress={() => setIsAm(true)}
                >
                  <Text style={[styles.ampmBtnText, isAm && styles.ampmBtnTextActive]}>
                    오전 (AM)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.ampmBtn, !isAm && styles.ampmBtnActive]}
                  onPress={() => setIsAm(false)}
                >
                  <Text style={[styles.ampmBtnText, !isAm && styles.ampmBtnTextActive]}>
                    오후 (PM)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Hour Dial Selector (1~12) */}
              <Text style={styles.dialSublabel}>시간 선택</Text>
              <View style={styles.hoursGrid}>
                {HOURS.map((h) => {
                  const isSelected = selectedHour === h;
                  return (
                    <TouchableOpacity
                      key={h}
                      style={[styles.hourCircle, isSelected && styles.hourCircleActive]}
                      onPress={() => setSelectedHour(h)}
                    >
                      <Text
                        style={[
                          styles.hourCircleText,
                          isSelected && styles.hourCircleTextActive,
                        ]}
                      >
                        {h}시
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Minute Dial Selector (00, 15, 30, 45) */}
              <Text style={styles.dialSublabel}>분 선택</Text>
              <View style={styles.minutesRow}>
                {MINUTES.map((m) => {
                  const isSelected = selectedMinute === m;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.minuteBtn,
                        isSelected && styles.minuteBtnActive,
                      ]}
                      onPress={() => setSelectedMinute(m)}
                    >
                      <Text
                        style={[
                          styles.minuteBtnText,
                          isSelected && styles.minuteBtnTextActive,
                        ]}
                      >
                        {m}분
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* 5. Venue / Location with Quick Select Chips */}
          <Text style={styles.label}>장소 설정 *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="상세 장소 (예: CGV 용산아이파크몰 4관)"
            placeholderTextColor={colors.textDisabled}
            value={location}
            onChangeText={setLocation}
          />
          <View style={styles.venueChipsRow}>
            {POPULAR_VENUES.map((v) => (
              <TouchableOpacity
                key={v}
                style={[
                  styles.venueChip,
                  location === v && styles.venueChipActive,
                ]}
                onPress={() => setLocation(v)}
              >
                <Ionicons name="location-outline" size={12} color={colors.accent} />
                <Text
                  style={[
                    styles.venueChipText,
                    location === v && styles.venueChipTextActive,
                  ]}
                >
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 6. Source Link */}
          <Text style={styles.label}>공식 출처 링크 (SNS, 보도자료, 예매처)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="https://..."
            placeholderTextColor={colors.textDisabled}
            value={sourceUrl}
            onChangeText={setSourceUrl}
          />

          {/* 7. Additional Content */}
          <Text style={styles.label}>상세 내용 및 팁</Text>
          <TextInput
            style={[styles.textInput, { minHeight: 70 }]}
            placeholder="참석 예정 배우, 티켓팅 오픈 일정 등 상세 정보를 적어주세요."
            placeholderTextColor={colors.textDisabled}
            multiline
            numberOfLines={3}
            value={content}
            onChangeText={setContent}
          />

          {/* Submit CTA */}
          <Button
            title="일정 제보 등록하기"
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            disabled={!title.trim() || !location.trim()}
            loading={isSubmitting}
            style={{ marginTop: spacing.xl, marginBottom: spacing.huge }}
          />
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
  content: {
    padding: spacing.base,
  },
  noticeBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 6, 65, 0.1)',
    borderRadius: borderRadius.button,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 6, 65, 0.25)',
    marginBottom: spacing.md,
  },
  noticeText: {
    ...typography.caption,
    color: colors.accent,
    flex: 1,
    lineHeight: 18,
  },
  label: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.button,
    padding: spacing.md,
    color: colors.textPrimary,
    ...typography.body2,
    textAlignVertical: 'top',
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.chip,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  typeChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  typeChipTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickDateBtn: {
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickDateBtnText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  timeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  toggleDialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeValueBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    backgroundColor: 'rgba(255, 6, 65, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.chip,
  },
  dialCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginTop: spacing.xs,
  },
  ampmRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  ampmBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.button,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ampmBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  ampmBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  ampmBtnTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  dialSublabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  hoursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  hourCircle: {
    width: '14.5%',
    height: 38,
    borderRadius: borderRadius.button,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  hourCircleActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  hourCircleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  hourCircleTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  minutesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  minuteBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.button,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  minuteBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  minuteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  minuteBtnTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  venueChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.xs,
  },
  venueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  venueChipActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(255, 6, 65, 0.15)',
  },
  venueChipText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  venueChipTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
});
