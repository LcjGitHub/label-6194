import { Button, ButtonGroup, Typography } from '@mui/material';
import type { FontSizeLevel } from '../types';
import { useCharStore } from '../store/useCharStore';

const SIZE_LABELS: Record<FontSizeLevel, string> = {
  small: '小',
  medium: '中',
  large: '大',
};

/**
 * 字号调节控件：小 / 中 / 大三档切换
 */
export function FontSizeControl() {
  const fontSizeLevel = useCharStore((s) => s.fontSizeLevel);
  const setFontSizeLevel = useCharStore((s) => s.setFontSizeLevel);

  return (
    <>
      <Typography variant="subtitle2">字号：</Typography>
      <ButtonGroup variant="outlined" size="small">
        <Button
          variant={fontSizeLevel === 'small' ? 'contained' : 'outlined'}
          onClick={() => setFontSizeLevel('small')}
          sx={{ minWidth: 40, fontWeight: fontSizeLevel === 'small' ? 600 : 400 }}
        >
          {SIZE_LABELS.small}
        </Button>
        <Button
          variant={fontSizeLevel === 'medium' ? 'contained' : 'outlined'}
          onClick={() => setFontSizeLevel('medium')}
          sx={{ minWidth: 40, fontWeight: fontSizeLevel === 'medium' ? 600 : 400 }}
        >
          {SIZE_LABELS.medium}
        </Button>
        <Button
          variant={fontSizeLevel === 'large' ? 'contained' : 'outlined'}
          onClick={() => setFontSizeLevel('large')}
          sx={{ minWidth: 40, fontWeight: fontSizeLevel === 'large' ? 600 : 400 }}
        >
          {SIZE_LABELS.large}
        </Button>
      </ButtonGroup>
    </>
  );
}
