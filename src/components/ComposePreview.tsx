import { Box, Grid2 as Grid, Paper, Typography } from '@mui/material';
import { useCharStore } from '../store/useCharStore';
import { BG_COLOR_MAP, CARD_SIZE_MAP, FONT_SIZE_MAP, READING_FONT_SIZE_MAP } from '../types';

/**
 * 集字预览网格，支持横排 / 竖排切换与字号调节
 */
export function ComposePreview() {
  const selectedChars = useCharStore((s) => s.selectedChars);
  const writingMode = useCharStore((s) => s.writingMode);
  const fontSizeLevel = useCharStore((s) => s.fontSizeLevel);
  const bgStyle = useCharStore((s) => s.bgStyle);

  if (selectedChars.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">尚未选字，请返回字库选择 1–4 个字</Typography>
      </Paper>
    );
  }

  const isVertical = writingMode === 'vertical';
  const cardSize = CARD_SIZE_MAP[fontSizeLevel];
  const fontSize = FONT_SIZE_MAP[fontSizeLevel];
  const readingFontSize = READING_FONT_SIZE_MAP[fontSizeLevel];

  return (
    <Paper
      sx={{
        p: 4,
        minHeight: 320,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: BG_COLOR_MAP[bgStyle],
        transition: 'background-color 0.3s',
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
                  width: cardSize,
                  height: cardSize,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'width 0.2s, height 0.2s',
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'serif',
                    lineHeight: 1.2,
                    fontSize: fontSize,
                    transition: 'font-size 0.2s',
                  }}
                >
                  {item.char}
                </Typography>
                <Typography
                  component="span"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    fontSize: readingFontSize,
                    transition: 'font-size 0.2s',
                  }}
                >
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
