# SCENE-IN (씬인) - 모바일 앱 & 웹 서비스

> 드라마·영화 팬을 위한 "장면 중심" 팬덤 앱  
> **SCENE-IN**: 시청 중인 장면의 공식 정보를 확인하고, 명장면을 기록·공유하며, 팬덤 일정을 챙기고, 촬영지를 지도에서 직접 찾아가 인증하는 원스톱 팬덤 플랫폼.

---

## 1. 주요 특징 및 멀티 디바이스 반응형 지원
- **자동 반응형 화면비율 (Web / App 친화적)**:
  - **스마트폰 (Mobile, ~640px)**: 100vw/100dvh 전체 화면으로 동작하며 군더더기 없는 네이티브 앱 경험 제공.
  - **태블릿 / 패드 (Tablet / iPad, 640px~1024px)**: 2열 반응형 그리드 및 캘린더/서랍 멀티 컬럼 레이아웃.
  - **노트북 / 데스크톱 (Laptop / Desktop, 1024px+)**: 최대 1280px 중앙 정렬 와이드 뷰(지도 분할 뷰, 캘린더 분할 뷰, 3열 명장면 서랍 그리드) 자동 적용.
  - *별도 상단 전환 버튼 없이 접속하는 기기 및 브라우저 화면 너비에 따라 자동으로 완벽한 최적 뷰가 적용됩니다.*
- **메인 탭: 지도 (Scene Map)**:
  - 앱 실행 시 기본 진입 화면.
  - 하단 탭 바 중앙에 살짝 큰 플로팅 앰버 오렌지 원형 버튼으로 강조.
- **Palette B — Minimal & Modern 디자인 시스템**:
  - `#FFFDFC` (웜 화이트 베이스 캔버스), `#F0ECE5` (웜 스톤 서브 서피스), `#E98B26` (비비드 앰버 오렌지 포인트 액센트), `#33302C` (딥 차콜 타이포그래피 & 프레임).
  - 라운드: 카드 16px, 버튼 12px, 칩 20px / 최소 터치 영역 44px 접근성 보장.

---

## 2. 5대 탭 구성 및 상세 기능

| 순서 | 탭 이름 | 아이콘 | 주요 기능 |
|---|---|---|---|
| **1** | **이 장면 뭐야?** | Sparkles | OTT 재생 시간 시뮬레이터(슬라이더), 출연 배우, OST(음원 듣기 & 서랍 보관), 소품/의상(구매처 링크), 촬영지 바로보기, 정보 오류 제보 바텀시트, 추천 장면 |
| **2** | **명장면 서랍** | Bookmark | 상단 '장면기록' 팝업(대표 스틸컷 선택, 작품/회차/명대사/인물/감정태그/메모 등록), 필터 칩(전체/감정별/작품별/인물별), 카드 CRUD, 나만의 컬렉션 관리, 5종 공유 카드 템플릿(미니멀, 필름 스트립, 네온, 에디토리얼, 폴라로이드), OTT 딥링크 |
| **3** | **지도 (메인 탭)** | Map/Pin | 전체 화면 다크 맵, 작품별 핀 필터, 핀 탭 바텀시트(스틸컷/길찾기/서랍저장), 100m 반경 GPS 방문 인증(원본 스틸컷 반투명 오버레이 가이드), 스탬프북 및 작품별 미션, 확장 기능 배지 |
| **4** | **캘린더** | Calendar | 월간 캘린더 ↔ 일정 목록 뷰 전환, 행사 유형별 배지(영화제/GV/무대인사/시사회/배우내한/OTT공개/팝업), 관심 등록(작품/배우/감독 팔로우 필터), 로컬 알림 예약(당일/1일전/1시간전), 일정 제보 폼 |
| **5** | **프로필** | Person | 프로필 헤더(닉네임, 아바타, 한 줄 소개, 저장/스탬프/팔로우 통계), 내 컬렉션, 내 스탬프북, OTT 계정 연동(TVING, Netflix 등), 알림 토글, 위치 권한 안내, 이용약관 |

---

## 3. 실행 방법

### 방법 A: 브라우저에서 인터랙티브 반응형 미리보기 열기 (권장)
프로젝트 루트의 `index.html`을 웹 브라우저로 엽니다.
```bash
# macOS에서 바로 열기
open index.html

# 또는 로컬 웹 서버 구동
npx serve .
```
- 브라우저를 열면 현재 화면 크기(스마트폰 / 태블릿 / 노트북)에 맞춰 레이아웃이 자동으로 전환되어 즉시 체험할 수 있습니다.
- **명장면 서랍**: 상단 우측 및 플로팅 **'장면기록'** 아이콘을 누르면 대표 스틸컷 선택, 작품/회차, 명대사, 인물명, 감정 태그(#설레는, #가슴 벅찬 등), 개인 메모를 등록할 수 있는 팝업이 실행되며 즉시 목록 최상단에 반영됩니다.
- **캘린더**: 화면 우측 상단의 **'일정 제보'** 버튼을 누르면 **시간 다이얼(AM/PM, 1~12시, 00/15/30/45분)** 및 장소 퀵선택 팝업을 바로 테스트할 수 있습니다.

### 방법 B: React Native (Expo) 실행
```bash
# 의존성 설치 (기완료)
npm install

# Expo 웹 모드로 실행
npm run web

# iOS 시뮬레이터 실행 (macOS + Xcode 필요)
npm run ios

# Android 에뮬레이터 실행
npm run android
```

---

## 4. 폴더 구조
```
SceneIn/
├── index.html                   # 노트북/패드/스마트폰 반응형 인터랙티브 미리보기
├── index.ts                     # Expo Router 메인 엔트리
├── package.json                 # 의존성 및 스크립트 설정
├── tsconfig.json                # TypeScript 엄격 모드 및 경로 별칭 (@/*)
├── babel.config.js              # Reanimated 플러그인 포함 Babel 설정
├── app/
│   ├── _layout.tsx              # 전역 루트 스택 레이아웃 & 웹 반응형 컨테이너
│   ├── index.tsx                # 메인 진입 리다이렉트 (/(tabs)/map)
│   └── (tabs)/
│       ├── _layout.tsx          # 5탭 하단 바 (지도 중앙 플로팅 버튼)
│       ├── map.tsx              # [메인] 지도 탭 (다크 맵, 방문인증, 스탬프북)
│       ├── scene-info.tsx       # 이 장면 뭐야? 탭 (OTT 재생 시뮬레이터)
│       ├── archive.tsx          # 명장면 서랍 탭 (컬렉션, 공유 카드)
│       ├── calendar.tsx         # 캘린더 탭 (월간 그리드, 알림 예약, 일정 제보)
│       └── profile.tsx          # 프로필 탭 (통계, OTT 연동, 설정)
└── src/
    ├── theme/                   # 디자인 시스템 토큰
    │   ├── colors.ts            # Palette B: #FFFDFC, #F0ECE5, #E98B26, #33302C
    │   ├── spacing.ts           # 44px 최소 터치 영역, 16px 카드/12px 버튼 라운드
    │   ├── typography.ts        # Pretendard 기반 타이포그래피 스케일
    │   └── mapStyle.ts          # 미니멀 모던 구글 맵 스타일 JSON
    ├── data/
    │   └── mockData.ts          # 5개 가상 작품, 15개 장면, 10개 촬영지, 15개 일정 등
    ├── services/                # API 교체 대비 추상화 서비스 레이어
    │   ├── worksService.ts      # 작품 목록 및 상세
    │   ├── sceneService.ts      # 장면 검색, 시뮬레이터 시간 매칭, 추천 장면
    │   ├── mapService.ts        # 촬영지 좌표, 디지털 스탬프 저장, 순례 미션
    │   ├── archiveService.ts    # 서랍 카드 CRUD, 나만의 컬렉션
    │   ├── calendarService.ts   # 행사 일정 조회, 관심사 팔로우, 알림 관리
    │   └── reportService.ts     # 오류 제보 및 팬덤 일정 제보 로컬 저장
    ├── store/                   # Zustand 상태 관리
    │   ├── sceneStore.ts        # 현재 재생 시점 및 매칭 장면 상태
    │   ├── mapStore.ts          # 선택된 핀, 사용자 GPS 위치, 스탬프 상태
    │   ├── archiveStore.ts      # 카드 필터링, 컬렉션 상태
    │   └── calendarStore.ts     # 캘린더 모드, 날짜 선택, 알림 상태
    ├── components/              # 재사용 공통 컴포넌트
    │   ├── Header.tsx           # 시네마틱 헤더
    │   ├── Chip.tsx             # 44px 터치 영역 필터 칩
    │   ├── Card.tsx             # 16px 라운드 Surface 카드
    │   ├── Button.tsx           # 12px 라운드 크림슨 레드/보더 버튼
    │   ├── BottomSheet.tsx      # 슬라이드업 모달 시트
    │   ├── EmptyState.tsx       # 데이터 없음 안내 컴포넌트
    │   ├── LoadingIndicator.tsx # 크림슨 레드 스피너 로딩 컴포넌트
    │   ├── ErrorMessage.tsx     # 재시도 버튼 포함 에러 배너
    │   ├── Badge.tsx            # 행사 카테고리 태그 뱃지
    │   ├── map/                 # 지도 탭 전용 컴포넌트 (InteractiveMap, BottomSheet, Certification, StampBook)
    │   ├── scene/               # 장면 정보 전용 컴포넌트 (Simulator, DetailCard, ReportSheet, RecList)
    │   ├── archive/             # 서랍 전용 컴포넌트 (CardItem, CreateCard, ShareGenerator, Collections)
    │   ├── calendar/            # 캘린더 전용 컴포넌트 (CalendarView, EventCard, InterestsModal, NotifModal)
    │   └── profile/             # 프로필 전용 컴포넌트 (ProfileHeader, OttLink, Reports, LocationGuide)
    ├── i18n/
    │   └── ko.ts                # 한국어 UI 문자열 단일 관리 사전
    └── types/
        └── index.ts             # Work, Scene, FilmingLocation 등 도메인 타입
```

---

## 5. 추후 백엔드 API 연동 지점 가이드

현재 모든 데이터는 `src/data/mockData.ts`를 바탕으로 `src/services/` 레이어를 통해 비동기 Promise 형태로 반환됩니다. 추후 실제 백엔드(REST API / GraphQL / OTT 연동) 구현 시 아래 지점만 실제 네트워크 통신으로 교체하면 모든 UI 및 Zustand Store와 완벽하게 호환됩니다:

1. **작품 & 장면 API (`src/services/worksService.ts`, `sceneService.ts`)**:
   - `worksService.getWorks()`: `GET /api/v1/works`
   - `sceneService.getSceneByPlaybackTime(workId, timeSeconds)`: `GET /api/v1/works/:id/scenes?timestamp=:seconds`
2. **촬영지 & 스탬프 API (`src/services/mapService.ts`)**:
   - `mapService.getFilmingLocations()`: `GET /api/v1/locations`
   - `mapService.recordStamp(stamp)`: `POST /api/v1/stamps` (GPS 검증 후 발급)
3. **명장면 서랍 API (`src/services/archiveService.ts`)**:
   - `archiveService.getDrawerCards()`: `GET /api/v1/archive/cards`
   - `archiveService.saveDrawerCard(card)`: `POST /api/v1/archive/cards`
   - `archiveService.createCollection(col)`: `POST /api/v1/archive/collections`
4. **캘린더 & 제보 API (`src/services/calendarService.ts`, `reportService.ts`)**:
   - `calendarService.getAllEvents()`: `GET /api/v1/events`
   - `calendarService.setEventNotification()`: Push Notification 서버 토큰 등록
   - `reportService.submitErrorReport()`, `submitEventReport()`: `POST /api/v1/reports`
