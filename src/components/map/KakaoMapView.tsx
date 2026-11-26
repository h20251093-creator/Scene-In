import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilmingLocation } from '@/src/types';
import { borderRadius, colors, spacing, typography } from '@/src/theme';

export interface KakaoMapViewProps {
  locations?: FilmingLocation[];
  selectedLocation?: FilmingLocation | null;
  onSelectLocation?: (loc: FilmingLocation) => void;
  initialCenter?: { latitude: number; longitude: number };
  level?: number;
  style?: StyleProp<ViewStyle>;
}

type MapErrorType = 'API_KEY_REQUIRED' | 'SDK_LOAD_FAILED' | 'MAP_INIT_ERROR';

const KAKAO_SDK_SCRIPT_ID = 'kakao-map-sdk';
const DEFAULT_CENTER = { latitude: 37.5539, longitude: 126.9798 };

declare global {
  interface Window {
    kakao?: any;
  }
}

export const KakaoMapView: React.FC<KakaoMapViewProps> = ({
  locations = [],
  selectedLocation = null,
  onSelectLocation,
  initialCenter = DEFAULT_CENTER,
  level = 6,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const onSelectLocationRef = useRef(onSelectLocation);
  onSelectLocationRef.current = onSelectLocation;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<MapErrorType | null>(null);
  const [retryTick, setRetryTick] = useState<number>(0);

  const kakaoApiKey = (
    process.env.EXPO_PUBLIC_KAKAO_MAP_KEY ||
    (typeof window !== 'undefined' &&
      ((window as any).__ENV__?.KAKAO_MAP_KEY ||
        (window as any).EXPO_PUBLIC_KAKAO_MAP_KEY)) ||
    ''
  ).trim();
  const isKeyConfigured =
    kakaoApiKey.length > 0 &&
    !kakaoApiKey.includes('여기에_자바스크립트_키_입력');

  const syncMarkers = useCallback((map: any, items: FilmingLocation[]) => {
    if (!map || typeof window === 'undefined' || !window.kakao?.maps) {
      return;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    items.forEach((loc) => {
      const markerPosition = new window.kakao.maps.LatLng(
        loc.latitude,
        loc.longitude
      );
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        title: loc.name,
      });

      marker.setMap(map);

      window.kakao.maps.event.addListener(marker, 'click', () => {
        onSelectLocationRef.current?.(loc);
      });

      markersRef.current.push(marker);
    });
  }, []);

  useEffect(() => {
    if (
      Platform.OS !== 'web' ||
      typeof window === 'undefined' ||
      typeof document === 'undefined'
    ) {
      setIsLoading(false);
      return;
    }

    if (!isKeyConfigured) {
      console.warn(
        '[SceneIn - KakaoMap] EXPO_PUBLIC_KAKAO_MAP_KEY 환경변수가 설정되지 않았습니다.\n' +
          '프로젝트 루트 .env 파일에 EXPO_PUBLIC_KAKAO_MAP_KEY="발급받은_자바스크립트_키"를 설정한 뒤 개발 서버를 재시작해 주세요.\n' +
          '카카오디벨로퍼스 웹 플랫폼 등록 주소: http://localhost:8081'
      );
      setIsLoading(false);
      setLoadError('API_KEY_REQUIRED');
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    const initMap = () => {
      if (!isMounted || !containerRef.current || !window.kakao?.maps) {
        return;
      }

      try {
        const centerLat = selectedLocation?.latitude ?? initialCenter.latitude;
        const centerLng = selectedLocation?.longitude ?? initialCenter.longitude;

        const map = new window.kakao.maps.Map(containerRef.current, {
          center: new window.kakao.maps.LatLng(centerLat, centerLng),
          level,
        });

        mapInstanceRef.current = map;
        syncMarkers(map, locations);
        setIsLoading(false);
        setLoadError(null);
      } catch (err) {
        console.error('[SceneIn - KakaoMap] 지도 초기화 중 오류가 발생했습니다:', err);
        setLoadError('MAP_INIT_ERROR');
        setIsLoading(false);
      }
    };

    const loadMapsFromSdk = () => {
      if (!window.kakao?.maps?.load) {
        console.error(
          '[SceneIn - KakaoMap] 카카오맵 SDK 객체(window.kakao.maps)를 찾을 수 없습니다. ' +
            'API 키와 웹 플랫폼 도메인(http://localhost:8081) 등록 여부를 확인해 주세요.'
        );
        if (isMounted) {
          setLoadError('SDK_LOAD_FAILED');
          setIsLoading(false);
        }
        return;
      }
      window.kakao.maps.load(initMap);
    };

    if (window.kakao?.maps) {
      loadMapsFromSdk();
      return () => {
        isMounted = false;
      };
    }

    const handleScriptLoad = () => {
      if (!isMounted) return;
      loadMapsFromSdk();
    };

    const handleScriptError = () => {
      console.error(
        '[SceneIn - KakaoMap] 카카오맵 JavaScript SDK 로드에 실패했습니다.\n' +
          '1) .env의 EXPO_PUBLIC_KAKAO_MAP_KEY가 유효한 JavaScript 키인지 확인해 주세요.\n' +
          '2) 카카오디벨로퍼스 > 앱 설정 > 플랫폼 > Web 사이트 도메인에 현재 주소(예: http://localhost:8081)가 등록되어 있는지 확인해 주세요.'
      );
      if (isMounted) {
        setLoadError('SDK_LOAD_FAILED');
        setIsLoading(false);
      }
    };

    let script = document.getElementById(
      KAKAO_SDK_SCRIPT_ID
    ) as HTMLScriptElement | null;

    // 재시도 시 기존 실패 스크립트를 교체
    if (script && retryTick > 0) {
      script.remove();
      script = null;
    }

    if (!script) {
      script = document.createElement('script');
      script.id = KAKAO_SDK_SCRIPT_ID;
      script.type = 'text/javascript';
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
        kakaoApiKey
      )}&autoload=false`;
      script.addEventListener('load', handleScriptLoad);
      script.addEventListener('error', handleScriptError);
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', handleScriptLoad);
      script.addEventListener('error', handleScriptError);
    }

    return () => {
      isMounted = false;
      script?.removeEventListener('load', handleScriptLoad);
      script?.removeEventListener('error', handleScriptError);
    };
  }, [isKeyConfigured, kakaoApiKey, retryTick]);

  // 위치 목록(검색/필터 결과)이 바뀔 때 마커 갱신
  useEffect(() => {
    if (mapInstanceRef.current) {
      syncMarkers(mapInstanceRef.current, locations);
    }
  }, [locations, syncMarkers]);

  // 선택된 장소가 바뀔 때 지도 중심 이동
  useEffect(() => {
    if (
      mapInstanceRef.current &&
      selectedLocation &&
      typeof window !== 'undefined' &&
      window.kakao?.maps
    ) {
      const moveLatLon = new window.kakao.maps.LatLng(
        selectedLocation.latitude,
        selectedLocation.longitude
      );
      mapInstanceRef.current.panTo(moveLatLon);
    }
  }, [selectedLocation]);

  const handleRetry = () => {
    setRetryTick((prev) => prev + 1);
  };

  if (Platform.OS !== 'web') {
    return null;
  }

  if (!isKeyConfigured || loadError) {
    const isKeyError = !isKeyConfigured || loadError === 'API_KEY_REQUIRED';

    return (
      <View style={[styles.container, style]}>
        <View style={styles.fallbackBox}>
          <View style={styles.badgeWrapper}>
            <Ionicons
              name={isKeyError ? 'key-outline' : 'alert-circle-outline'}
              size={28}
              color={colors.accent}
            />
          </View>
          <Text style={styles.fallbackTitle}>
            {isKeyError
              ? '카카오맵 API 키 설정이 필요합니다'
              : '카카오맵을 불러오지 못했습니다'}
          </Text>
          <Text style={styles.fallbackDesc}>
            {isKeyError
              ? '루트 폴더의 .env 파일에 EXPO_PUBLIC_KAKAO_MAP_KEY를 입력한 뒤\nExpo 웹 서버를 재시작하면 지도가 표시됩니다.'
              : '네트워크 연결 또는 카카오디벨로퍼스 웹 플랫폼 도메인 등록 상태를\n확인한 뒤 다시 시도해 주세요.'}
          </Text>

          <View style={styles.guideCard}>
            <Text style={styles.guideTitle}>확인 사항</Text>
            <Text style={styles.guideText}>
              1. <Text style={styles.codeText}>.env</Text> 파일의{' '}
              <Text style={styles.codeText}>EXPO_PUBLIC_KAKAO_MAP_KEY</Text> 확인{'\n'}
              2. 카카오디벨로퍼스 Web 플랫폼 도메인 등록:{'\n'}
              <Text style={styles.urlText}>http://localhost:8081</Text>
            </Text>
          </View>

          {!isKeyError && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={16} color={colors.textInverse} />
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
          position: 'relative',
        }}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.loadingText}>카카오맵을 불러오는 중...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    minHeight: 400,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    position: 'relative',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 18, 36, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textSecondary,
  },
  fallbackBox: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  badgeWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(233, 139, 38, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  fallbackTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  fallbackDesc: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  guideCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surfaceHigh,
    padding: spacing.md,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  guideText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  codeText: {
    fontWeight: '700',
    color: colors.accent,
  },
  urlText: {
    fontWeight: '700',
    color: '#0075FF',
  },
  retryButton: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textInverse,
  },
});

export default KakaoMapView;
