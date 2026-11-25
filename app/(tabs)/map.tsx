import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, spacing, typography, borderRadius } from '@/src/theme';
import { ko } from '@/src/i18n/ko';
import { FilmingLocation } from '@/src/types';
import { useMapStore } from '@/src/store/mapStore';
import { useArchiveStore } from '@/src/store/archiveStore';
import { MOCK_WORKS } from '@/src/data/mockData';
import { Chip } from '@/src/components/Chip';
import { LoadingIndicator } from '@/src/components/LoadingIndicator';
import { ErrorMessage } from '@/src/components/ErrorMessage';
import { InteractiveMapView } from '@/src/components/map/InteractiveMapView';
import { LocationBottomSheet } from '@/src/components/map/LocationBottomSheet';
import { VisitCertificationModal } from '@/src/components/map/VisitCertificationModal';
import { StampBookModal } from '@/src/components/map/StampBookModal';
import { RegisterSpotModal } from '@/src/components/map/RegisterSpotModal';

export default function MapScreen() {
  const {
    locations,
    selectedLocation,
    selectedWorkId,
    searchQuery,
    userCoords,
    stamps,
    missions,
    registeredSpots,
    isBottomSheetOpen,
    isStampBookOpen,
    isCertificationModalOpen,
    isRegisterSpotModalOpen,
    isLoading,
    error,
    loadMapData,
    setSelectedLocation,
    setSelectedWorkId,
    setSearchQuery,
    setUserCoords,
    setPermissionGranted,
    openBottomSheet,
    closeBottomSheet,
    setStampBookOpen,
    setCertificationModalOpen,
    setRegisterSpotModalOpen,
    certifyCurrentLocation,
    registerSpot,
  } = useMapStore();

  const { addCard } = useArchiveStore();
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    loadMapData();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserCoords({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } else {
        // Fallback to simulated Seoul location for testing
        setPermissionGranted(true);
        setUserCoords({ latitude: 37.5539, longitude: 126.9798 });
      }
    } catch {
      setPermissionGranted(true);
      setUserCoords({ latitude: 37.5539, longitude: 126.9798 });
    }
  };

  const displayToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  // Filter locations by search query and work filter chip
  const filteredLocations = locations.filter((loc) => {
    const matchesWork = selectedWorkId === 'all' || loc.workId === selectedWorkId;
    const matchesSearch =
      searchQuery.trim() === '' ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.workTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWork && matchesSearch;
  });

  const handleSelectLocation = (loc: FilmingLocation) => {
    openBottomSheet(loc);
  };

  const handleSaveToArchive = async (loc: FilmingLocation) => {
    await addCard({
      sceneId: loc.sceneId,
      workTitle: loc.workTitle,
      episode: 1,
      timeFormatted: '촬영지',
      stillUrl: loc.stillUrl,
      quote: `"${loc.name} - ${loc.sceneTitle}"`,
      memo: `촬영지 방문 예정: ${loc.address}`,
      emotionTag: '설레는',
      tags: [loc.region, '촬영지'],
    });
    displayToast(ko.sceneInfo.savedSuccess);
  };

  const handleStartCertification = (loc: FilmingLocation) => {
    closeBottomSheet();
    setCertificationModalOpen(true);
  };

  const handleCompleteCertification = async (photoUri?: string) => {
    const newStamp = await certifyCurrentLocation(photoUri);
    if (newStamp) {
      displayToast(ko.map.stampEarned);
    }
  };

  if (isLoading) {
    return <LoadingIndicator fullScreen message="촬영지 지도를 불러오는 중입니다..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadMapData} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Search Header Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={ko.map.searchPlaceholder}
            placeholderTextColor={colors.textDisabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Quick Spot Register Button (장소와 이름만 등록) */}
        <TouchableOpacity
          style={styles.registerSpotButton}
          onPress={() => setRegisterSpotModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color={colors.surface} />
          <Text style={styles.registerSpotText}>{ko.map.registerSpot}</Text>
        </TouchableOpacity>

        {/* Stamp Book Access Button */}
        <TouchableOpacity
          style={styles.stampBookButton}
          onPress={() => setStampBookOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="ribbon" size={20} color={colors.accent} />
          {stamps.length > 0 && (
            <View style={styles.stampBadgeDot}>
              <Text style={styles.stampBadgeCount}>{stamps.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Work Filter Chips Carousel */}
      <View style={styles.chipsSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          <Chip
            label={ko.map.allWorks}
            selected={selectedWorkId === 'all'}
            onPress={() => setSelectedWorkId('all')}
          />
          {MOCK_WORKS.map((work) => (
            <Chip
              key={work.id}
              label={work.title}
              selected={selectedWorkId === work.id}
              onPress={() => setSelectedWorkId(work.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Main Interactive Map View */}
      <View style={styles.mapContainer}>
        <InteractiveMapView
          locations={filteredLocations}
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
          userCoords={userCoords}
        />

        {/* Quick GPS Recenter / Info Float Button */}
        <TouchableOpacity
          style={styles.gpsFloatButton}
          onPress={() => {
            setUserCoords({ latitude: 37.5539, longitude: 126.9798 });
            displayToast('내 위치로 포커스 (남산 백범광장)');
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="locate" size={22} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Toast Notification */}
      {showToast && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
          <Text style={styles.toastText}>{showToast}</Text>
        </View>
      )}

      {/* Location Details Bottom Sheet */}
      <LocationBottomSheet
        location={selectedLocation}
        visible={isBottomSheetOpen}
        onClose={closeBottomSheet}
        userCoords={userCoords}
        onSaveToArchive={handleSaveToArchive}
        onStartCertification={handleStartCertification}
      />

      {/* Visit Certification with overlay guide */}
      <VisitCertificationModal
        visible={isCertificationModalOpen}
        location={selectedLocation}
        onClose={() => setCertificationModalOpen(false)}
        onCompleteCertification={handleCompleteCertification}
      />

      {/* Stamp Book Modal */}
      <StampBookModal
        visible={isStampBookOpen}
        onClose={() => setStampBookOpen(false)}
        stamps={stamps}
        missions={missions}
      />

      {/* Spot Registration Modal (장소와 이름만 등록) */}
      <RegisterSpotModal
        visible={isRegisterSpotModalOpen}
        onClose={() => setRegisterSpotModalOpen(false)}
        onSave={async (name, address, work) => {
          await registerSpot(name, address, work);
          displayToast(ko.map.spotRegisteredSuccess);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.background,
    zIndex: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: borderRadius.chip,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    ...typography.body2,
  },
  registerSpotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: borderRadius.chip,
    gap: 4,
  },
  registerSpotText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.surface,
  },
  stampBookButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stampBadgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.accent,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  stampBadgeCount: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textInverse,
  },
  chipsSection: {
    backgroundColor: colors.background,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 9,
  },
  chipsScroll: {
    paddingHorizontal: spacing.base,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  gpsFloatButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 20,
  },
  toast: {
    position: 'absolute',
    bottom: 84,
    left: spacing.base,
    right: spacing.base,
    backgroundColor: colors.surfaceHigh,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 99,
  },
  toastText: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
