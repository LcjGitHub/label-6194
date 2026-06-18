import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import calligraphyChars from '../mock/calligraphy-chars.json';
import { CharGrid } from '../components/CharGrid';
import { SelectedChips } from '../components/SelectedChips';
import { useCharStore } from '../store/useCharStore';
import type { CalligraphyChar } from '../types';

/**
 * 字库选字页
 */
export function LibraryPage() {
  const selectedCount = useCharStore((s) => s.selectedChars.length);
  const chars = calligraphyChars as CalligraphyChar[];

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        字库
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        点击字卡选字或取消，最多选择 4 个字后前往集字预览
      </Typography>

      <SelectedChips />

      <CharGrid chars={chars} />

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          component={RouterLink}
          to="/compose"
          variant="contained"
          disabled={selectedCount === 0}
        >
          前往集字预览 ({selectedCount})
        </Button>
      </Box>
    </Box>
  );
}
