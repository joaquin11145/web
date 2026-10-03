import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import LoginScreen from './pages/Login/LoginScreen.jsx';
import SignUpScreen from './pages/SignUp/SignUpScreen.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#c3552b',
      dark: '#a8441e',
    },
    background: {
      default: '#fbfbf9',
    },
    text: {
      primary: '#222222',
      secondary: '#ffffff',
    },
  },
});

export default function App() {
  const navigate = useNavigate();

  const handleLogin = (rut, password) => {
    navigate('/comprador');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Frame de Iniciar Sesión */}
        <Route
          path="/login"
          element={
            <LoginScreen
              onLogin={handleLogin}
              onCrearCuenta={() => navigate('/signup')}
            />
          }
        />

        {/* Frame de Registro de Usuario */}
        <Route
          path="/signup"
          element={
            <SignUpScreen
              onVolverLogin={() => navigate('/login')}
            />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}