import { MOCK_CALENDAR_EVENTS, MOCK_INTERESTS } from '../data/mockData';
import { CalendarEvent, InterestItem } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_STORAGE_KEY = '@scenein_notifications';

export const calendarService = {
  async getAllEvents(): Promise<CalendarEvent[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_CALENDAR_EVENTS]), 150));
  },

  async getEventsByDate(dateString: string): Promise<CalendarEvent[]> {
    return new Promise((resolve) => {
      const filtered = MOCK_CALENDAR_EVENTS.filter((e) => e.date === dateString);
      setTimeout(() => resolve(filtered), 100);
    });
  },

  async getInterests(): Promise<InterestItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_INTERESTS]), 100));
  },

  async toggleInterestFollow(id: string): Promise<InterestItem[]> {
    const item = MOCK_INTERESTS.find((i) => i.id === id);
    if (item) {
      item.isFollowed = !item.isFollowed;
    }
    return [...MOCK_INTERESTS];
  },

  async getScheduledNotifications(): Promise<Record<string, string>> {
    try {
      const json = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return json ? JSON.parse(json) : {};
    } catch {
      return {};
    }
  },

  async setEventNotification(eventId: string, timing: 'day_of' | '1_day_before' | '1_hour_before' | null): Promise<void> {
    const current = await this.getScheduledNotifications();
    if (timing === null) {
      delete current[eventId];
    } else {
      current[eventId] = timing;
    }
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(current));
  },
};
