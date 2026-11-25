// Mock OTT Service Layer — TVING & Wavve 전용
export type OttProvider = 'TVING' | 'Wavve';
export type OttConnectionStatus = 'connected' | 'disconnected';

export interface WatchedItem {
  titleId: string;
  title: string;
  episode: string;
  timestampSec: number;
  totalSec: number;
  progressPct: number;
  ottProvider: OttProvider;
  posterUrl: string;
  location: string;
}

export interface CastMember {
  name: string;
  characterName: string;
  avatarUrl: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_WATCHED_ITEMS: WatchedItem[] = [
  {
    titleId: 'work-goblin',
    title: '쓸쓸하고 찬란하神 – 도깨비',
    episode: '13화',
    timestampSec: 3492,
    totalSec: 4360,
    progressPct: 80,
    ottProvider: 'TVING',
    posterUrl: 'assets/drama-stills/goblin-beach.png',
    location: '영진해변 방사제',
  },
  {
    titleId: 'work-liberation',
    title: '나의 해방일지',
    episode: '02화',
    timestampSec: 3580,
    totalSec: 4120,
    progressPct: 87,
    ottProvider: 'TVING',
    posterUrl: 'assets/drama-stills/liberation-bridge.png',
    location: '성환역, 천안 성환읍 일대',
  },
  {
    titleId: 'work-cloy',
    title: '사랑의 불시착',
    episode: '09화',
    timestampSec: 4060,
    totalSec: 4980,
    progressPct: 82,
    ottProvider: 'Wavve',
    posterUrl: 'assets/drama-stills/cloy-alps.png',
    location: '서귀포 치유의 숲, 충주 비내섬, 영월 봉래산 등',
  },
];

let connectionStatus: OttConnectionStatus = 'connected';

export const ottService = {
  async getConnectionStatus(): Promise<OttConnectionStatus> {
    await delay(320);
    return connectionStatus;
  },

  setConnectionStatus(next: OttConnectionStatus): void {
    connectionStatus = next;
  },

  async getLastWatched(): Promise<WatchedItem | null> {
    await delay(420);
    if (connectionStatus !== 'connected') return null;
    return MOCK_WATCHED_ITEMS[0];
  },

  async getRecentHistory(): Promise<WatchedItem[]> {
    await delay(480);
    if (connectionStatus !== 'connected') return [];
    return MOCK_WATCHED_ITEMS;
  },

  async searchTitle(query: string): Promise<WatchedItem[]> {
    await delay(360);
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_WATCHED_ITEMS;
    return MOCK_WATCHED_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.ottProvider.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
    );
  },

  async getStillCandidates(
    titleId: string,
    _episode: string,
    _timestampSec: number
  ): Promise<string[]> {
    await delay(450);
    if (titleId === 'work-goblin') {
      return [
        'assets/drama-stills/goblin-night.png',
        'assets/drama-stills/goblin-beach.png',
        'assets/drama-stills/goblin-autumn-bench.png',
        'assets/drama-stills/goblin-autumn-smile.png',
        'assets/drama-stills/goblin-scarf.png',
      ];
    }
    if (titleId === 'work-liberation') {
      return [
        'assets/drama-stills/liberation-worship.png',
        'assets/drama-stills/liberation-liked.png',
        'assets/drama-stills/liberation-phone.png',
        'assets/drama-stills/liberation-bridge.png',
      ];
    }
    return [
      'assets/drama-stills/cloy-hug.png',
      'assets/drama-stills/cloy-border.png',
      'assets/drama-stills/cloy-wind.png',
      'assets/drama-stills/cloy-pray.png',
      'assets/drama-stills/cloy-alps.png',
    ];
  },

  async getSubtitleSuggestions(
    titleId: string,
    _episode: string,
    _timestampSec: number
  ): Promise<string[]> {
    await delay(350);
    if (titleId === 'work-goblin') {
      return [
        '너와 함께한 시간 모두 눈부셨다. 날이 좋아서, 날이 좋지 않아서, 날이 적당해서, 모든 날이 좋았다.',
        '사랑해요',
        '질량의 크기는 부피와 비례하지 않는다... 첫사랑이었다',
      ];
    }
    if (titleId === 'work-liberation') {
      return [
        '날 추앙해요 사랑으론 안돼 추앙해요',
        '이것만은 알아둬라 나 너 진짜 좋아했다',
        '보고싶었다. 무진장. 말하고 나니까 진짜같다. 진짜 무지 보고싶었던 것 같다.',
      ];
    }
    return [
      '한 걸음정돈 괜찮갔지',
      '간절히 기다리고 기도하믄 보고싶은 사람 만날수 있냐고 묻지 않있소 만날수 있소',
      '아 떨어진게 아니고 강림이랬나?',
    ];
  },

  async getSceneCast(
    titleId: string,
    _episode: string,
    _timestampSec: number
  ): Promise<CastMember[]> {
    await delay(320);
    if (titleId === 'work-goblin') {
      return [
        { name: '공유', characterName: '김신', avatarUrl: 'assets/drama-stills/goblin-autumn-bench.png' },
        { name: '김고은', characterName: '지은탁', avatarUrl: 'assets/drama-stills/goblin-scarf.png' },
      ];
    }
    if (titleId === 'work-liberation') {
      return [
        { name: '김지원', characterName: '염미정', avatarUrl: 'assets/drama-stills/liberation-worship.png' },
        { name: '손석구', characterName: '구씨', avatarUrl: 'assets/drama-stills/liberation-phone.png' },
      ];
    }
    return [
      { name: '현빈', characterName: '리정혁', avatarUrl: 'assets/drama-stills/cloy-alps.png' },
      { name: '손예진', characterName: '윤세리', avatarUrl: 'assets/drama-stills/cloy-wind.png' },
    ];
  },
};
