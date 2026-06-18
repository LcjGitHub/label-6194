import { useMemo } from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import presetPhrases from '../mock/preset-phrases.json';
import calligraphyChars from '../mock/calligraphy-chars.json';
import { useCharStore } from '../store/useCharStore';
import type { CalligraphyChar, PresetPhrase } from '../types';

const phrases = presetPhrases as PresetPhrase[];
const allChars = calligraphyChars as CalligraphyChar[];

export function PhraseBar() {
  const batchSelectChars = useCharStore((s) => s.batchSelectChars);

  const charMap = useMemo(() => {
    const map = new Map<string, CalligraphyChar>();
    allChars.forEach((c) => map.set(c.id, c));
    return map;
  }, []);

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
        {phrases.map((phrase) => (
          <Chip
            key={phrase.name}
            label={phrase.name}
            onClick={() => handleClick(phrase)}
            variant="outlined"
            clickable
          />
        ))}
      </Stack>
    </Box>
  );
}
