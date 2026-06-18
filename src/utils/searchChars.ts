import type { CalligraphyChar } from '../types';

/**
 * 去除拼音中的声调符号
 */
function removeTones(pinyin: string): string {
  return pinyin
    .replace(/[āáǎà]/g, 'a')
    .replace(/[ōóǒò]/g, 'o')
    .replace(/[ēéěè]/g, 'e')
    .replace(/[īíǐì]/g, 'i')
    .replace(/[ūúǔù]/g, 'u')
    .replace(/[ǖǘǚǜü]/g, 'v');
}

/**
 * 字库关键词检索
 * 支持按汉字、拼音（带/不带声调）、释义进行模糊匹配
 * @param chars 完整字库列表
 * @param keyword 搜索关键词
 */
export function searchChars(chars: CalligraphyChar[], keyword: string): CalligraphyChar[] {
  const trimmed = keyword.trim();
  if (!trimmed) {
    return chars;
  }

  const lower = trimmed.toLowerCase();
  const lowerNoTones = removeTones(lower);

  return chars.filter((item) => {
    if (item.char.includes(trimmed)) {
      return true;
    }

    const readingLower = item.reading.toLowerCase();
    if (readingLower.includes(lower)) {
      return true;
    }

    const readingNoTones = removeTones(readingLower);
    if (readingNoTones.includes(lowerNoTones)) {
      return true;
    }

    if (item.meaning.includes(trimmed)) {
      return true;
    }

    return false;
  });
}
