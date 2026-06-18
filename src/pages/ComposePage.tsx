import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ComposePreview } from '../components/ComposePreview';
import { SelectedChips } from '../components/SelectedChips';
import { useCharStore } from '../store/useCharStore';

/**
 * 集字预览页
 */
export function ComposePage() {
  const writingMode = useCharStore((s) => s.writingMode);
  const setWritingMode = useCharStore((s) => s.setWritingMode);

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

      <Box sx={{ mt: 4 }}>
        <Button component={RouterLink} to="/" variant="outlined">
          返回字库
        </Button>
      </Box>
    </Box>
  );
}
