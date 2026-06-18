import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

/**
 * 顶部导航布局
 */
export function Layout() {
  const location = useLocation();
  const isRoutesActive = location.pathname.startsWith('/routes');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            集字预览
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            variant={location.pathname === '/' ? 'outlined' : 'text'}
            sx={{ mr: 1 }}
          >
            字库
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/routes"
            variant={isRoutesActive ? 'outlined' : 'text'}
            sx={{ mr: 1 }}
            startIcon={<DirectionsWalkIcon />}
          >
            游览动线
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/compose"
            variant={location.pathname === '/compose' ? 'outlined' : 'text'}
          >
            集字预览
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
