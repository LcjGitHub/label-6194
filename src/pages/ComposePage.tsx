import { Box, Button, ButtonGroup, Snackbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { ComposePreview } from '../components/ComposePreview';
import { SelectedChips } from '../components/SelectedChips';
import { useCharStore } from '../store/useCharStore';
import { useSchemeStore } from '../store/useSchemeStore';

/**
 * 集字预览页
 */
export function ComposePage() {
  const writingMode = useCharStore((s) => s.writingMode);
  const setWritingMode = useCharStore((s) => s.setWritingMode);
  const selectedChars = useCharStore((s) => s.selectedChars);
  const addScheme = useSchemeStore((s) => s.addScheme);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleSaveScheme = () => {
    if (selectedChars.length === 0) return;
    addScheme(
      selectedChars.map((c) => c.id),
      writingMode,
    );
    setSnackOpen(true);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        集字预览
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        预览已选字的排列效果，可切换横排 / 竖排模式
      </Typography>

      <SelectedChips />

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="subtitle2">排列方向：</Typography>
        <ButtonGroup variant="outlined" size="small">
          <Button
            variant={writingMode === 'horizontal' ? 'contained' : 'outlined'}
            onClick={() => setWritingMode('horizontal')}
          >
            横排
          </Button>
          <Button
            variant={writingMode === 'vertical' ? 'contained' : 'outlined'}
            onClick={() => setWritingMode('vertical')}
          >
            竖排
          </Button>
        </ButtonGroup>
      </Box>

      <ComposePreview />

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button component={RouterLink} to="/" variant="outlined">
          返回字库
        </Button>
        <Button
          variant="contained"
          startIcon={<BookmarkAddIcon />}
          onClick={handleSaveScheme}
          disabled={selectedChars.length === 0}
        >
          保存当前方案
        </Button>
      </Box>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message="方案已保存"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
