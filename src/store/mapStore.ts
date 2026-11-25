import { create } from 'zustand';
import { FilmingLocation, Stamp, WorkMission, RegisteredSpot } from '../types';
import { mapService } from '../services';

interface MapState {
  locations: FilmingLocation[];
  selectedLocation: FilmingLocation | null;
  selectedWorkId: string | 'all';
  searchQuery: string;
  userCoords: { latitude: number; longitude: number } | null;
  permissionGranted: boolean;
  stamps: Stamp[];
  missions: WorkMission[];
  registeredSpots: RegisteredSpot[];
  isBottomSheetOpen: boolean;
  isStampBookOpen: boolean;
  isCertificationModalOpen: boolean;
  isRegisterSpotModalOpen: boolean;
  isLoading: boolean;
  error: string | null;

  loadMapData: () => Promise<void>;
  setSelectedLocation: (loc: FilmingLocation | null) => void;
  setSelectedWorkId: (workId: string | 'all') => void;
  setSearchQuery: (query: string) => void;
  setUserCoords: (coords: { latitude: number; longitude: number } | null) => void;
  setPermissionGranted: (granted: boolean) => void;
  openBottomSheet: (loc: FilmingLocation) => void;
  closeBottomSheet: () => void;
  setStampBookOpen: (open: boolean) => void;
  setCertificationModalOpen: (open: boolean) => void;
  setRegisterSpotModalOpen: (open: boolean) => void;
  certifyCurrentLocation: (photoUri?: string) => Promise<Stamp | null>;
  registerSpot: (name: string, address: string, workTitle?: string) => Promise<RegisteredSpot>;
}

export const useMapStore = create<MapState>((set, get) => ({
  locations: [],
  selectedLocation: null,
  selectedWorkId: 'all',
  searchQuery: '',
  userCoords: { latitude: 37.5539, longitude: 126.9798 }, // Default near Namsan for smooth demo
  permissionGranted: true,
  stamps: [],
  missions: [],
  registeredSpots: [],
  isBottomSheetOpen: false,
  isStampBookOpen: false,
  isCertificationModalOpen: false,
  isRegisterSpotModalOpen: false,
  isLoading: false,
  error: null,

  loadMapData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [locations, stamps, missions, registeredSpots] = await Promise.all([
        mapService.getFilmingLocations(),
        mapService.getEarnedStamps(),
        mapService.getMissions(),
        mapService.getRegisteredSpots(),
      ]);
      set({
        locations,
        stamps,
        missions,
        registeredSpots,
        selectedLocation: locations[0],
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setSelectedLocation: (loc) => set({ selectedLocation: loc }),
  setSelectedWorkId: (workId) => set({ selectedWorkId: workId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setUserCoords: (coords) => set({ userCoords: coords }),
  setPermissionGranted: (granted) => set({ permissionGranted: granted }),
  openBottomSheet: (loc) => set({ selectedLocation: loc, isBottomSheetOpen: true }),
  closeBottomSheet: () => set({ isBottomSheetOpen: false }),
  setStampBookOpen: (open) => set({ isStampBookOpen: open }),
  setCertificationModalOpen: (open) => set({ isCertificationModalOpen: open }),
  setRegisterSpotModalOpen: (open) => set({ isRegisterSpotModalOpen: open }),

  certifyCurrentLocation: async (photoUri) => {
    const { selectedLocation } = get();
    if (!selectedLocation) return null;

    try {
      const newStamp = await mapService.recordStamp({
        locationId: selectedLocation.id,
        locationName: selectedLocation.name,
        workTitle: selectedLocation.workTitle,
        photoUri,
      });
      const updatedStamps = await mapService.getEarnedStamps();
      set({ stamps: updatedStamps, isCertificationModalOpen: false });
      return newStamp;
    } catch {
      return null;
    }
  },

  registerSpot: async (name, address, workTitle) => {
    const newSpot = await mapService.registerSpot({ name, address, workTitle });
    const updatedSpots = await mapService.getRegisteredSpots();
    set({ registeredSpots: updatedSpots, isRegisterSpotModalOpen: false });
    return newSpot;
  },
}));
