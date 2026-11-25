import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilmingLocation } from '@/src/types';
import { colors } from '@/src/theme';
import type { InteractiveMapViewProps } from './InteractiveMapView.web';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LAT_MIN = 33.1;
const LAT_MAX = 38.4;
const LNG_MIN = 126.0;
const LNG_MAX = 129.6;

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  userCoords,
}) => {
  let NativeMapView: any = null;
  let NativeMarker: any = null;

  try {
    const Maps = require('react-native-maps');
    NativeMapView = Maps.default;
    NativeMarker = Maps.Marker;
  } catch {
    // Fallback to custom dark radar canvas when native maps is unavailable
  }

  if (NativeMapView && NativeMarker) {
    const { darkMapStyle } = require('@/src/theme/mapStyle');
    const initialRegion = {
      latitude: selectedLocation?.latitude || 37.5539,
      longitude: selectedLocation?.longitude || 126.9798,
      latitudeDelta: 0.15,
      longitudeDelta: 0.15,
    };

    return (
      <View style={styles.container}>
        <NativeMapView
          style={StyleSheet.absoluteFillObject}
          customMapStyle={darkMapStyle}
          initialRegion={initialRegion}
          showsUserLocation={!!userCoords}
          showsCompass={false}
        >
          {locations.map((loc) => {
            const isSelected = selectedLocation?.id === loc.id;
            return (
              <NativeMarker
                key={loc.id}
                coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                onPress={() => onSelectLocation(loc)}
              >
                <View
                  style={[
                    styles.customPin,
                    isSelected && styles.customPinSelected,
                  ]}
                >
                  <Ionicons
                    name="film"
                    size={16}
                    color={isSelected ? colors.textInverse : colors.accent}
                  />
                </View>
              </NativeMarker>
            );
          })}
        </NativeMapView>
      </View>
    );
  }

  const getCoordinatesPosition = (lat: number, lng: number) => {
    const paddingX = 40;
    const paddingY = 80;
    const availWidth = SCREEN_WIDTH - paddingX * 2;
    const availHeight = SCREEN_HEIGHT * 0.72 - paddingY * 2;

    const x = paddingX + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * availWidth;
    const y = paddingY + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * availHeight;

    return {
      left: Math.max(16, Math.min(SCREEN_WIDTH - 60, x)),
      top: Math.max(20, y),
    };
  };

  return (
    <View style={styles.canvasContainer}>
      <View style={styles.gridOverlay}>
        <View style={styles.radarRing1} />
        <View style={styles.radarRing2} />
        <View style={styles.radarRing3} />
        <View style={styles.gridLineHorizontal} />
        <View style={styles.gridLineVertical} />
      </View>

      {userCoords && (
        <View
          style={[
            styles.userLocationContainer,
            getCoordinatesPosition(userCoords.latitude, userCoords.longitude),
          ]}
        >
          <View style={styles.userPulse} />
          <View style={styles.userDot} />
          <Text style={styles.userLabel}>내 위치</Text>
        </View>
      )}

      {locations.map((loc) => {
        const isSelected = selectedLocation?.id === loc.id;
        const pos = getCoordinatesPosition(loc.latitude, loc.longitude);

        return (
          <TouchableOpacity
            key={loc.id}
            style={[styles.markerWrapper, pos]}
            onPress={() => onSelectLocation(loc)}
            activeOpacity={0.8}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {isSelected && <View style={styles.selectedMarkerHalo} />}
            <View
              style={[
                styles.markerBubble,
                isSelected
                  ? styles.markerBubbleSelected
                  : styles.markerBubbleDefault,
              ]}
            >
              <Ionicons
                name="film"
                size={16}
                color={isSelected ? colors.textInverse : colors.accent}
              />
            </View>
            <View
              style={[
                styles.markerLabelContainer,
                isSelected && styles.markerLabelContainerSelected,
              ]}
            >
              <Text
                style={[
                  styles.markerLabelText,
                  isSelected && styles.markerLabelTextSelected,
                ]}
                numberOfLines={1}
              >
                {loc.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: colors.surfaceHigh,
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.18,
  },
  radarRing1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  radarRing2: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    borderWidth: 1,
    borderColor: colors.secondaryAccent,
  },
  radarRing3: {
    position: 'absolute',
    width: 540,
    height: 540,
    borderRadius: 270,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  gridLineHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: colors.borderLight,
  },
  gridLineVertical: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: colors.borderLight,
  },
  customPin: {
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  customPinSelected: {
    backgroundColor: colors.accent,
    borderColor: '#FFF',
  },
  userLocationContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  userPulse: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(61, 220, 151, 0.25)',
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  userLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.success,
    marginTop: 2,
  },
  markerWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },
  selectedMarkerHalo: {
    position: 'absolute',
    top: -6,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 196, 81, 0.25)',
  },
  markerBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  markerBubbleDefault: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  markerBubbleSelected: {
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  markerLabelContainer: {
    marginTop: 4,
    backgroundColor: 'rgba(21, 28, 51, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 120,
  },
  markerLabelContainerSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceHigh,
  },
  markerLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  markerLabelTextSelected: {
    color: colors.accent,
    fontWeight: '700',
  },
});
