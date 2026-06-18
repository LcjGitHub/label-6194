import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { useTourStore } from '../store/useTourStore';
import type { TourRoute } from '../types';

function RouteCard({ route }: { route: TourRoute }) {
  const getCharById = useTourStore((s) => s.getCharById);
  const previewChars = route.steps
    .slice(0, 4)
    .map((step) => getCharById(step.charId))
    .filter(Boolean);

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        component={RouterLink}
        to={`/routes/${route.id}`}
        sx={{ height: '100%' }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
            <DirectionsWalkIcon color="primary" fontSize="small" />
            <Typography variant="h6" fontWeight={600}>
              {route.name}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 42 }}>
            {route.scene}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            {previewChars.map((c, idx) => (
              <Chip
                key={idx}
                label={c!.char}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
            {route.steps.length > 4 && (
              <Chip label={`+${route.steps.length - 4}`} size="small" variant="outlined" />
            )}
            <Chip label={`${route.steps.length} 步`} size="small" color="secondary" />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function TourListPage() {
  const routes = useTourStore((s) => s.routes);

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        游览动线推荐
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        选择一条预设动线，按步骤浏览书法字库中的精华字素
      </Typography>

      <Grid container spacing={3}>
        {routes.map((route) => (
          <Grid item xs={12} sm={6} md={4} key={route.id}>
            <RouteCard route={route} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
