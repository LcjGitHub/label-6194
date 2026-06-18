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
