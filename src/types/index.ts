/** 单字条目 */
export interface CalligraphyChar {
  id: string;
  char: string;
  reading: string;
  meaning: string;
}

/** 书写方向 */
export type WritingMode = 'horizontal' | 'vertical';

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
