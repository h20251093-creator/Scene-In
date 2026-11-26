// Expose Kakao Map API key to window and dynamically load Kakao Maps SDK.
if (typeof window !== 'undefined') {
  const kakaoKey = (process.env.EXPO_PUBLIC_KAKAO_MAP_KEY ?? '').trim();
  const win = window as any;

  win.EXPO_PUBLIC_KAKAO_MAP_KEY = kakaoKey;
  win.__ENV__ = win.__ENV__ || {};
  win.__ENV__.KAKAO_MAP_KEY = kakaoKey;

  const triggerMapInit = () => {
    if (typeof win.__retryInitKakaoMap === 'function') {
      win.__retryInitKakaoMap();
    } else if (typeof win.initKakaoMap === 'function') {
      win.initKakaoMap();
    } else if (typeof win.buildKakaoMap === 'function') {
      win.buildKakaoMap();
    }
  };

  if (kakaoKey && typeof document !== 'undefined') {
    if (win.kakao?.maps?.load) {
      win.kakao.maps.load(triggerMapInit);
    } else {
      const existingScript = document.querySelector(
        'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
      ) as HTMLScriptElement | null;

      if (existingScript) {
        existingScript.addEventListener('load', () => {
          if (win.kakao?.maps?.load) {
            win.kakao.maps.load(triggerMapInit);
          }
        });
      } else {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&libraries=services&appkey=${encodeURIComponent(kakaoKey)}`;
        script.onload = () => {
          if (win.kakao?.maps?.load) {
            win.kakao.maps.load(triggerMapInit);
          }
        };
        document.head.appendChild(script);
      }
    }
  } else {
    triggerMapInit();
  }
}
