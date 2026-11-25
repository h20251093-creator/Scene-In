import { MOCK_SCENES } from '../data/mockData';
import { Scene } from '../types';

export const sceneService = {
  async getAllScenes(): Promise<Scene[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_SCENES]), 150));
  },

  async getScenesByWorkId(workId: string): Promise<Scene[]> {
    return new Promise((resolve) => {
      const scenes = MOCK_SCENES.filter((s) => s.workId === workId);
      setTimeout(() => resolve(scenes), 100);
    });
  },

  async getSceneById(id: string): Promise<Scene | null> {
    return new Promise((resolve) => {
      const scene = MOCK_SCENES.find((s) => s.id === id) || null;
      setTimeout(() => resolve(scene), 100);
    });
  },

  /**
   * For the OTT simulator: finds the scene closest to current playback seconds
   */
  async getSceneByPlaybackTime(workId: string, timeSeconds: number): Promise<Scene | null> {
    const scenes = MOCK_SCENES.filter((s) => s.workId === workId);
    if (!scenes.length) return null;

    // Pick the closest scene by timeSeconds difference
    let closest = scenes[0];
    let minDiff = Math.abs(closest.timeSeconds - timeSeconds);

    for (const scene of scenes) {
      const diff = Math.abs(scene.timeSeconds - timeSeconds);
      if (diff < minDiff) {
        minDiff = diff;
        closest = scene;
      }
    }
    return closest;
  },

  async getRecommendedScenes(currentSceneId: string): Promise<Scene[]> {
    return new Promise((resolve) => {
      const others = MOCK_SCENES.filter((s) => s.id !== currentSceneId);
      setTimeout(() => resolve(others.slice(0, 5)), 120);
    });
  },
};
