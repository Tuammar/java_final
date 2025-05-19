import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import Header from './components/Header';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AppContent: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Определяем, нужно ли показывать Header
  const showHeader = isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showHeader && <Header />}
      <Box component="main" sx={{ flexGrow: 1, p: location.pathname === '/' || location.pathname === '/booking' ? 0 : 3, 
        // Убираем padding для Booking страницы, так как он уже есть в контейнере страницы
        pt: showHeader && (location.pathname === '/' || location.pathname === '/booking') ? 0 : (showHeader ? 3 : 0) // убираем верхний паддинг если есть хедер на странице букинга
      }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          } />
          {/* Можно добавить другие защищенные маршруты здесь */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 