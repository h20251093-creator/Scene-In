// 웹/SSR 번들러가 react-native-maps를 절대 추적하지 않도록 기본 엔트리는 웹 안전 구현을 export합니다.
// iOS/Android 네이티브 빌드에서는 Metro가 자동으로 InteractiveMapView.native.tsx를 선택합니다.
export {
  InteractiveMapView,
  type InteractiveMapViewProps,
} from './InteractiveMapView.web';
