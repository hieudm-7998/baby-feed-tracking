'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BabyFeedEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  amount: number; // ml
};

type BabyFeedState = {
  entries: BabyFeedEntry[];
  addEntry: (entry: Omit<BabyFeedEntry, 'id'>) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
};

export const useBabyFeedStore = create<BabyFeedState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [...state.entries, { id: crypto.randomUUID(), ...entry }],
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      clearEntries: () => set({ entries: [] }),
    }),
    {
      name: 'baby-feed-storage',
    }
  )
);
