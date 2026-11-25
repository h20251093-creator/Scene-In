export type WorkType = 'drama' | 'movie';

export interface ActorItem {
  id: string;
  name: string;
  character: string;
  avatarUrl?: string;
}

export interface OstItem {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  externalMusicUrl?: string;
}

export interface CostumePropItem {
  id: string;
  name: string;
  category: '의상' | '소품' | '액세서리' | '가구';
  brand: string;
  buyUrl?: string;
  imageUrl?: string;
}

export interface Work {
  id: string;
  title: string;
  type: WorkType;
  posterUrl: string;
  director: string;
  cast: string[];
  totalEpisodes?: number;
  releaseYear: number;
  genre: string[];
  summary: string;
  ottProviders: {
    name: string;
    isAvailable: boolean;
    deepLink?: string;
  }[];
}

export interface Scene {
  id: string;
  workId: string;
  workTitle: string;
  episode: number;
  timeSeconds: number; // For simulator
  timeFormatted: string; // e.g., "12화 34:21"
  title: string;
  stillUrl: string;
  quote?: string;
  description: string;
  actors: ActorItem[];
  ost?: OstItem;
  items: CostumePropItem[];
  filmingLocationId?: string;
  filmingLocationName?: string;
  emotionTag?: string;
}

export interface FilmingLocation {
  id: string;
  workId: string;
  workTitle: string;
  sceneId: string;
  sceneTitle: string;
  name: string;
  address: string;
  region: '서울' | '강원' | '제주' | '경기' | '부산';
  latitude: number;
  longitude: number;
  stillUrl: string;
  description: string;
  tips?: string;
  isVisited?: boolean;
}

export interface Stamp {
  id: string;
  locationId: string;
  locationName: string;
  workTitle: string;
  earnedAt: string;
  photoUri?: string;
}

export interface WorkMission {
  id: string;
  workId: string;
  workTitle: string;
  title: string;
  targetCount: number;
  completedCount: number;
  badgeIcon: string;
}

export interface DrawerCard {
  id: string;
  sceneId: string;
  workTitle: string;
  episode: number;
  timeFormatted: string;
  stillUrl: string;
  quote: string;
  memo: string;
  emotionTag: string;
  tags: string[];
  characterName?: string;
  collectionId?: string;
  createdAt: string;
  isPublic?: boolean;   // 공개 (익명 탐색 DB에 공유) vs 비공개 (나만의 서랍)
  isScraped?: boolean;  // 탐색 탭에서 스크랩한 장면 여부
}

export interface RegisteredSpot {
  id: string;
  name: string;         // 장소 이름
  address: string;      // 상세 위치 및 주소
  workTitle?: string;   // 관련 작품
  registeredAt: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  isPrivate: boolean;
  cardCount: number;
  createdAt: string;
}

export type ShareTemplateType = 'minimal' | 'filmstrip' | 'neon' | 'editorial' | 'polaroid';

export type EventType =
  | 'festival'
  | 'gv'
  | 'stageGreeting'
  | 'premiere'
  | 'actorVisit'
  | 'ottRelease'
  | 'popUp';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time?: string;
  location: string;
  bookingUrl?: string;
  source: string;
  isVerified: boolean;
  relatedWorkTitle?: string;
  relatedPersons?: string[];
  notificationTime?: 'day_of' | '1_day_before' | '1_hour_before' | null;
}

export interface InterestItem {
  id: string;
  name: string;
  type: 'work' | 'actor' | 'director';
  imageUrl: string;
  description?: string;
  isFollowed: boolean;
}

export interface ErrorReport {
  id: string;
  sceneId: string;
  sceneTitle: string;
  category: '배우' | 'OST' | '소품/의상' | '촬영지' | '기타';
  content: string;
  createdAt: string;
  status: '접수완료' | '검토중' | '반영완료';
}

export interface UserEventReport {
  id: string;
  title: string;
  type: EventType;
  date: string;
  location: string;
  sourceUrl: string;
  content: string;
  createdAt: string;
  status: '검증 중' | '승인됨' | '반려됨';
}
