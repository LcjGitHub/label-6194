import { create } from 'zustand';
import type { CalligraphyChar, WritingMode } from '../types';

/** 最多可选字数 */
export const MAX_SELECTED = 4;

interface CharStore {
  selectedChars: CalligraphyChar[];
  writingMode: WritingMode;
  toggleChar: (char: CalligraphyChar) => void;
  removeChar: (id: string) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
  setWritingMode: (mode: WritingMode) => void;
}

/**
 * 集字选字状态管理
 */
export const useCharStore = create<CharStore>((set, get) => ({
  selectedChars: [],
  writingMode: 'horizontal',

  toggleChar: (char) => {
    const { selectedChars } = get();
    const exists = selectedChars.some((c) => c.id === char.id);

    if (exists) {
      set({ selectedChars: selectedChars.filter((c) => c.id !== char.id) });
      return;
    }

    if (selectedChars.length >= MAX_SELECTED) {
      return;
    }

    set({ selectedChars: [...selectedChars, char] });
  },

  removeChar: (id) => {
    set({ selectedChars: get().selectedChars.filter((c) => c.id !== id) });
  },

  clearSelection: () => {
    set({ selectedChars: [] });
  },

  isSelected: (id) => get().selectedChars.some((c) => c.id === id),

  setWritingMode: (mode) => {
    set({ writingMode: mode });
  },
}));
