import { create } from 'zustand';

import { shiftMonth } from '@/utils/date';

interface MonthStore {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

export const useMonthStore = create<MonthStore>((set, get) => ({
  selectedMonth: new Date(),
  setSelectedMonth: (date) => set({ selectedMonth: date }),
  goToPreviousMonth: () => set({ selectedMonth: shiftMonth(get().selectedMonth, -1) }),
  goToNextMonth: () => set({ selectedMonth: shiftMonth(get().selectedMonth, 1) }),
}));
