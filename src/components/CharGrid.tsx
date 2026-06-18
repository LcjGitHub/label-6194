import { Box, Grid2 as Grid, Paper, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import type { CalligraphyChar } from '../types';
import { MAX_SELECTED, useCharStore } from '../store/useCharStore';

interface CharGridProps {
  /** 待展示的字库数据列表 */
  chars: CalligraphyChar[];
  /**
   * 选字达到上限时的回调
   * - 仅在已选满 4 字且点击未选中字卡时触发
   * - 可用于提示用户、触发动画等副作用
   */
  onMaxLimitReached?: () => void;
}

/**
 * 字库网格：点选 / 取消选字
 * - 点击已选中字卡取消选择，点击未选中字卡选中
 * - 选中数达到上限后，点击未选中字卡不执行选字，仅触发 onMaxLimitReached 回调
 * - 已满状态下仍可点击已选中字卡取消选择
 * - 支持键盘 Enter / Space 键操作与无障碍属性
 */
export function CharGrid({ chars, onMaxLimitReached }: CharGridProps) {
  const toggleChar = useCharStore((s) => s.toggleChar);
  const isSelected = useCharStore((s) => s.isSelected);
  const selectedCount = useCharStore((s) => s.selectedChars.length);

  /**
   * 字卡点击处理
   * - 已选中：取消选中
   * - 未选中且未达上限：选中字卡
   * - 未选中且已达上限：触发上限回调，不执行选字
   */
  const handleClick = (char: CalligraphyChar) => {
    const selected = isSelected(char.id);
    if (!selected && selectedCount >= MAX_SELECTED) {
      onMaxLimitReached?.();
      return;
    }
    toggleChar(char);
  };

  if (chars.length === 0) {
    return (
      <Box
        role="status"
        aria-live="polite"
        sx={{
          py: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: 'text.secondary',
        }}
      >
        <SearchOffIcon sx={{ fontSize: 56, opacity: 0.5 }} />
        <Typography variant="body1" fontWeight={500}>
          未找到匹配的字
        </Typography>
        <Typography variant="body2" color="text.disabled">
          试试其他汉字、拼音或释义关键词
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {chars.map((item) => {
        const selected = isSelected(item.id);

        return (
          <Grid key={item.id} size={{ xs: 4, sm: 3, md: 2 }}>
            <Paper
              elevation={selected ? 4 : 1}
              onClick={() => handleClick(item)}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`${item.char}，读音${item.reading}，释义${item.meaning.replace(/[；;]/g, '、')}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick(item);
                }
              }}
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                border: 2,
                borderColor: selected ? 'primary.main' : 'transparent',
                bgcolor: selected ? 'action.selected' : 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.light',
                  transform: 'translateY(-2px)',
                },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                },
              }}
            >
              <Typography variant="h4" component="div" sx={{ mb: 0.5, fontFamily: 'serif' }}>
                {item.char}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {item.reading}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" noWrap>
                {item.meaning}
              </Typography>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
