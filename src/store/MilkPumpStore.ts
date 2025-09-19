'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MilkPumpEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  amount: number; // ml
};

type MilkPumpState = {
  entries: MilkPumpEntry[];
  addEntry: (entry: Omit<MilkPumpEntry, 'id'>) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
};

export const useMilkPumpStore = create<MilkPumpState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            ...state.entries,
            { ...entry, id: crypto.randomUUID() }, // tự gen id
          ],
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      clearEntries: () => set({ entries: [] }), // tiện clear hết
    }),
    {
      name: 'milk-pump-storage', // key trong localStorage
    }
  )
);
