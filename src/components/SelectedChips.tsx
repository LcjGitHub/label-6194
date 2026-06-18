import { Box, Chip, Stack, Typography } from '@mui/material';
import { MAX_SELECTED, useCharStore } from '../store/useCharStore';

/**
 * 已选字 Chip 展示栏
 */
export function SelectedChips() {
  const selectedChars = useCharStore((s) => s.selectedChars);
  const removeChar = useCharStore((s) => s.removeChar);
  const clearSelection = useCharStore((s) => s.clearSelection);

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          已选字
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedChars.length} / {MAX_SELECTED}
        </Typography>
      </Stack>

      {selectedChars.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          请从下方字库点选，最多 {MAX_SELECTED} 字
        </Typography>
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {selectedChars.map((item) => (
            <Chip
              key={item.id}
              label={`${item.char} · ${item.reading}`}
              onDelete={() => removeChar(item.id)}
              color="primary"
              variant="outlined"
            />
          ))}
          <Chip label="清空" onClick={clearSelection} variant="outlined" size="small" />
        </Stack>
      )}
    </Box>
  );
}
