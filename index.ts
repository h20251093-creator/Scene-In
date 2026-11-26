import 'expo-router/entry';

// Expose Kakao Map API key to the global window object for index.html checks.
if (typeof window !== 'undefined') {
  // Expo will replace the placeholder with the actual value at build time.
  const kakaoKey = process.env.EXPO_PUBLIC_KAKAO_MAP_KEY ?? '';
  // Direct key for scripts that look for this variable.
  (window as any).EXPO_PUBLIC_KAKAO_MAP_KEY = kakaoKey;
  // Some legacy checks use __ENV__.KAKAO_MAP_KEY.
  (window as any).__ENV__ = (window as any).__ENV__ || {};
  (window as any).__ENV__.KAKAO_MAP_KEY = kakaoKey;
}

