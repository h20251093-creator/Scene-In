import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View, type DimensionValue } from 'react-native';

export interface KakaoBasicMapProps {
  /** 초기 중심 위도 (기본값: 서울 시청 37.5665) */
  latitude?: number;
  /** 초기 중심 경도 (기본값: 서울 시청 126.978) */
  longitude?: number;
  /** 초기 확대 레벨 (1~14, 숫자가 작을수록 확대, 기본값: 3) */
  level?: number;
  /** 지도 컨테이너 가로 크기 (기본값: '100%') */
  width?: DimensionValue;
  /** 지도 컨테이너 세로 크기 (기본값: 400) */
  height?: DimensionValue;
}

const KAKAO_SDK_SCRIPT_ID = 'kakao-maps-sdk-script';

interface KakaoMapsNamespace {
  load: (callback: () => void) => void;
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (
    container: HTMLElement,
    options: { center: unknown; level: number }
  ) => unknown;
}

const getKakaoMaps = (): KakaoMapsNamespace | undefined => {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { kakao?: { maps?: KakaoMapsNamespace } }).kakao
    ?.maps;
};

/**
 * Expo Web(Platform.OS === 'web') 환경에서 카카오맵 JavaScript SDK를 동적으로 불러와
 * 기본 지도를 렌더링하는 컴포넌트입니다.
 */
export const KakaoBasicMap: React.FC<KakaoBasicMapProps> = ({
  latitude = 37.5665,
  longitude = 126.978,
  level = 3,
  width = '100%',
  height = 400,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const apiKey = process.env.EXPO_PUBLIC_KAKAO_MAP_KEY?.trim();

    if (!apiKey || apiKey.includes('여기에_자바스크립트_키_입력')) {
      console.warn(
        '[KakaoBasicMap] EXPO_PUBLIC_KAKAO_MAP_KEY 환경변수가 설정되어 있지 않습니다.\n' +
          '프로젝트 루트 .env 파일에 EXPO_PUBLIC_KAKAO_MAP_KEY="발급받은_자바스크립트_키"를 설정한 뒤 개발 서버를 재시작해 주세요.'
      );
      return;
    }

    let isMounted = true;

    const initializeMap = () => {
      const kakaoMaps = getKakaoMaps();
      if (!isMounted || !containerRef.current || !kakaoMaps) {
        return;
      }

      kakaoMaps.load(() => {
        const maps = getKakaoMaps();
        if (!isMounted || !containerRef.current || !maps) {
          return;
        }
        const center = new maps.LatLng(latitude, longitude);
        new maps.Map(containerRef.current, {
          center,
          level,
        });
      });
    };

    // 이미 SDK가 로드된 경우 즉시 지도 초기화
    if (getKakaoMaps()) {
      initializeMap();
      return () => {
        isMounted = false;
      };
    }

    // 기존 스크립트 태그 재사용 또는 새로 생성
    let script = document.getElementById(
      KAKAO_SDK_SCRIPT_ID
    ) as HTMLScriptElement | null;

    const handleLoad = () => {
      initializeMap();
    };

    const handleError = () => {
      console.warn(
        '[KakaoBasicMap] 카카오맵 JavaScript SDK를 불러오지 못했습니다. ' +
          'API 키와 카카오디벨로퍼스 웹 플랫폼 도메인(예: http://localhost:8081) 등록 여부를 확인해 주세요.'
      );
    };

    if (!script) {
      script = document.createElement('script');
      script.id = KAKAO_SDK_SCRIPT_ID;
      script.type = 'text/javascript';
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
        apiKey
      )}&autoload=false`;
      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleError);
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleError);
    }

    return () => {
      isMounted = false;
      script?.removeEventListener('load', handleLoad);
      script?.removeEventListener('error', handleError);
    };
  }, [latitude, longitude, level]);

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={[styles.wrapper, { width, height }]}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
});

export default KakaoBasicMap;
