import { create } from 'zustand';
import type { SchemeRecord, WritingMode } from '../types';

const STORAGE_KEY = 'calligraphy-schemes';

function loadSchemes(): SchemeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SchemeRecord[]) : [];
  } catch {
    return [];
  }
}

function persistSchemes(schemes: SchemeRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schemes));
}

interface SchemeStore {
  schemes: SchemeRecord[];
  addScheme: (charIds: string[], writingMode: WritingMode) => void;
  removeScheme: (id: string) => void;
  getSchemeById: (id: string) => SchemeRecord | undefined;
}

export const useSchemeStore = create<SchemeStore>((set, get) => ({
  schemes: loadSchemes(),

  addScheme: (charIds, writingMode) => {
    const record: SchemeRecord = {
      id: crypto.randomUUID(),
      charIds,
      writingMode,
      savedAt: Date.now(),
    };
    const next = [record, ...get().schemes];
    persistSchemes(next);
    set({ schemes: next });
  },

  removeScheme: (id) => {
    const next = get().schemes.filter((s) => s.id !== id);
    persistSchemes(next);
    set({ schemes: next });
  },

  getSchemeById: (id) => get().schemes.find((s) => s.id === id),
}));
