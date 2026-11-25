import { create } from 'zustand';
import { Work, Scene } from '../types';
import { worksService, sceneService } from '../services';

interface SceneState {
  works: Work[];
  currentWork: Work | null;
  currentScene: Scene | null;
  playbackSeconds: number;
  totalDurationSeconds: number;
  isLoading: boolean;
  error: string | null;

  loadInitialData: () => Promise<void>;
  selectWork: (work: Work) => Promise<void>;
  setPlaybackSeconds: (seconds: number) => Promise<void>;
  selectScene: (scene: Scene) => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  works: [],
  currentWork: null,
  currentScene: null,
  playbackSeconds: 2061, // 34:21 default
  totalDurationSeconds: 4200, // ~70 min default
  isLoading: false,
  error: null,

  loadInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const works = await worksService.getWorks();
      const firstWork = works[0];
      const initialScene = await sceneService.getSceneByPlaybackTime(firstWork.id, 2061);
      set({
        works,
        currentWork: firstWork,
        currentScene: initialScene,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || '데이터 로딩 실패', isLoading: false });
    }
  },

  selectWork: async (work: Work) => {
    set({ currentWork: work, playbackSeconds: 600, isLoading: true });
    try {
      const scene = await sceneService.getSceneByPlaybackTime(work.id, 600);
      set({ currentScene: scene, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setPlaybackSeconds: async (seconds: number) => {
    set({ playbackSeconds: seconds });
    const { currentWork } = get();
    if (currentWork) {
      const scene = await sceneService.getSceneByPlaybackTime(currentWork.id, seconds);
      if (scene) {
        set({ currentScene: scene });
      }
    }
  },

  selectScene: (scene: Scene) => {
    set({ currentScene: scene, playbackSeconds: scene.timeSeconds });
  },
}));
