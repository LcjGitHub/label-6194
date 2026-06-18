import { useCallback, useMemo, useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, Snackbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from 'react-router-dom';
import calligraphyChars from '../mock/calligraphy-chars.json';
import { CharGrid } from '../components/CharGrid';
import { SelectedChips } from '../components/SelectedChips';
import { PhraseBar } from '../components/PhraseBar';
import { useCharStore } from '../store/useCharStore';
import { searchChars } from '../utils/searchChars';
import type { CalligraphyChar } from '../types';

/**
 * 字库选字页
 */
export function LibraryPage() {
  const selectedCount = useCharStore((s) => s.selectedChars.length);
  const allChars = calligraphyChars as CalligraphyChar[];
  const [keyword, setKeyword] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  const filteredChars = useMemo(
    () => searchChars(allChars, keyword),
    [allChars, keyword]
  );

  const handleMaxLimitReached = useCallback(() => {
    setToastOpen(true);
  }, []);

  const handleToastClose = useCallback(() => {
    setToastOpen(false);
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        字库
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        点击字卡选字或取消，最多选择 4 个字后前往集字预览
      </Typography>

      <PhraseBar />

      <TextField
        fullWidth
        size="small"
        placeholder="搜索汉字、拼音或释义…"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <SelectedChips />

      <CharGrid chars={filteredChars} onMaxLimitReached={handleMaxLimitReached} />

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

      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={handleToastClose}
        message="最多选择四个字"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
