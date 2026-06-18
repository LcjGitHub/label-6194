import { Box, Grid2 as Grid, Paper, Typography } from '@mui/material';
import { useCharStore } from '../store/useCharStore';

/**
 * 集字预览网格，支持横排 / 竖排切换
 */
export function ComposePreview() {
  const selectedChars = useCharStore((s) => s.selectedChars);
  const writingMode = useCharStore((s) => s.writingMode);

  if (selectedChars.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">尚未选字，请返回字库选择 1–4 个字</Typography>
      </Paper>
    );
  }

  const isVertical = writingMode === 'vertical';

  return (
    <Paper
      sx={{
        p: 4,
        minHeight: 320,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
      }}
    >
      <Box
        sx={{
          writingMode: isVertical ? 'vertical-rl' : 'horizontal-tb',
          textOrientation: 'upright',
        }}
      >
        <Grid
          container
          spacing={2}
          direction={isVertical ? 'column' : 'row'}
          sx={{
            flexWrap: isVertical ? 'nowrap' : 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {selectedChars.map((item) => (
            <Grid key={item.id} size="auto">
              <Paper
                elevation={3}
                sx={{
                  width: 120,
                  height: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="h2"
                  component="span"
                  sx={{ fontFamily: 'serif', lineHeight: 1.2 }}
                >
                  {item.char}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.reading}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}
