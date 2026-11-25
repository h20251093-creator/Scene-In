import { MOCK_FILMING_LOCATIONS, MOCK_MISSIONS } from '../data/mockData';
import { FilmingLocation, WorkMission, Stamp, RegisteredSpot } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STAMPS_STORAGE_KEY = '@scenein_stamps';
const SPOTS_STORAGE_KEY = '@scenein_registered_spots';

export const mapService = {
  async getFilmingLocations(): Promise<FilmingLocation[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_FILMING_LOCATIONS]), 150));
  },

  async getLocationById(id: string): Promise<FilmingLocation | null> {
    return new Promise((resolve) => {
      const loc = MOCK_FILMING_LOCATIONS.find((l) => l.id === id) || null;
      setTimeout(() => resolve(loc), 100);
    });
  },

  async getLocationsByWork(workId: string): Promise<FilmingLocation[]> {
    return new Promise((resolve) => {
      const list = MOCK_FILMING_LOCATIONS.filter((l) => l.workId === workId);
      setTimeout(() => resolve(list), 100);
    });
  },

  async getMissions(): Promise<WorkMission[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_MISSIONS]), 100));
  },

  async getEarnedStamps(): Promise<Stamp[]> {
    try {
      const json = await AsyncStorage.getItem(STAMPS_STORAGE_KEY);
      if (json) {
        return JSON.parse(json);
      }
    } catch {
      // ignore
    }
    // Default initial mock stamp
    return [
      {
        id: 'stamp-1',
        locationId: 'loc-1',
        locationName: '남산 백범광장 공원',
        workTitle: '달빛이 머무는 밤',
        earnedAt: '2024-10-15',
        photoUri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
      },
    ];
  },

  async recordStamp(stamp: Omit<Stamp, 'id' | 'earnedAt'>): Promise<Stamp> {
    const existing = await this.getEarnedStamps();
    const newStamp: Stamp = {
      ...stamp,
      id: `stamp-${Date.now()}`,
      earnedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newStamp, ...existing];
    await AsyncStorage.setItem(STAMPS_STORAGE_KEY, JSON.stringify(updated));
    return newStamp;
  },

  async getRegisteredSpots(): Promise<RegisteredSpot[]> {
    try {
      const json = await AsyncStorage.getItem(SPOTS_STORAGE_KEY);
      if (json) {
        return JSON.parse(json);
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'spot-1',
        name: '남산 서울타워 전망대',
        address: '서울특별시 용산구 남산공원길 105',
        workTitle: '달빛이 머무는 밤',
        registeredAt: '2026-11-20',
      },
      {
        id: 'spot-2',
        name: '정동 돌담길 벤치',
        address: '서울특별시 중구 정동길 46',
        workTitle: '너와 나의 시그널',
        registeredAt: '2026-11-21',
      },
    ];
  },

  async registerSpot(spot: Omit<RegisteredSpot, 'id' | 'registeredAt'>): Promise<RegisteredSpot> {
    const existing = await this.getRegisteredSpots();
    const newSpot: RegisteredSpot = {
      ...spot,
      id: `spot-${Date.now()}`,
      registeredAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newSpot, ...existing];
    await AsyncStorage.setItem(SPOTS_STORAGE_KEY, JSON.stringify(updated));
    return newSpot;
  },
};
