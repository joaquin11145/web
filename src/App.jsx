import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import LoginScreen from './pages/Login/LoginScreen.jsx';
import SignUpScreen from './pages/SignUp/SignUpScreen.jsx';
import CatalogScreen from './pages/catalog/CatalogScreen.jsx';
import FavoritesScreen from './pages/Favorites/FavoritesScreen.jsx';

const theme = createTheme({
  palette: {
    primary: { main: '#c3552b', dark: '#a8441e' },
    background: { default: '#fbfbf9' },
    text: { primary: '#222222', secondary: '#ffffff' },
  },
});

export default function App() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);

  const handleLogin = (rut, password, recuerdame) => {
    console.log({ rut, password, recuerdame });
    navigate('/comprador');
  };

  const handleToggleFavorito = (producto) => {
    setFavoritos((prev) => {
      const yaExiste = prev.some((f) => f.id === producto.id);
      if (yaExiste) {
        console.log('Quitar de favoritos:', producto);
        return prev.filter((f) => f.id !== producto.id);
      } else {
        console.log('Agregar a favoritos:', producto);
        return [...prev, producto];
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={<LoginScreen onLogin={handleLogin} onCrearCuenta={() => navigate('/signup')} />}
        />

        <Route
          path="/signup"
          element={<SignUpScreen onVolverLogin={() => navigate('/login')} />}
        />

        <Route
          path="/catalog"
          element={<CatalogScreen favoritos={favoritos} onToggleFavorito={handleToggleFavorito} />}
        />
        <Route
          path="/comprador"
          element={<CatalogScreen favoritos={favoritos} onToggleFavorito={handleToggleFavorito} />}
        />
        <Route
          path="/favoritos"
          element={<FavoritesScreen favoritos={favoritos} onToggleFavorito={handleToggleFavorito} />}
        />
      </Routes>
    </ThemeProvider>
  );
}