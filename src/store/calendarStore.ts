import { create } from 'zustand';
import { CalendarEvent, InterestItem } from '../types';
import { calendarService } from '../services';

interface CalendarState {
  events: CalendarEvent[];
  interests: InterestItem[];
  selectedDate: string; // YYYY-MM-DD
  viewMode: 'monthly' | 'list';
  onlyFollowed: boolean;
  scheduledNotifications: Record<string, string>;
  isLoading: boolean;
  error: string | null;

  loadCalendarData: () => Promise<void>;
  setSelectedDate: (date: string) => void;
  setViewMode: (mode: 'monthly' | 'list') => void;
  setOnlyFollowed: (only: boolean) => void;
  toggleInterestFollow: (id: string) => Promise<void>;
  toggleNotification: (eventId: string, timing: 'day_of' | '1_day_before' | '1_hour_before') => Promise<void>;
  addReportedEvent: (event: CalendarEvent) => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  interests: [],
  selectedDate: '2026-11-20',
  viewMode: 'monthly',
  onlyFollowed: false,
  scheduledNotifications: {},
  isLoading: false,
  error: null,

  loadCalendarData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [events, interests, scheduledNotifications] = await Promise.all([
        calendarService.getAllEvents(),
        calendarService.getInterests(),
        calendarService.getScheduledNotifications(),
      ]);
      set({
        events,
        interests,
        scheduledNotifications,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setSelectedDate: (date) => set({ selectedDate: date }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setOnlyFollowed: (only) => set({ onlyFollowed: only }),

  toggleInterestFollow: async (id) => {
    const updated = await calendarService.toggleInterestFollow(id);
    set({ interests: updated });
  },

  toggleNotification: async (eventId, timing) => {
    const { scheduledNotifications } = get();
    const isAlreadySet = scheduledNotifications[eventId] === timing;
    const nextTiming = isAlreadySet ? null : timing;

    await calendarService.setEventNotification(eventId, nextTiming);
    const updated = await calendarService.getScheduledNotifications();
    set({ scheduledNotifications: updated });
  },

  addReportedEvent: (event) => {
    set((state) => ({ events: [event, ...state.events] }));
  },
}));
