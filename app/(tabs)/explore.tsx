import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { useArchiveStore } from '@/src/store/archiveStore';
import { MOCK_SCENES } from '@/src/data/mockData';
import { Header } from '@/src/components/Header';
import { Chip } from '@/src/components/Chip';
import { EmptyState } from '@/src/components/EmptyState';

const { width } = Dimensions.get('window');

// Curated anonymous public scenes database (영화/드라마 공식 스틸컷 연출)
const PUBLIC_EXPLORE_SCENES = [
  {
    id: 'exp-1',
    sceneId: 'sc-1',
    workTitle: '달빛이 머무는 밤',
    episode: 3,
    timeFormatted: '03화 42:15',
    stillUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&auto=format&fit=crop&q=85',
    quote: '"밤이 깊어질수록, 네 그림자가 더 선명해져."',
    description: '남산 백범광장 야경 아래서 주인공 두 사람이 오랜 오해를 풀고 서로의 마음을 확인하는 공식 명장면 스틸.',
    emotionTag: '설레는',
    tags: ['로맨스', '야경', '고백'],
    characterName: '이강우',
    ottPlatform: 'TVING',
  },
  {
    id: 'exp-2',
    sceneId: 'sc-2',
    workTitle: '너와 나의 시그널',
    episode: 8,
    timeFormatted: '08화 15:30',
    stillUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&auto=format&fit=crop&q=85',
    quote: '"무전은 다시 울릴 거야. 우리가 포기하지 않는 한."',
    description: '비 내리는 공중전화 부스에서 20년 전 무전 신호를 다시 잡기 위해 간절히 기다리는 긴박한 순간의 공식 스틸.',
    emotionTag: '심장 쫄깃한',
    tags: ['스릴러', '무전기', '시간여행'],
    characterName: '차수현',
    ottPlatform: 'Wavve',
  },
  {
    id: 'exp-3',
    sceneId: 'sc-3',
    workTitle: '청춘의 파도',
    episode: 12,
    timeFormatted: '12화 58:20',
    stillUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1000&auto=format&fit=crop&q=85',
    quote: '"파도는 부서져도 바다는 그대로 남아있잖아."',
    description: '강원도 양양 해변에서 마지막 서핑 시합을 마치고 청춘의 방황을 받아들이는 잔잔한 엔딩 시네마 스틸.',
    emotionTag: '여운 깊은',
    tags: ['청춘', '바다', '성장'],
    characterName: '강태양',
    ottPlatform: 'TVING',
  },
  {
    id: 'exp-4',
    sceneId: 'sc-4',
    workTitle: '네온 사일런스',
    episode: 1,
    timeFormatted: '영화 01:23:10',
    stillUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1000&auto=format&fit=crop&q=85',
    quote: '"이 도시엔 침묵만이 가장 확실한 진실이야."',
    description: '비에 젖은 사이버펑크 골목길에서 잠입 요원이 조직의 배후를 밝혀내는 결정적 단서를 포착하는 영화 스틸.',
    emotionTag: '소름 돋는',
    tags: ['느와르', '네온', '추리'],
    characterName: '케이',
    ottPlatform: 'Wavve',
  },
  {
    id: 'exp-5',
    sceneId: 'sc-5',
    workTitle: '마지막 오케스트라',
    episode: 1,
    timeFormatted: '영화 02:04:45',
    stillUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1000&auto=format&fit=crop&q=85',
    quote: '"마지막 음이 끝나는 순간, 비로소 새로운 연주가 시작됩니다."',
    description: '해체 위기의 오케스트라가 폐쇄된 극장에서 촛불만을 켠 채 연주하는 기적 같은 라흐마니노프 피날레 스틸.',
    emotionTag: '가슴 벅찬',
    tags: ['음악', '클래식', '감동'],
    characterName: '윤마에',
    ottPlatform: 'Wavve',
  },
  {
    id: 'exp-6',
    sceneId: 'sc-6',
    workTitle: '도심의 불빛',
    episode: 5,
    timeFormatted: '05화 27:40',
    stillUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1000&auto=format&fit=crop&q=85',
    quote: '"한 번 뱉은 말은 주워 담는 게 아니라 증명하는 거야."',
    description: '스타트업 창업 팀이 마포대교 난간 위에서 위기를 유쾌한 반전으로 뒤집으며 다짐하는 통쾌한 사이다 씬.',
    emotionTag: '유쾌한',
    tags: ['청춘사이다', '통쾌', '성공'],
    characterName: '최민혁',
    ottPlatform: 'TVING',
  },
];

const EMOTION_CHIPS = ['전체', '설레는', '가슴 벅찬', '심장 쫄깃한', '소름 돋는', '유쾌한', '여운 깊은'];

export default function ExploreScreen() {
  const { cards, addCard } = useArchiveStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('전체');
  const [selectedOtt, setSelectedOtt] = useState<'전체' | 'TVING' | 'Wavve'>('전체');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [scrapedIds, setScrapedIds] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check which cards have already been scraped
    const map: Record<string, boolean> = {};
    cards.forEach((c) => {
      if (c.sceneId) {
        map[c.sceneId] = true;
      }
    });
    setScrapedIds(map);
  }, [cards]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleOpenOtt = (ott: string, work: string, time: string) => {
    showToast(`🎬 ${ott} 앱으로 연결: [${work} ${time}] 시점으로 바로 이동합니다.`);
  };

  const handleScrapScene = async (item: typeof PUBLIC_EXPLORE_SCENES[0]) => {
    if (scrapedIds[item.sceneId]) {
      showToast('이미 내 서랍에 보관된 장면입니다.');
      return;
    }

    try {
      await addCard({
        sceneId: item.sceneId,
        workTitle: item.workTitle,
        episode: item.episode,
        timeFormatted: item.timeFormatted,
        stillUrl: item.stillUrl,
        quote: item.quote,
        memo: `[익명 탐색 아카이브 스크랩]\n${item.description}`,
        emotionTag: item.emotionTag,
        tags: item.tags,
        characterName: item.characterName,
        isPublic: false,
        isScraped: true,
      });

      setScrapedIds((prev) => ({ ...prev, [item.sceneId]: true }));
      showToast(ko.explore.scrapSuccess);
    } catch {
      showToast('저장에 실패했습니다.');
    }
  };

  // Filtered public scenes
  const filteredScenes = PUBLIC_EXPLORE_SCENES.filter((s) => {
    const matchesEmotion = selectedEmotion === '전체' || s.emotionTag === selectedEmotion;
    const matchesOtt = selectedOtt === '전체' || s.ottPlatform === selectedOtt;
    const matchesQuery =
      searchQuery.trim() === '' ||
      s.workTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.characterName && s.characterName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesEmotion && matchesOtt && matchesQuery;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <Header
        title={ko.explore.headerTitle}
        subtitle={ko.explore.subtitle}
      />

      <FlatList
        data={filteredScenes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Top Large Hero Search Bar (상단에 검색할 수 있는 창이 크게 배치) */}
            <View style={styles.heroSearchBar}>
              <Ionicons name="search" size={20} color={colors.accent} />
              <TextInput
                style={styles.heroSearchInput}
                placeholder="작품명, 명대사, 배우, 감정을 검색해보세요..."
                placeholderTextColor={colors.textDisabled}
                value={searchQuery}
                onFocus={() => setIsFilterExpanded(true)}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 6 }}>
                  <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[styles.filterToggleBtn, isFilterExpanded && styles.filterToggleBtnActive]}
                onPress={() => setIsFilterExpanded(!isFilterExpanded)}
              >
                <Ionicons
                  name="options-outline"
                  size={16}
                  color={isFilterExpanded ? colors.surface : colors.accent}
                />
                <Text style={[styles.filterToggleText, isFilterExpanded && styles.filterToggleTextActive]}>
                  필터
                </Text>
              </TouchableOpacity>
            </View>

            {/* Interactive Filter Drawer (검색탭 선택 시 여러 필터 노출) */}
            {isFilterExpanded && (
              <View style={styles.filterDrawer}>
                {/* OTT Filter Row */}
                <View style={styles.filterGroup}>
                  <View style={styles.filterGroupHeader}>
                    <Text style={styles.filterGroupTitle}>방영 OTT 플랫폼</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedOtt('전체');
                        setSelectedEmotion('전체');
                        setSearchQuery('');
                      }}
                    >
                      <Text style={styles.resetFilterText}>초기화</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.filterChipRow}>
                    {(['전체', 'TVING', 'Wavve'] as const).map((ott) => {
                      const isSelected = selectedOtt === ott;
                      return (
                        <TouchableOpacity
                          key={ott}
                          style={[styles.filterChip, isSelected && styles.filterChipActive]}
                          onPress={() => setSelectedOtt(ott)}
                        >
                          <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                            {ott === '전체' ? '전체 OTT' : ott}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Emotion Tags */}
                <View style={styles.filterGroup}>
                  <Text style={styles.filterGroupTitle}>감정 분위기 태그</Text>
                  <View style={styles.filterChipRow}>
                    {EMOTION_CHIPS.map((emo) => {
                      const isSelected = selectedEmotion === emo;
                      return (
                        <TouchableOpacity
                          key={emo}
                          style={[styles.filterChip, isSelected && styles.filterChipActive]}
                          onPress={() => setSelectedEmotion(emo)}
                        >
                          <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                            {emo === '전체' ? '전체 감정' : `#${emo}`}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            {/* Section Header (스크롤 유도) */}
            <View style={styles.countRow}>
              <Text style={styles.countText}>
                🔥 지금 뜨는 추천 명장면 (<Text style={styles.countHighlight}>{filteredScenes.length}</Text>개)
              </Text>
              <Text style={styles.scrollGuideText}>아래로 스크롤하여 탐색 ↓</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerNoticeContainer}>
            <View style={styles.footerNoticeHeader}>
              <Ionicons name="shield-checkmark-outline" size={13} color="#8E8A85" />
              <Text style={styles.footerNoticeTitle}>익명 아카이브 서비스 운영 안내</Text>
            </View>
            <Text style={styles.footerNoticeText}>
              SceneIn의 탐색 데이터베이스는 개인 프로필 없이 순수하게 익명으로 안전하게 운영됩니다.{'\n'}
              등록 및 공유된 모든 명장면과 대사는 익명으로 보관되며, 타인에게 프로필 및 개인정보가 일체 노출되지 않습니다.
            </Text>
            <Text style={styles.footerNoticeSub}>
              티빙(TVING) · 웨이브(Wavve) 공식 콘텐츠 메타데이터 연동 • © 2026 SceneIn
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isScraped = scrapedIds[item.sceneId];
          return (
            <View style={styles.sceneCard}>
              {/* Image & Badges */}
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.stillUrl }} style={styles.stillImage} resizeMode="cover" />
                <View style={styles.overlayGradient} />
                
                {/* Anonymous DB Badge & OTT Badge */}
                <View style={styles.anonBadge}>
                  <Ionicons name="eye-off-outline" size={11} color={colors.textPrimary} />
                  <Text style={styles.anonBadgeText}>{ko.explore.anonymousBadge}</Text>
                  <View style={[styles.ottBadgeMini, item.ottPlatform === 'TVING' ? styles.tvingBadge : styles.wavveBadge]}>
                    <Text style={styles.ottBadgeMiniText}>{item.ottPlatform}</Text>
                  </View>
                </View>

                {/* Emotion Badge */}
                <View style={styles.emotionBadge}>
                  <Text style={styles.emotionBadgeText}>#{item.emotionTag}</Text>
                </View>

                {/* Time Badge */}
                <View style={styles.timeBadge}>
                  <Text style={styles.timeBadgeText}>{item.timeFormatted}</Text>
                </View>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                {/* Title and Character */}
                <View style={styles.cardMetaRow}>
                  <Text style={styles.workTitle}>{item.workTitle}</Text>
                  {item.characterName && (
                    <Text style={styles.characterTag}>인물: {item.characterName}</Text>
                  )}
                </View>

                {/* Quote */}
                <Text style={styles.quoteText}>{item.quote}</Text>

                {/* Description */}
                <Text style={styles.descText} numberOfLines={2}>
                  {item.description}
                </Text>

                {/* Tags */}
                <View style={styles.tagsRow}>
                  {item.tags.map((t) => (
                    <Text key={t} style={styles.tagItem}>
                      #{t}
                    </Text>
                  ))}
                </View>

                {/* Action Buttons: OTT 보러가기 + 서랍 저장 */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.ottPlayButton, item.ottPlatform === 'TVING' ? styles.tvingBtnBorder : styles.wavveBtnBorder]}
                    onPress={() => handleOpenOtt(item.ottPlatform, item.workTitle, item.timeFormatted)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="play"
                      size={13}
                      color={item.ottPlatform === 'TVING' ? '#FF143C' : '#0075FF'}
                    />
                    <Text style={[styles.ottPlayButtonText, { color: item.ottPlatform === 'TVING' ? '#FF143C' : '#0075FF' }]}>
                      {item.ottPlatform} 보러가기
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.scrapButton, isScraped && styles.scrapButtonDone]}
                    onPress={() => handleScrapScene(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isScraped ? 'bookmark' : 'bookmark-outline'}
                      size={14}
                      color={isScraped ? colors.textSecondary : colors.surface}
                    />
                    <Text style={[styles.scrapButtonText, isScraped && styles.scrapButtonTextDone]}>
                      {isScraped ? ko.explore.alreadyScraped : ko.explore.scrapToDrawer}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            iconName="search-outline"
            title="조건에 맞는 명장면이 없습니다"
            description="다른 검색어나 감정 태그를 선택해보세요."
            actionTitle="전체 보기"
            onAction={() => {
              setSearchQuery('');
              setSelectedEmotion('전체');
            }}
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
    paddingBottom: 90,
  },
  footerNoticeContainer: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  footerNoticeTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8A85',
    letterSpacing: 0.2,
  },
  footerNoticeText: {
    fontSize: 11,
    lineHeight: 18,
    color: '#8E8A85',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerNoticeSub: {
    fontSize: 10,
    color: '#736E67',
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    ...typography.body2,
  },
  chipsSection: {
    marginBottom: spacing.sm,
  },
  chipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  countRow: {
    paddingVertical: 6,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollGuideText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  heroSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  heroSearchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterToggleBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  filterToggleTextActive: {
    color: colors.surface,
  },
  filterDrawer: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterGroup: {
    marginBottom: 10,
  },
  filterGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  filterGroupTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  resetFilterText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.accent,
  },
  filterChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterChipText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },
  ottBadgeMini: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    marginLeft: 4,
  },
  tvingBadge: {
    backgroundColor: '#FF143C',
  },
  wavveBadge: {
    backgroundColor: '#0075FF',
  },
  ottBadgeMiniText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  ottPlayButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: borderRadius.button,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
  },
  tvingBtnBorder: {
    borderColor: 'rgba(255, 20, 60, 0.3)',
  },
  wavveBtnBorder: {
    borderColor: 'rgba(0, 117, 255, 0.3)',
  },
  ottPlayButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  countText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  countHighlight: {
    color: colors.accent,
    fontWeight: '700',
  },
  sceneCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 190,
    position: 'relative',
    backgroundColor: colors.surfaceHigh,
  },
  stillImage: {
    width: '100%',
    height: '100%',
  },
  overlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(51, 48, 44, 0.15)',
  },
  anonBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
  },
  anonBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emotionBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.chip,
  },
  emotionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.surface,
  },
  timeBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(51, 48, 44, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  timeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFDFC',
  },
  cardBody: {
    padding: spacing.md,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  workTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  characterTag: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  quoteText: {
    ...typography.body1,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  descText: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  tagItem: {
    fontSize: 11,
    color: colors.textDisabled,
    fontWeight: '500',
  },
  scrapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    paddingVertical: 10,
    borderRadius: borderRadius.button,
  },
  scrapButtonDone: {
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scrapButtonText: {
    ...typography.button,
    color: colors.surface,
    fontWeight: '700',
  },
  scrapButtonTextDone: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    left: spacing.base,
    right: spacing.base,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: borderRadius.button,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  toastText: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
