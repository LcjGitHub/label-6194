import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTourStore } from '../store/useTourStore';

export function CharDetailPage() {
  const { charId } = useParams<{ charId: string }>();
  const getCharById = useTourStore((s) => s.getCharById);
  const char = charId ? getCharById(charId) : undefined;

  if (!char) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          未找到该汉字
        </Typography>
        <Button component={RouterLink} to="/" sx={{ mt: 2 }}>
          返回字库
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        返回字库
      </Button>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography
          variant="h1"
          fontWeight={700}
          sx={{ lineHeight: 1.2, mb: 2, color: 'primary.main' }}
        >
          {char.char}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'left', maxWidth: 480, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2, gap: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 48 }}>
              读音
            </Typography>
            <Typography variant="h6">{char.reading}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 48 }}>
              释义
            </Typography>
            <Typography variant="h6">{char.meaning}</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
