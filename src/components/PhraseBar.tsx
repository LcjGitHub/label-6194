import { useMemo } from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import presetPhrases from '../mock/preset-phrases.json';
import calligraphyChars from '../mock/calligraphy-chars.json';
import { useCharStore } from '../store/useCharStore';
import type { CalligraphyChar, PresetPhrase } from '../types';

const phrases = presetPhrases as PresetPhrase[];
const allChars = calligraphyChars as CalligraphyChar[];

/**
 * 预设短语选择条
 *
 * 展示若干组预设短语按钮（每组 2～4 字），
 * 点击某条短语后会按短语定义的字编号顺序自动批量选中对应的汉字，
 * 遵守最多 4 字的选字上限；同时高亮当前完全匹配的短语按钮。
 */
export function PhraseBar() {
  const selectedChars = useCharStore((s) => s.selectedChars);
  const batchSelectChars = useCharStore((s) => s.batchSelectChars);

  const charMap = useMemo(() => {
    const map = new Map<string, CalligraphyChar>();
    allChars.forEach((c) => map.set(c.id, c));
    return map;
  }, []);

  const selectedIds = useMemo(
    () => selectedChars.map((c) => c.id),
    [selectedChars]
  );

  const isPhraseActive = (phrase: PresetPhrase): boolean => {
    if (phrase.charIds.length !== selectedIds.length) return false;
    return phrase.charIds.every((id, idx) => id === selectedIds[idx]);
  };

  const handleClick = (phrase: PresetPhrase) => {
    const resolved: CalligraphyChar[] = [];
    for (const id of phrase.charIds) {
      const found = charMap.get(id);
      if (found) {
        resolved.push(found);
      }
      if (resolved.length >= 4) break;
    }
    if (resolved.length > 0) {
      batchSelectChars(resolved);
    }
  };

  if (phrases.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        预设短语
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {phrases.map((phrase) => {
          const active = isPhraseActive(phrase);
          return (
            <Chip
              key={phrase.name}
              label={phrase.name}
              onClick={() => handleClick(phrase)}
              variant={active ? 'filled' : 'outlined'}
              color={active ? 'primary' : 'default'}
              clickable
            />
          );
        })}
      </Stack>
    </Box>
  );
}
