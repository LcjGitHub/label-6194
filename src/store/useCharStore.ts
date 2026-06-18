import { create } from 'zustand';
import type { CalligraphyChar, FontSizeLevel, WritingMode } from '../types';

/** 最多可选字数 */
export const MAX_SELECTED = 4;

interface CharStore {
  selectedChars: CalligraphyChar[];
  writingMode: WritingMode;
  fontSizeLevel: FontSizeLevel;
  toggleChar: (char: CalligraphyChar) => void;
  removeChar: (id: string) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
  setWritingMode: (mode: WritingMode) => void;
  setFontSizeLevel: (level: FontSizeLevel) => void;
  batchSelectChars: (chars: CalligraphyChar[]) => void;
  moveChar: (fromIndex: number, toIndex: number) => void;
}

/**
 * 集字选字状态管理
 */
export const useCharStore = create<CharStore>((set, get) => ({
  selectedChars: [],
  writingMode: 'horizontal',
  fontSizeLevel: 'medium',

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

  batchSelectChars: (chars) => {
    set({ selectedChars: chars.slice(0, MAX_SELECTED) });
  },

  setWritingMode: (mode) => {
    set({ writingMode: mode });
  },

  setFontSizeLevel: (level) => {
    set({ fontSizeLevel: level });
  },

  moveChar: (fromIndex, toIndex) => {
    const { selectedChars } = get();
    if (fromIndex < 0 || fromIndex >= selectedChars.length || toIndex < 0 || toIndex >= selectedChars.length) {
      return;
    }
    const newChars = [...selectedChars];
    const [moved] = newChars.splice(fromIndex, 1);
    newChars.splice(toIndex, 0, moved);
    set({ selectedChars: newChars });
  },
}));
