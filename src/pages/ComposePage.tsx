import { Box, Button, ButtonGroup, Snackbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { ComposePreview } from '../components/ComposePreview';
import { FontSizeControl } from '../components/FontSizeControl';
import { SelectedChips } from '../components/SelectedChips';
import { useCharStore } from '../store/useCharStore';
import { useSchemeStore } from '../store/useSchemeStore';

type SnackState = { open: boolean; message: string };

/**
 * 集字预览页：预览已选字排列效果，可切换横排/竖排，可保存当前方案
 */
export function ComposePage() {
  const writingMode = useCharStore((s) => s.writingMode);
  const setWritingMode = useCharStore((s) => s.setWritingMode);
  const bgStyle = useCharStore((s) => s.bgStyle);
  const setBgStyle = useCharStore((s) => s.setBgStyle);
  const selectedChars = useCharStore((s) => s.selectedChars);
  const addScheme = useSchemeStore((s) => s.addScheme);
  const [snack, setSnack] = useState<SnackState>({ open: false, message: '' });

  /**
   * 保存当前选字与排列方向为一条方案记录；若已存在相同内容则提示已存在
   */
  const handleSaveScheme = () => {
    if (selectedChars.length === 0) return;
    const charIds = selectedChars.map((c) => c.id);
    const ok = addScheme(charIds, writingMode);
    setSnack({ open: true, message: ok ? '方案已保存' : '该方案已存在，无需重复保存' });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        集字预览
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        预览已选字的排列效果，可切换横排 / 竖排模式，可调节字号大小，可切换背景样式
      </Typography>

      <SelectedChips />

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FontSizeControl />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2">背景：</Typography>
          <ButtonGroup variant="outlined" size="small">
            <Button
              variant={bgStyle === 'white' ? 'contained' : 'outlined'}
              onClick={() => setBgStyle('white')}
              aria-pressed={bgStyle === 'white'}
            >
              白底
            </Button>
            <Button
              variant={bgStyle === 'cream' ? 'contained' : 'outlined'}
              onClick={() => setBgStyle('cream')}
              aria-pressed={bgStyle === 'cream'}
            >
              米黄纸色
            </Button>
            <Button
              variant={bgStyle === 'lightgray' ? 'contained' : 'outlined'}
              onClick={() => setBgStyle('lightgray')}
              aria-pressed={bgStyle === 'lightgray'}
            >
              浅灰底
            </Button>
          </ButtonGroup>
        </Box>
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
        open={snack.open}
        autoHideDuration={2000}
        onClose={() => setSnack({ open: false, message: '' })}
        message={snack.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
