import { MOCK_WORKS } from '../data/mockData';
import { Work } from '../types';

export const worksService = {
  async getWorks(): Promise<Work[]> {
    // Simulated network delay
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_WORKS]), 150);
    });
  },

  async getWorkById(id: string): Promise<Work | null> {
    return new Promise((resolve) => {
      const work = MOCK_WORKS.find((w) => w.id === id) || null;
      setTimeout(() => resolve(work), 100);
    });
  },
};
