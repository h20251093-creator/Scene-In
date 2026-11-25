import { ErrorReport, UserEventReport } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ERROR_REPORTS_KEY = '@scenein_error_reports';
const EVENT_REPORTS_KEY = '@scenein_event_reports';

export const reportService = {
  async getErrorReports(): Promise<ErrorReport[]> {
    try {
      const json = await AsyncStorage.getItem(ERROR_REPORTS_KEY);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  async submitErrorReport(report: Omit<ErrorReport, 'id' | 'createdAt' | 'status'>): Promise<ErrorReport> {
    const list = await this.getErrorReports();
    const newReport: ErrorReport = {
      ...report,
      id: `err-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: '접수완료',
    };
    await AsyncStorage.setItem(ERROR_REPORTS_KEY, JSON.stringify([newReport, ...list]));
    return newReport;
  },

  async getEventReports(): Promise<UserEventReport[]> {
    try {
      const json = await AsyncStorage.getItem(EVENT_REPORTS_KEY);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  async submitEventReport(report: Omit<UserEventReport, 'id' | 'createdAt' | 'status'>): Promise<UserEventReport> {
    const list = await this.getEventReports();
    const newReport: UserEventReport = {
      ...report,
      id: `ev-rep-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: '검증 중',
    };
    await AsyncStorage.setItem(EVENT_REPORTS_KEY, JSON.stringify([newReport, ...list]));
    return newReport;
  },
};
