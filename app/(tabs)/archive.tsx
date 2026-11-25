import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { DrawerCard } from '@/src/types';
import { useArchiveStore } from '@/src/store/archiveStore';
import { MOCK_WORKS } from '@/src/data/mockData';
import { Header } from '@/src/components/Header';
import { Chip } from '@/src/components/Chip';
import { EmptyState } from '@/src/components/EmptyState';
import { LoadingIndicator } from '@/src/components/LoadingIndicator';
import { ErrorMessage } from '@/src/components/ErrorMessage';
import { DrawerCardItem } from '@/src/components/archive/DrawerCardItem';
import { CreateCardModal } from '@/src/components/archive/CreateCardModal';
import { CreateCollectionModal } from '@/src/components/archive/CreateCollectionModal';
import { ShareCardGeneratorModal } from '@/src/components/archive/ShareCardGeneratorModal';
import { CollectionsSection } from '@/src/components/archive/CollectionsSection';

const EMOTIONS = [
  '설레는',
  '가슴 벅찬',
  '눈물 나는',
  '심장 쫄깃한',
  '소름 돋는',
  '유쾌한',
  '여운 깊은',
];

const PERSONS = ['차은호', '윤서아', '한도경', '강해솔', '마에스트로 유진', '케이'];

export default function ArchiveScreen() {
  const {
    cards,
    collections,
    activeFilter,
    selectedEmotion,
    selectedWork,
    selectedPerson,
    selectedCollectionId,
    isLoading,
    error,
    loadArchiveData,
    setActiveFilter,
    setSelectedEmotion,
    setSelectedWork,
    setSelectedPerson,
    setSelectedCollectionId,
    addCard,
    updateCard,
    deleteCard,
    createCollection,
  } = useArchiveStore();

  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<DrawerCard | null>(null);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [sharingCard, setSharingCard] = useState<DrawerCard | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [drawerSection, setDrawerSection] = useState<'my' | 'scraped'>('my');

  useEffect(() => {
    loadArchiveData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleEditCard = (card: DrawerCard) => {
    setEditingCard(card);
    setIsCreateCardOpen(true);
  };

  const handleDeleteCard = (id: string) => {
    Alert.alert('장면 삭제', '이 명장면 카드를 서랍에서 삭제하시겠습니까?', [
      { text: ko.common.cancel, style: 'cancel' },
      {
        text: ko.common.delete,
        style: 'destructive',
        onPress: async () => {
          await deleteCard(id);
          showToast('명장면이 서랍에서 삭제되었습니다.');
        },
      },
    ]);
  };

  const handleSaveCard = async (
    cardData: Omit<DrawerCard, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId && editingCard) {
      await updateCard({
        ...editingCard,
        ...cardData,
      });
      showToast('명장면 카드가 수정되었습니다.');
    } else {
      await addCard(cardData);
      showToast('새 명장면이 서랍에 저장되었습니다.');
    }
  };

  // Counts for each section
  const myCardsCount = cards.filter((c) => !c.isScraped).length;
  const scrapedCardsCount = cards.filter((c) => c.isScraped).length;

  // Filter cards by segment, subchip, and collection
  const filteredCards = cards.filter((card) => {
    // 1. Separate by Section: 'my' (내가 만든것들만 모아둠) vs 'scraped' (탐색에서 저장한 것들)
    if (drawerSection === 'my' && card.isScraped) return false;
    if (drawerSection === 'scraped' && !card.isScraped) return false;

    if (selectedCollectionId && card.collectionId !== selectedCollectionId) {
      return false;
    }

    if (activeFilter === 'emotion' && selectedEmotion) {
      return card.emotionTag === selectedEmotion;
    }
    if (activeFilter === 'work' && selectedWork) {
      return card.workTitle === selectedWork;
    }
    if (activeFilter === 'person' && selectedPerson) {
      return (
        card.characterName === selectedPerson ||
        card.tags.includes(selectedPerson)
      );
    }
    return true;
  });

  if (isLoading && cards.length === 0) {
    return <LoadingIndicator fullScreen message="명장면 서랍을 여는 중입니다..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadArchiveData} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header
        title={ko.archive.headerTitle}
        subtitle={
          drawerSection === 'my'
            ? `내가 기록한 명장면 ${myCardsCount}개`
            : `탐색에서 스크랩한 명장면 ${scrapedCardsCount}개`
        }
        rightAction={{
          iconName: 'bookmark-outline',
          label: ko.archive.recordScene,
          onPress: () => {
            setEditingCard(null);
            setIsCreateCardOpen(true);
          },
        }}
      />

      <FlatList
        data={filteredCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DrawerCardItem
            card={item}
            onEdit={handleEditCard}
            onDelete={handleDeleteCard}
            onShare={(c) => setSharingCard(c)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* 2 Dedicated Drawer Sections: My Records vs Scraped from Explore */}
            <View style={styles.sectionToggleBar}>
              <TouchableOpacity
                style={[
                  styles.sectionToggleBtn,
                  drawerSection === 'my' && styles.sectionToggleBtnActive,
                ]}
                onPress={() => setDrawerSection('my')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="create-outline"
                  size={15}
                  color={drawerSection === 'my' ? colors.textInverse : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.sectionToggleText,
                    drawerSection === 'my' && styles.sectionToggleTextActive,
                  ]}
                >
                  내가 기록한 장면 ({myCardsCount})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sectionToggleBtn,
                  drawerSection === 'scraped' && styles.sectionToggleBtnActive,
                ]}
                onPress={() => setDrawerSection('scraped')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="download-outline"
                  size={15}
                  color={drawerSection === 'scraped' ? colors.textInverse : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.sectionToggleText,
                    drawerSection === 'scraped' && styles.sectionToggleTextActive,
                  ]}
                >
                  탐색 스크랩 ({scrapedCardsCount})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Collections Carousel */}
            <CollectionsSection
              collections={collections}
              selectedCollectionId={selectedCollectionId}
              onSelectCollection={setSelectedCollectionId}
              onCreateCollection={() => setIsCreateCollectionOpen(true)}
            />

            {/* Primary Filter Segment Chips */}
            <View style={styles.filtersSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.segmentChipsRow}
              >
                <Chip
                  label={ko.archive.filterAll}
                  selected={activeFilter === 'all'}
                  onPress={() => {
                    setActiveFilter('all');
                    setSelectedEmotion(null);
                    setSelectedWork(null);
                    setSelectedPerson(null);
                  }}
                  count={cards.length}
                />
                <Chip
                  label={ko.archive.filterEmotion}
                  selected={activeFilter === 'emotion'}
                  onPress={() => {
                    setActiveFilter('emotion');
                    if (!selectedEmotion) setSelectedEmotion(EMOTIONS[0]);
                  }}
                />
                <Chip
                  label={ko.archive.filterWork}
                  selected={activeFilter === 'work'}
                  onPress={() => {
                    setActiveFilter('work');
                    if (!selectedWork) setSelectedWork(MOCK_WORKS[0].title);
                  }}
                />
                <Chip
                  label={ko.archive.filterPerson}
                  selected={activeFilter === 'person'}
                  onPress={() => {
                    setActiveFilter('person');
                    if (!selectedPerson) setSelectedPerson(PERSONS[0]);
                  }}
                />
              </ScrollView>

              {/* Sub-chips based on active filter */}
              {activeFilter === 'emotion' && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.subChipsRow}
                >
                  {EMOTIONS.map((emo) => (
                    <TouchableOpacity
                      key={emo}
                      style={[
                        styles.subChip,
                        selectedEmotion === emo && styles.subChipActive,
                      ]}
                      onPress={() => setSelectedEmotion(emo)}
                    >
                      <Text
                        style={[
                          styles.subChipText,
                          selectedEmotion === emo && styles.subChipTextActive,
                        ]}
                      >
                        #{emo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {activeFilter === 'work' && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.subChipsRow}
                >
                  {MOCK_WORKS.map((work) => (
                    <TouchableOpacity
                      key={work.id}
                      style={[
                        styles.subChip,
                        selectedWork === work.title && styles.subChipActive,
                      ]}
                      onPress={() => setSelectedWork(work.title)}
                    >
                      <Text
                        style={[
                          styles.subChipText,
                          selectedWork === work.title && styles.subChipTextActive,
                        ]}
                      >
                        {work.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {activeFilter === 'person' && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.subChipsRow}
                >
                  {PERSONS.map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.subChip,
                        selectedPerson === p && styles.subChipActive,
                      ]}
                      onPress={() => setSelectedPerson(p)}
                    >
                      <Text
                        style={[
                          styles.subChipText,
                          selectedPerson === p && styles.subChipTextActive,
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            iconName="bookmark-outline"
            title="저장된 명장면이 없습니다"
            description={ko.archive.emptyArchive}
            actionTitle="첫 명장면 직접 추가하기"
            onAction={() => {
              setEditingCard(null);
              setIsCreateCardOpen(true);
            }}
          />
        }
      />

      {/* Floating Action Button to Record Scene */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingCard(null);
          setIsCreateCardOpen(true);
        }}
        activeOpacity={0.85}
        accessibilityLabel="장면기록"
      >
        <Ionicons name="bookmark" size={26} color={colors.textInverse} />
      </TouchableOpacity>

      {/* Toast Notification */}
      {toastMessage && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Create / Edit Card Modal */}
      <CreateCardModal
        visible={isCreateCardOpen}
        editingCard={editingCard}
        onClose={() => {
          setIsCreateCardOpen(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
      />

      {/* Create Collection Modal */}
      <CreateCollectionModal
        visible={isCreateCollectionOpen}
        onClose={() => setIsCreateCollectionOpen(false)}
        onSave={async (colData) => {
          await createCollection(colData);
          showToast('새 컬렉션이 생성되었습니다.');
        }}
      />

      {/* Share Card Generator Modal */}
      <ShareCardGeneratorModal
        visible={!!sharingCard}
        card={sharingCard}
        onClose={() => setSharingCard(null)}
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
  sectionToggleBar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceHigh,
    borderRadius: borderRadius.button,
    padding: 4,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sectionToggleBtnActive: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionToggleText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sectionToggleTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  filtersSection: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  segmentChipsRow: {
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  subChipsRow: {
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  subChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subChipActive: {
    backgroundColor: 'rgba(245, 196, 81, 0.2)',
    borderColor: colors.accent,
  },
  subChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  subChipTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 90,
  },
  toast: {
    position: 'absolute',
    bottom: 84,
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
