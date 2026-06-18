import { create } from 'zustand';
import type { SchemeRecord, WritingMode } from '../types';

/** 本地存储 key */
const STORAGE_KEY = 'calligraphy-schemes';

/**
 * 从 localStorage 读取已保存的方案列表，异常时返回空数组
 */
function loadSchemes(): SchemeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SchemeRecord[]) : [];
  } catch {
    return [];
  }
}

/**
 * 将方案列表序列化并写入 localStorage
 */
function persistSchemes(schemes: SchemeRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schemes));
}

/**
 * 比较两个字序数组是否完全一致
 */
function isSameCharIds(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  return a.every((id, idx) => id === b[idx]);
}

interface SchemeStore {
  /** 全部已保存的方案记录（最新在前） */
  schemes: SchemeRecord[];
  /** 新增一条方案记录，若已存在相同字序与排列方向的记录则返回 false */
  addScheme: (charIds: string[], writingMode: WritingMode) => boolean;
  /** 按 id 删除方案 */
  removeScheme: (id: string) => void;
  /** 按 id 查询方案 */
  getSchemeById: (id: string) => SchemeRecord | undefined;
  /** 判断是否已存在相同字序与排列方向的方案 */
  hasDuplicate: (charIds: string[], writingMode: WritingMode) => boolean;
}

/**
 * 集字方案收藏状态管理，自动持久化到 localStorage
 */
export const useSchemeStore = create<SchemeStore>((set, get) => ({
  schemes: loadSchemes(),

  hasDuplicate: (charIds, writingMode) =>
    get().schemes.some(
      (s) => isSameCharIds(s.charIds, charIds) && s.writingMode === writingMode,
    ),

  addScheme: (charIds, writingMode) => {
    if (get().hasDuplicate(charIds, writingMode)) {
      return false;
    }
    const record: SchemeRecord = {
      id: crypto.randomUUID(),
      charIds,
      writingMode,
      savedAt: Date.now(),
    };
    const next = [record, ...get().schemes];
    persistSchemes(next);
    set({ schemes: next });
    return true;
  },

  removeScheme: (id) => {
    const next = get().schemes.filter((s) => s.id !== id);
    persistSchemes(next);
    set({ schemes: next });
  },

  getSchemeById: (id) => get().schemes.find((s) => s.id === id),
}));
