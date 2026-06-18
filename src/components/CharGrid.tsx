import { Box, Grid2 as Grid, Paper, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import type { CalligraphyChar } from '../types';
import { MAX_SELECTED, useCharStore } from '../store/useCharStore';

interface CharGridProps {
  chars: CalligraphyChar[];
}

/**
 * 字库网格：点选 / 取消选字
 */
export function CharGrid({ chars }: CharGridProps) {
  const toggleChar = useCharStore((s) => s.toggleChar);
  const isSelected = useCharStore((s) => s.isSelected);
  const selectedCount = useCharStore((s) => s.selectedChars.length);

  const handleClick = (char: CalligraphyChar) => {
    const selected = isSelected(char.id);
    if (!selected && selectedCount >= MAX_SELECTED) {
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
        const disabled = !selected && selectedCount >= MAX_SELECTED;

        return (
          <Grid key={item.id} size={{ xs: 4, sm: 3, md: 2 }}>
            <Paper
              elevation={selected ? 4 : 1}
              onClick={() => handleClick(item)}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-disabled={disabled}
              aria-pressed={selected}
              aria-label={`${item.char}，读音${item.reading}，释义${item.meaning.replace(/[；;]/g, '、')}`}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                  e.preventDefault();
                  handleClick(item);
                }
              }}
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.45 : 1,
                border: 2,
                borderColor: selected ? 'primary.main' : 'transparent',
                bgcolor: selected ? 'action.selected' : 'background.paper',
                transition: 'all 0.2s',
                '&:hover': disabled
                  ? {}
                  : {
                      borderColor: 'primary.light',
                      transform: 'translateY(-2px)',
                    },
                '&:focus-visible': disabled
                  ? {}
                  : {
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
