import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { useTourStore } from '../store/useTourStore';
import { useCharStore, MAX_SELECTED } from '../store/useCharStore';
import type { CalligraphyChar } from '../types';

export function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getRouteById = useTourStore((s) => s.getRouteById);
  const getCharById = useTourStore((s) => s.getCharById);
  const toggleChar = useCharStore((s) => s.toggleChar);
  const isSelected = useCharStore((s) => s.isSelected);
  const selectedCount = useCharStore((s) => s.selectedChars.length);

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

  const handleStepClick = (char: CalligraphyChar) => {
    toggleChar(char);
  };

  const handleStart = () => {
    navigate('/compose');
  };

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

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={-1} orientation="vertical">
            {route.steps.map((step, index) => {
              const char = getCharById(step.charId);
              if (!char) return null;
              const selected = isSelected(char.id);

              return (
                <Step key={step.charId} completed={selected}>
                  <StepLabel>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ color: selected ? 'primary.main' : 'inherit' }}
                    >
                      第 {index + 1} 站 · {char.char}（{char.reading}）
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Card
                      variant="outlined"
                      sx={{
                        borderColor: selected ? 'primary.main' : 'divider',
                        bgcolor: selected ? 'primary.50' : 'background.paper',
                      }}
                    >
                      <CardActionArea onClick={() => handleStepClick(char)}>
                        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Checkbox checked={selected} size="large" sx={{ p: 0 }} />
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
                              <Typography
                                variant="h3"
                                fontWeight={700}
                                sx={{
                                  color: selected ? 'primary.main' : 'text.primary',
                                  lineHeight: 1,
                                }}
                              >
                                {char.char}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {char.reading}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {char.meaning}
                              </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body1" color="text.primary">
                              {step.description}
                            </Typography>
                            {selected && (
                              <Chip
                                label="已加入集字"
                                color="primary"
                                size="small"
                                sx={{ mt: 1.5 }}
                              />
                            )}
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          已选 {selectedCount} / {MAX_SELECTED} 字
        </Typography>
        <Button
          variant="contained"
          onClick={handleStart}
          disabled={selectedCount === 0}
        >
          前往集字预览 ({selectedCount})
        </Button>
      </Box>
    </Box>
  );
}
