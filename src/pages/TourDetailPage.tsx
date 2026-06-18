import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { useTourStore } from '../store/useTourStore';

export function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const getRouteById = useTourStore((s) => s.getRouteById);
  const getCharById = useTourStore((s) => s.getCharById);

  const route = id ? getRouteById(id) : undefined;

  if (!route) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          未找到该动线
        </Typography>
        <Button component={RouterLink} to="/routes" sx={{ mt: 2 }}>
          返回动线列表
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          to="/routes"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          返回动线列表
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <DirectionsWalkIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>
            {route.name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {route.scene}
        </Typography>
        <Chip label={`共 ${route.steps.length} 步`} color="secondary" size="small" />
      </Box>

      <List disablePadding>
        {route.steps.map((step, index) => {
          const char = getCharById(step.charId);
          if (!char) return null;

          return (
            <ListItem
              key={step.charId}
              disablePadding
              sx={{ mb: 2 }}
            >
              <Card
                variant="outlined"
                sx={{ width: '100%' }}
              >
                <CardActionArea
                  component={RouterLink}
                  to={`/chars/${char.id}`}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 48,
                        height: 48,
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      {char.char}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          第 {index + 1} 站 · {char.char}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {char.reading}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {char.meaning}
                      </Typography>
                      <Typography variant="body1">
                        {step.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
