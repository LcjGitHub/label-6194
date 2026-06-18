import { Grid2 as Grid, Paper, Typography } from '@mui/material';
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
