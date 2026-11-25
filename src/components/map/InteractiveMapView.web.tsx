import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FilmingLocation } from '@/src/types';
import { colors } from '@/src/theme';
import { KakaoMapView } from './KakaoMapView';

export interface InteractiveMapViewProps {
  locations: FilmingLocation[];
  selectedLocation: FilmingLocation | null;
  onSelectLocation: (loc: FilmingLocation) => void;
  userCoords: { latitude: number; longitude: number } | null;
}

/**
 * Web 전용 지도 컴포넌트:
 * react-native-maps를 import하지 않고 카카오맵 JavaScript SDK 기반 지도를 렌더링합니다.
 */
export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  userCoords,
}) => {
  return (
    <View style={styles.container}>
      <KakaoMapView
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={onSelectLocation}
        initialCenter={userCoords ?? undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
  },
});
