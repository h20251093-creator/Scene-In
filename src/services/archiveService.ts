import { MOCK_DRAWER_CARDS, MOCK_COLLECTIONS } from '../data/mockData';
import { DrawerCard, Collection } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CARDS_STORAGE_KEY = '@scenein_drawer_cards';
const COLLECTIONS_STORAGE_KEY = '@scenein_collections';

export const archiveService = {
  async getDrawerCards(): Promise<DrawerCard[]> {
    try {
      const json = await AsyncStorage.getItem(CARDS_STORAGE_KEY);
      if (json) {
        return JSON.parse(json);
      }
    } catch {
      // ignore
    }
    return [...MOCK_DRAWER_CARDS];
  },

  async saveDrawerCard(card: Omit<DrawerCard, 'id' | 'createdAt'>): Promise<DrawerCard> {
    const existing = await this.getDrawerCards();
    const newCard: DrawerCard = {
      ...card,
      id: `card-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newCard, ...existing];
    await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updated));
    return newCard;
  },

  async updateDrawerCard(card: DrawerCard): Promise<void> {
    const existing = await this.getDrawerCards();
    const updated = existing.map((c) => (c.id === card.id ? card : c));
    await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updated));
  },

  async deleteDrawerCard(id: string): Promise<void> {
    const existing = await this.getDrawerCards();
    const updated = existing.filter((c) => c.id !== id);
    await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updated));
  },

  async getCollections(): Promise<Collection[]> {
    try {
      const json = await AsyncStorage.getItem(COLLECTIONS_STORAGE_KEY);
      if (json) {
        return JSON.parse(json);
      }
    } catch {
      // ignore
    }
    return [...MOCK_COLLECTIONS];
  },

  async createCollection(col: Omit<Collection, 'id' | 'createdAt' | 'cardCount'>): Promise<Collection> {
    const existing = await this.getCollections();
    const newCol: Collection = {
      ...col,
      id: `col-${Date.now()}`,
      cardCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newCol, ...existing];
    await AsyncStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(updated));
    return newCol;
  },
};
