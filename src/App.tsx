import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ComposePage } from './pages/ComposePage';
import { LibraryPage } from './pages/LibraryPage';
import { TourListPage } from './pages/TourListPage';
import { TourDetailPage } from './pages/TourDetailPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5c4a3a',
    },
    secondary: {
      main: '#8b7355',
    },
  },
  typography: {
    fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
  },
});

/**
 * 应用根组件与路由
 */
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<LibraryPage />} />
            <Route path="compose" element={<ComposePage />} />
            <Route path="routes" element={<TourListPage />} />
            <Route path="routes/:id" element={<TourDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
