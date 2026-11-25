import { create } from 'zustand';
import { DrawerCard, Collection } from '../types';
import { archiveService } from '../services';

type FilterType = 'all' | 'emotion' | 'work' | 'person';

interface ArchiveState {
  cards: DrawerCard[];
  collections: Collection[];
  activeFilter: FilterType;
  selectedEmotion: string | null;
  selectedWork: string | null;
  selectedPerson: string | null;
  selectedCollectionId: string | null;
  isLoading: boolean;
  error: string | null;

  loadArchiveData: () => Promise<void>;
  setActiveFilter: (filter: FilterType) => void;
  setSelectedEmotion: (emotion: string | null) => void;
  setSelectedWork: (work: string | null) => void;
  setSelectedPerson: (person: string | null) => void;
  setSelectedCollectionId: (colId: string | null) => void;
  addCard: (card: Omit<DrawerCard, 'id' | 'createdAt'>) => Promise<DrawerCard>;
  updateCard: (card: DrawerCard) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  createCollection: (col: Omit<Collection, 'id' | 'createdAt' | 'cardCount'>) => Promise<Collection>;
}

export const useArchiveStore = create<ArchiveState>((set, get) => ({
  cards: [],
  collections: [],
  activeFilter: 'all',
  selectedEmotion: null,
  selectedWork: null,
  selectedPerson: null,
  selectedCollectionId: null,
  isLoading: false,
  error: null,

  loadArchiveData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [cards, collections] = await Promise.all([
        archiveService.getDrawerCards(),
        archiveService.getCollections(),
      ]);
      set({ cards, collections, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setSelectedEmotion: (emotion) => set({ selectedEmotion: emotion }),
  setSelectedWork: (work) => set({ selectedWork: work }),
  setSelectedPerson: (person) => set({ selectedPerson: person }),
  setSelectedCollectionId: (colId) => set({ selectedCollectionId: colId }),

  addCard: async (card) => {
    const newCard = await archiveService.saveDrawerCard(card);
    const updated = await archiveService.getDrawerCards();
    set({ cards: updated });
    return newCard;
  },

  updateCard: async (card) => {
    await archiveService.updateDrawerCard(card);
    const updated = await archiveService.getDrawerCards();
    set({ cards: updated });
  },

  deleteCard: async (id) => {
    await archiveService.deleteDrawerCard(id);
    const updated = await archiveService.getDrawerCards();
    set({ cards: updated });
  },

  createCollection: async (col) => {
    const newCol = await archiveService.createCollection(col);
    const updated = await archiveService.getCollections();
    set({ collections: updated });
    return newCol;
  },
}));
