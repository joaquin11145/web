import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import './App.css';

import LoginScreen from './pages/Login/LoginScreen.jsx';
import SignUpScreen from './pages/SignUp/SignUpScreen.jsx';
import CatalogScreen from './pages/catalog/CatalogScreen.jsx';
import ProductDetailScreen from './pages/catalog/ProductDetailScreen.jsx';
import FavoritesScreen from './pages/Favorites/FavoritesScreen.jsx';
import EmprendedorDashboard from './pages/Emprendedor/EmprendedorDashboard.jsx';
import PublicationsScreen from './pages/Emprendedor/PublicationScreen.jsx';
import AdministrarStock from './pages/AdministrarStock/AdministrarStock.jsx';
import AtenderDevolucionesScreen from './pages/Emprendedor/AtenderDevolucionesScreen.jsx';

// Vistas del Administrador
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminLoginScreen from './pages/Admin/AdminLoginScreen.jsx';
import TransporteScreen from './pages/Admin/TransporteScreen.jsx';
import ZonaFormScreen from './pages/Admin/ZonaFormScreen.jsx';
import EmprendedoresAdminScreen from './pages/Admin/EmprendedoresAdminScreen.jsx';
import ComentariosAdminScreen from './pages/Admin/ComentariosAdminScreen.jsx';
import DevolucionesAdminScreen from './pages/Admin/DevolucionesAdminScreen.jsx';

import PerfilScreen from './pages/Perfil/PerfilScreen.jsx';
import MensajeriaScreen from './pages/Mensajeria/MensajeriaScreen.jsx';
import HistorialPedidos from './pages/Comprador/HistorialPedidos.jsx';
import SolicitarDevolucionScreen from './pages/Comprador/SolicitarDevolucionScreen.jsx';
import SeguimientoScreen from './pages/Comprador/SeguimientoScreen.jsx';
import HistorialTransacciones from './pages/Comprador/HistorialTransacciones.jsx';
import HistorialCotizaciones from './pages/Comprador/HistorialCotizaciones.jsx';

const theme = createTheme({
  palette: {
    primary: { main: '#c3552b', dark: '#a8441e' },
    background: { default: '#fbfbf9' },
    text: { primary: '#222222', secondary: '#ffffff' },
  },
});

const zonasIniciales = [
  {
    id: 1,
    nombre: 'Santiago Centro',
    ciudad: 'Santiago',
    region: 'Región Metropolitana de Santiago',
    comunas: ['Santiago', 'Providencia', 'Ñuñoa'],
    tiempoEntrega: '24 horas',
    tarifaBase: 2900,
    costoKiloExtra: 500,
    kilosIncluidos: 2,
    habilitada: true,
  },
  {
    id: 2,
    nombre: 'Valparaíso Costa',
    ciudad: 'Valparaíso',
    region: 'Región de Valparaíso',
    comunas: ['Valparaíso', 'Viña del Mar', 'Concón'],
    tiempoEntrega: '48 horas',
    tarifaBase: 3500,
    costoKiloExtra: 700,
    kilosIncluidos: 2,
    habilitada: true,
  },
  {
    id: 3,
    nombre: 'Concepción Metropolitano',
    ciudad: 'Concepción',
    region: 'Región del Biobío',
    comunas: ['Concepción', 'Talcahuano', 'San Pedro de la Paz'],
    tiempoEntrega: '48 horas',
    tarifaBase: 4200,
    costoKiloExtra: 800,
    kilosIncluidos: 1,
    habilitada: false,
  },
];

export default function App() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [estaLogueado, setEstaLogueado] = useState(true);
  const [estaLogueadoAdmin, setEstaLogueadoAdmin] = useState(false);

  // Estado del filtro de vendedor activo en el catálogo
  const [vendedorFiltrado, setVendedorFiltrado] = useState(null);

  // Modal de advertencia por vendedor diferente
  const [alertaVendedor, setAlertaVendedor] = useState({ open: false, vendedorExistente: '', vendedorNuevo: '' });

  // Estado global del carrito con clave única de variante
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      itemKey: '1-S-Rojo',
      nombre: 'Polera',
      valor: 12000,
      cantidad: 2,
      tallaSeleccionada: 'S',
      colorSeleccionado: 'Rojo',
      vendedor: 'Tienda Oficial',
    },
    {
      id: 2,
      itemKey: '2-36-Rojo',
      nombre: 'Producto 2',
      valor: 7000,
      cantidad: 1,
      tallaSeleccionada: '36',
      colorSeleccionado: 'Rojo',
      vendedor: 'Tienda Oficial',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [itemsParaCotizar, setItemsParaCotizar] = useState([]);

  // Estado global de Zonas de Transporte y Cobertura
  const [zonasTransporte, setZonasTransporte] = useState(zonasIniciales);

  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Polera', valor: 12000, tamanos: ['S', 'M', 'L'], colores: ['Rojo', 'Amarillo', 'Verde', 'Naranjo'], stock: 5, tipo: 'producto', vendedor: 'Tienda Oficial' },
    { id: 2, nombre: 'Producto 2', valor: 12000, tamanos: ['36', '37', '38'], colores: ['Rojo'], stock: 3, tipo: 'producto', vendedor: 'Tienda Oficial' },
    { id: 3, nombre: 'Producto 3', valor: 12000, tamanos: ['40', '41'], colores: ['Verde'], stock: 8, tipo: 'producto', vendedor: 'Textiles del Sur' },
  ]);

  const handleLogin = (rut, password, recuerdame) => {
    console.log({ rut, password, recuerdame });
    setEstaLogueado(true);
    navigate('/comprador');
  };

  const handleToggleFavorito = (producto) => {
    setFavoritos((prev) => {
      const yaExiste = prev.some((f) => f.id === producto.id);
      if (yaExiste) {
        return prev.filter((f) => f.id !== producto.id);
      } else {
        return [...prev, producto];
      }
    });
  };

  const handleAddToCart = (producto) => {
    const vendedorProducto = producto.vendedor || 'Tienda Oficial';

    if (cartItems.length > 0) {
      const vendedorCarrito = cartItems[0].vendedor || 'Tienda Oficial';
      if (vendedorCarrito !== vendedorProducto) {
        setAlertaVendedor({
          open: true,
          vendedorExistente: vendedorCarrito,
          vendedorNuevo: vendedorProducto,
        });
        return;
      }
    }

    const key = `${producto.id}-${producto.tallaSeleccionada || 'default'}-${producto.colorSeleccionado || 'default'}`;

    setCartItems((prev) => {
      const existeIndex = prev.findIndex((item) => item.itemKey === key);
      if (existeIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existeIndex
            ? { ...item, cantidad: (item.cantidad || 1) + (Number(producto.cantidad) || 1) }
            : item
        );
      }
      return [
        ...prev,
        {
          ...producto,
          itemKey: key,
          cantidad: Number(producto.cantidad) || 1,
          vendedor: vendedorProducto,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemKey, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      setCartItems((prev) => prev.filter((item) => (item.itemKey || item.id) !== itemKey));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          (item.itemKey || item.id) === itemKey ? { ...item, cantidad: nuevaCantidad } : item
        )
      );
    }
  };

  const handleCotizarCarrito = (items) => {
    if (!items || items.length === 0) return;
    setItemsParaCotizar(items);
    setIsQuotationOpen(true);
  };

  const handleCotizarItem = (item) => {
    setItemsParaCotizar([item]);
    setIsQuotationOpen(true);
  };

  const handleFiltrarPorVendedor = (vendedor) => {
    setIsCartOpen(false);
    setVendedorFiltrado(vendedor);
    navigate('/catalog');
  };

  const handleEditarProducto = (form, productoEditar) => {
    const datosNormalizados = {
      ...form,
      valor: form.valor ? Number(form.valor) : 0,
      stock: form.stock !== undefined ? Number(form.stock) : 0,
      tamanos: form.tamanos || (form.tamano ? [form.tamano] : []),
      colores: form.colores || (form.color ? [form.color] : []),
    };

    if (productoEditar) {
      setProductos((prev) =>
        prev.map((p) => (p.id === productoEditar.id ? { ...p, ...datosNormalizados } : p))
      );
    } else {
      setProductos((prev) => [...prev, { ...datosNormalizados, id: Date.now() }]);
    }
  };

  const handleEliminarProducto = (producto) => {
    setProductos((prev) => prev.filter((p) => p.id !== producto.id));
  };

  const handleActualizarStock = (productoId, nuevosDatos) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === productoId ? { ...p, ...nuevosDatos } : p))
    );
  };

  // Funciones de gestión de zonas
  const handleToggleHabilitarZona = (id) => {
    setZonasTransporte((prev) =>
      prev.map((z) => (z.id === id ? { ...z, habilitada: !z.habilitada } : z))
    );
  };

  const handleGuardarZona = (zona) => {
    setZonasTransporte((prev) => {
      const existe = prev.some((z) => z.id === zona.id);
      if (existe) {
        return prev.map((z) => (z.id === zona.id ? zona : z));
      }
      return [...prev, zona];
    });
  };

  const commonCartProps = {
    cartItems,
    isCartOpen,
    onOpenCart: () => setIsCartOpen(true),
    onCloseCart: () => setIsCartOpen(false),
    onUpdateQuantity: handleUpdateQuantity,
    onCotizarCarrito: handleCotizarCarrito,
    onFiltrarVendedor: handleFiltrarPorVendedor,
    isQuotationOpen,
    onCloseQuotation: () => setIsQuotationOpen(false),
    itemsParaCotizar,
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
              ? (
                <CatalogScreen
                  productos={productos}
                  favoritos={favoritos}
                  onToggleFavorito={handleToggleFavorito}
                  cartProps={commonCartProps}
                  vendedorFiltrado={vendedorFiltrado}
                  onLimpiarFiltroVendedor={() => setVendedorFiltrado(null)}
                />
              )
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/comprador"
          element={
            estaLogueado
              ? (
                <CatalogScreen
                  productos={productos}
                  favoritos={favoritos}
                  onToggleFavorito={handleToggleFavorito}
                  cartProps={commonCartProps}
                  vendedorFiltrado={vendedorFiltrado}
                  onLimpiarFiltroVendedor={() => setVendedorFiltrado(null)}
                />
              )
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/producto/:id"
          element={
            estaLogueado
              ? (
                <ProductDetailScreen
                  productos={productos}
                  favoritos={favoritos}
                  onToggleFavorito={handleToggleFavorito}
                  onAddToCart={handleAddToCart}
                  onCotizarDirecto={handleCotizarItem}
                  cartProps={commonCartProps}
                />
              )
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/favoritos"
          element={
            estaLogueado
              ? <FavoritesScreen favoritos={favoritos} onToggleFavorito={handleToggleFavorito} cartProps={commonCartProps} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/mensajes"
          element={
            estaLogueado
              ? <MensajeriaScreen cartProps={commonCartProps} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/pedidos"
          element={
            estaLogueado
              ? <HistorialPedidos cartProps={commonCartProps} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/cotizaciones"
          element={
            estaLogueado
              ? <HistorialCotizaciones cartProps={commonCartProps} onAddToCart={handleAddToCart} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/devolucion"
          element={
            estaLogueado
              ? <SolicitarDevolucionScreen cartProps={commonCartProps} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/seguimiento"
          element={
            estaLogueado
              ? <SeguimientoScreen cartProps={commonCartProps} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/transacciones"
          element={
            estaLogueado
              ? <HistorialTransacciones cartProps={commonCartProps} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/perfil"
          element={
            estaLogueado
              ? <PerfilScreen cartProps={commonCartProps} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/emprendedor"
          element={
            estaLogueado ? (
              <EmprendedorDashboard
                onCrearProducto={(nuevo) => handleEditarProducto(nuevo, null)}
                cartProps={commonCartProps}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
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

        <Route
          path="/emprendedor/devoluciones"
          element={
            estaLogueado ? (
              <AtenderDevolucionesScreen cartProps={commonCartProps} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ================= RUTAS DEL ADMINISTRADOR ================= */}
        <Route
          path="/admin"
          element={
            estaLogueadoAdmin ? (
              <AdminDashboard cartProps={commonCartProps} />
            ) : (
              <AdminLoginScreen
                onLoginSuccess={() => setEstaLogueadoAdmin(true)}
                onVolverSitio={() => navigate('/comprador')}
              />
            )
          }
        />

        <Route
          path="/admin/emprendedores"
          element={
            estaLogueadoAdmin ? (
              <EmprendedoresAdminScreen cartProps={commonCartProps} />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />

        <Route
          path="/admin/transporte"
          element={
            estaLogueadoAdmin ? (
              <TransporteScreen
                zonas={zonasTransporte}
                onToggleHabilitar={handleToggleHabilitarZona}
                cartProps={commonCartProps}
              />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />

        <Route
          path="/admin/transporte/agregar"
          element={
            estaLogueadoAdmin ? (
              <ZonaFormScreen
                zonas={zonasTransporte}
                onGuardarZona={handleGuardarZona}
                cartProps={commonCartProps}
              />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />

        <Route
          path="/admin/transporte/editar/:id"
          element={
            estaLogueadoAdmin ? (
              <ZonaFormScreen
                zonas={zonasTransporte}
                onGuardarZona={handleGuardarZona}
                cartProps={commonCartProps}
              />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />

        <Route
          path="/admin/comentarios"
          element={
            estaLogueadoAdmin ? (
              <ComentariosAdminScreen cartProps={commonCartProps} />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />

        <Route
          path="/admin/devoluciones"
          element={
            estaLogueadoAdmin ? (
              <DevolucionesAdminScreen cartProps={commonCartProps} />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />
      </Routes>

      {/* Modal Advertencia Vendedor Único */}
      <Dialog
        open={alertaVendedor.open}
        onClose={() => setAlertaVendedor({ open: false, vendedorExistente: '', vendedorNuevo: '' })}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            border: '1.5px solid var(--color-texto-oscuro)',
            p: 1.5,
            bgcolor: 'var(--color-fondo)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'var(--color-primario)', fontSize: '1.1rem' }}>
          Vendedor Diferente
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'var(--color-texto-oscuro)', fontSize: '0.92rem', lineHeight: 1.4 }}>
            Tu carrito actual contiene productos de <strong>"{alertaVendedor.vendedorExistente}"</strong>.
            Solo se pueden agregar artículos del mismo vendedor en cada compra.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1 }}>
          <Button
            onClick={() => setAlertaVendedor({ open: false, vendedorExistente: '', vendedorNuevo: '' })}
            sx={{
              bgcolor: 'var(--color-primario)',
              color: 'var(--color-texto-claro)',
              borderRadius: '20px',
              textTransform: 'none',
              px: 3,
              fontWeight: 600,
              '&:hover': { bgcolor: 'var(--color-primario-hover)' },
            }}
          >
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}