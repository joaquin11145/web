import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import LoginScreen from './pages/Login/LoginScreen.jsx';
import SignUpScreen from './pages/SignUp/SignUpScreen.jsx';
import CatalogScreen from './pages/catalog/CatalogScreen.jsx';
import FavoritesScreen from './pages/Favorites/FavoritesScreen.jsx';
import EmprendedorDashboard from './pages/Emprendedor/EmprendedorDashboard.jsx';
import PublicationsScreen from './pages/Emprendedor/PublicationScreen.jsx';
import AdministrarStock from './pages/AdministrarStock/AdministrarStock.jsx';
import PerfilScreen from './pages/Perfil/PerfilScreen.jsx';

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
  const [estaLogueado, setEstaLogueado] = useState(true);

  const handleLogin = (rut, password, recuerdame) => {
    console.log({ rut, password, recuerdame });
    setEstaLogueado(true);
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

  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Polera', valor: 12000, tamanos: ['S', 'M', 'L'], colores: ['Rojo', 'Amarillo', 'Verde', 'Naranjo'], stock: 5, tipo: 'producto' },
    { id: 2, nombre: 'Producto 2', valor: 12000, tamanos: ['36', '37', '38'], colores: ['Rojo'], stock: 3, tipo: 'producto' },
    { id: 3, nombre: 'Producto 3', valor: 12000, tamanos: ['40', '41'], colores: ['Verde'], stock: 8, tipo: 'producto' },
  ]);

  const handleEditarProducto = (form, productoEditar) => {
    const datosNormalizados = {
      ...form,
      valor: form.valor ? Number(form.valor) : 0,
      stock: form.stock !== undefined ? Number(form.stock) : 0,
      tamanos: form.tamanos || (form.tamano ? [form.tamano] : []),
      colores: form.colores || (form.color ? [form.color] : []),
    };

    if (productoEditar) {
      console.log('Producto actualizado:', datosNormalizados);
      setProductos((prev) =>
        prev.map((p) => (p.id === productoEditar.id ? { ...p, ...datosNormalizados } : p))
      );
    } else {
      console.log('Producto creado:', datosNormalizados);
      setProductos((prev) => [...prev, { ...datosNormalizados, id: Date.now() }]);
    }
  };

  const handleEliminarProducto = (producto) => {
    console.log('Producto eliminado:', producto);
    setProductos((prev) => prev.filter((p) => p.id !== producto.id));
  };

  const handleActualizarStock = (productoId, nuevosDatos) => {
    console.log('Stock actualizado para producto', productoId, nuevosDatos);
    setProductos((prev) =>
      prev.map((p) => (p.id === productoId ? { ...p, ...nuevosDatos } : p))
    );
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
          element={
            estaLogueado
              ? <CatalogScreen productos={productos} favoritos={favoritos} onToggleFavorito={handleToggleFavorito} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/comprador"
          element={
            estaLogueado
              ? <CatalogScreen productos={productos} favoritos={favoritos} onToggleFavorito={handleToggleFavorito} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/favoritos"
          element={
            estaLogueado
              ? <FavoritesScreen favoritos={favoritos} onToggleFavorito={handleToggleFavorito} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/perfil"
          element={
            estaLogueado
              ? <PerfilScreen />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/emprendedor"
          element={estaLogueado ? <EmprendedorDashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/emprendedor/publicaciones"
          element={
            estaLogueado ? (
              <PublicationsScreen
                productos={productos}
                onEditarProducto={handleEditarProducto}
                onEliminarProducto={handleEliminarProducto}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/emprendedor/stock"
          element={
            <AdministrarStock
              productos={productos}
              onAtras={() => navigate('/emprendedor')}
              onActualizarStock={handleActualizarStock}
            />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}