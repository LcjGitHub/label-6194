/** 单字条目 */
export interface CalligraphyChar {
  id: string;
  char: string;
  reading: string;
  meaning: string;
}

/** 书写方向 */
export type WritingMode = 'horizontal' | 'vertical';

/** 预览区背景样式 */
export type BgStyle = 'white' | 'cream' | 'lightgray';

/** 预览区背景样式对应的颜色值 */
export const BG_COLOR_MAP: Record<BgStyle, string> = {
  white: '#ffffff',
  cream: '#fdf6e3',
  lightgray: '#f5f5f5',
};

/** 字号档位 */
export type FontSizeLevel = 'small' | 'medium' | 'large';

/** 字号档位对应的字体大小（像素） */
export const FONT_SIZE_MAP: Record<FontSizeLevel, number> = {
  small: 36,
  medium: 48,
  large: 64,
};

/** 字号档位对应的字卡尺寸（像素） */
export const CARD_SIZE_MAP: Record<FontSizeLevel, number> = {
  small: 90,
  medium: 120,
  large: 160,
};

/** 字号档位对应的读音标注字体大小（像素） */
export const READING_FONT_SIZE_MAP: Record<FontSizeLevel, number> = {
  small: 10,
  medium: 12,
  large: 14,
};

/** 预设短语 */
export interface PresetPhrase {
  name: string;
  charIds: string[];
}

/** 动线中的单步要素说明 */
export interface RouteStep {
  charId: string;
  description: string;
}

/** 游览动线 */
export interface TourRoute {
  id: string;
  name: string;
  scene: string;
  steps: RouteStep[];
}

/** 集字方案收藏记录 */
export interface SchemeRecord {
  id: string;
  charIds: string[];
  writingMode: WritingMode;
  savedAt: number;
}
