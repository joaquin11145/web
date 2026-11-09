import React, { useState, useEffect } from 'react';
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

import { PRODUCTOS_MOCK } from './data/mockCatalog';
import { hashPassword, verifyPassword } from './utils/security';

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
import ActivarCuentaAdminScreen from './pages/Admin/ActivarCuentaAdminScreen.jsx';
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
import HistorialNotificacionesScreen from './pages/Notificaciones/HistorialNotificacionesScreen.jsx';

const theme = createTheme({
  palette: {
    primary: { main: '#c3552b', dark: '#a8441e' },
    background: { default: '#fbfbf9' },
    text: { primary: '#222222', secondary: '#ffffff' },
  },
});

export const CUENTAS_DEMO = [
  {
    rut: '11.111.111-1',
    passwordHash: '',
    name: 'Juan Pérez (Comprador)',
    email: 'juan.comprador@meyerexpress.cl',
    soyEmpresa: false,
    nombreEmpresa: '',
    telefonos: ['+56 9 8765 4321'],
    direcciones: [
      { id: 1, direccion: 'Av. Libertad', numero: '750', comuna: 'Viña del Mar', region: 'Valparaíso' },
    ],
  },
  {
    rut: '22.222.222-2',
    passwordHash: '',
    name: 'Carlos Gómez (Emprendedor)',
    email: 'contacto@textilesdelsur.cl',
    soyEmpresa: true,
    nombreEmpresa: 'Textiles del Sur SpA',
    tieneWeb: true,
    paginaWeb: 'https://textilesdelsur.cl',
    telefonos: ['+56 9 1234 5678'],
    direcciones: [
      { id: 1, direccion: 'Av. Providencia', numero: '1240', comuna: 'Santiago', region: 'Metropolitana de Santiago' },
    ],
  },
];

const zonasIniciales = [
  {
    id: 1,
    nombre: 'Santiago Centro',
    ciudad: 'Santiago',
    region: 'Metropolitana de Santiago',
    comunas: ['Santiago', 'Providencia', 'Ñuñoa', 'Las Condes'],
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
    region: 'Valparaíso',
    comunas: ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué'],
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
    region: 'Biobío',
    comunas: ['Concepción', 'Talcahuano', 'San Pedro de la Paz', 'Chiguayante'],
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

  const [usuariosRegistrados, setUsuariosRegistrados] = useState(CUENTAS_DEMO);
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [estaLogueadoAdmin, setEstaLogueadoAdmin] = useState(false);

  const [vendedorFiltrado, setVendedorFiltrado] = useState(null);
  const [alertaVendedor, setAlertaVendedor] = useState({ open: false, vendedorExistente: '', vendedorNuevo: '' });

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      itemKey: '1-S-Rojo',
      nombre: 'Polera Deportiva Transpirable',
      valor: 12000,
      cantidad: 2,
      tallaSeleccionada: 'S',
      colorSeleccionado: 'Rojo',
      vendedor: 'Tienda Oficial',
    },
    {
      id: 2,
      itemKey: '2-38-Negro',
      nombre: 'Zapatillas Urbanas Lona',
      valor: 24990,
      cantidad: 1,
      tallaSeleccionada: '38',
      colorSeleccionado: 'Negro',
      vendedor: 'Tienda Oficial',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [itemsParaCotizar, setItemsParaCotizar] = useState([]);

  const [zonasTransporte, setZonasTransporte] = useState(zonasIniciales);
  const [productos, setProductos] = useState(PRODUCTOS_MOCK);

  // Inicializar hashes con bcrypt para las cuentas demo
  useEffect(() => {
    async function inicializarHashes() {
      const hash123 = await hashPassword('123');
      setUsuariosRegistrados((prev) =>
        prev.map((u) => ({
          ...u,
          passwordHash: u.passwordHash || hash123,
        }))
      );
    }
    inicializarHashes();
  }, []);

  // Login asíncrono con verificación criptográfica con Bcrypt
  const handleLogin = async (rut, password, recuerdame) => {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    const usuarioEncontrado = usuariosRegistrados.find(
      (u) => u.rut.replace(/[^0-9kK]/g, '').toUpperCase() === rutLimpio
    );

    if (!usuarioEncontrado) {
      return { success: false, mensaje: 'RUT o contraseña incorrectos.' };
    }

    let esPasswordCorrecta = false;
    if (usuarioEncontrado.passwordHash) {
      esPasswordCorrecta = await verifyPassword(password, usuarioEncontrado.passwordHash);
    } else {
      esPasswordCorrecta = password === '123';
    }

    console.log('[BACKEND PENDIENTE] POST /api/auth/login', {
      rut: rutLimpio,
      passwordPlanaRecibida: '••••••••',
      comparacionBcryptExitosa: esPasswordCorrecta,
      recuerdame,
    });

    if (esPasswordCorrecta) {
      // CONSERVAMOS passwordHash en currentUser para que PerfilScreen lo tenga actualizado
      setCurrentUser({ ...usuarioEncontrado });
      setEstaLogueado(true);
      navigate(usuarioEncontrado.soyEmpresa ? '/emprendedor' : '/comprador');
      return { success: true };
    }

    return { success: false, mensaje: 'RUT o contraseña incorrectos.' };
  };

  const handleLogout = () => {
    console.log('[BACKEND PENDIENTE] POST /api/auth/logout', { rut: currentUser?.rut });
    setEstaLogueado(false);
    setCurrentUser(null);
    navigate('/login');
  };

  const handleRegistrarUsuario = async (nuevoUsuario) => {
    const passwordHashGenerado = await hashPassword(nuevoUsuario.password);
    const { password, confirmPassword, ...restoDatos } = nuevoUsuario;

    const nuevo = {
      ...restoDatos,
      passwordHash: passwordHashGenerado,
      name: `${nuevoUsuario.nombres} ${nuevoUsuario.apellidos}`,
      fechaCreacion: new Date().toISOString(),
    };

    console.log('[BACKEND PENDIENTE] POST /api/auth/register (Contraseña hasheada con bcrypt):', {
      rut: nuevo.rut,
      email: nuevo.email,
      passwordHash: nuevo.passwordHash,
    });

    setUsuariosRegistrados((prev) => [...prev, nuevo]);
  };

  // Sincronización del nuevo hash cuando se cambia la contraseña en /perfil
  const handleActualizarPasswordUsuario = (rut, nuevoHash) => {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();

    setUsuariosRegistrados((prev) =>
      prev.map((u) =>
        u.rut.replace(/[^0-9kK]/g, '').toUpperCase() === rutLimpio
          ? { ...u, passwordHash: nuevoHash }
          : u
      )
    );

    setCurrentUser((prev) => (prev ? { ...prev, passwordHash: nuevoHash } : null));
  };

  const handleToggleFavorito = (producto) => {
    console.log('[BACKEND PENDIENTE] POST /api/favoritos/toggle', { productoId: producto.id, usuarioRut: currentUser?.rut });
    setFavoritos((prev) => {
      const yaExiste = prev.some((f) => f.id === producto.id);
      return yaExiste ? prev.filter((f) => f.id !== producto.id) : [...prev, producto];
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

    console.log('[BACKEND PENDIENTE] POST /api/carrito/items', { productoId: producto.id, key, cantidad: producto.cantidad || 1 });

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
    console.log('[BACKEND PENDIENTE] PATCH /api/carrito/items/' + itemKey, { cantidad: nuevaCantidad });
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
    const empresaActual = currentUser?.nombreEmpresa || currentUser?.name || 'Tienda Oficial';

    const datosNormalizados = {
      ...form,
      vendedor: form.vendedor || empresaActual,
      valor: form.valor ? Number(form.valor) : 0,
      stock: form.stock !== undefined ? Number(form.stock) : 0,
      tamanos: form.tamanos || (form.tamano ? [form.tamano] : []),
      colores: form.colores || (form.color ? [form.color] : []),
    };

    if (productoEditar) {
      console.log('[BACKEND PENDIENTE] PUT /api/productos/' + productoEditar.id, datosNormalizados);
      setProductos((prev) =>
        prev.map((p) => (p.id === productoEditar.id ? { ...p, ...datosNormalizados } : p))
      );
    } else {
      const nuevo = { ...datosNormalizados, id: Date.now() };
      console.log('[BACKEND PENDIENTE] POST /api/productos', nuevo);
      setProductos((prev) => [...prev, nuevo]);
    }
  };

  const handleEliminarProducto = (producto) => {
    console.log('[BACKEND PENDIENTE] DELETE /api/productos/' + producto.id);
    setProductos((prev) => prev.filter((p) => p.id !== producto.id));
  };

  const handleActualizarStock = (productoId, nuevosDatos) => {
    console.log('[BACKEND PENDIENTE] PATCH /api/productos/' + productoId + '/stock', nuevosDatos);
    setProductos((prev) =>
      prev.map((p) => (p.id === productoId ? { ...p, ...nuevosDatos } : p))
    );
  };

  const handleToggleHabilitarZona = (id) => {
    console.log('[BACKEND PENDIENTE] PATCH /api/transporte/zonas/' + id + '/toggle');
    setZonasTransporte((prev) =>
      prev.map((z) => (z.id === id ? { ...z, habilitada: !z.habilitada } : z))
    );
  };

  const handleGuardarZona = (zona) => {
    setZonasTransporte((prev) => {
      const existe = prev.some((z) => z.id === zona.id);
      if (existe) {
        console.log('[BACKEND PENDIENTE] PUT /api/transporte/zonas/' + zona.id, zona);
        return prev.map((z) => (z.id === zona.id ? zona : z));
      } else {
        console.log('[BACKEND PENDIENTE] POST /api/transporte/zonas', zona);
        return [...prev, zona];
      }
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
    onLogout: handleLogout,
    isQuotationOpen,
    onCloseQuotation: () => setIsQuotationOpen(false),
    itemsParaCotizar,
    zonasTransporte,
    currentUser,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login limpio sin botones demo */}
        <Route
          path="/login"
          element={
            <LoginScreen
              onLogin={handleLogin}
              onCrearCuenta={() => navigate('/signup')}
            />
          }
        />

        <Route
          path="/signup"
          element={
            <SignUpScreen
              onVolverLogin={() => navigate('/login')}
              onUsuarioCreado={handleRegistrarUsuario}
            />
          }
        />

        {/* Rutas Comprador */}
        <Route
          path="/catalog"
          element={
            estaLogueado ? (
              <CatalogScreen
                productos={productos}
                favoritos={favoritos}
                onToggleFavorito={handleToggleFavorito}
                cartProps={commonCartProps}
                vendedorFiltrado={vendedorFiltrado}
                onLimpiarFiltroVendedor={() => setVendedorFiltrado(null)}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/comprador"
          element={
            estaLogueado ? (
              <CatalogScreen
                productos={productos}
                favoritos={favoritos}
                onToggleFavorito={handleToggleFavorito}
                cartProps={commonCartProps}
                vendedorFiltrado={vendedorFiltrado}
                onLimpiarFiltroVendedor={() => setVendedorFiltrado(null)}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/producto/:id"
          element={
            estaLogueado ? (
              <ProductDetailScreen
                productos={productos}
                favoritos={favoritos}
                onToggleFavorito={handleToggleFavorito}
                onAddToCart={handleAddToCart}
                onCotizarDirecto={handleCotizarItem}
                cartProps={commonCartProps}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/favoritos"
          element={
            estaLogueado ? (
              <FavoritesScreen favoritos={favoritos} onToggleFavorito={handleToggleFavorito} cartProps={commonCartProps} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/mensajes"
          element={
            estaLogueado ? <MensajeriaScreen cartProps={commonCartProps} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/pedidos"
          element={
            estaLogueado ? <HistorialPedidos cartProps={commonCartProps} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/cotizaciones"
          element={
            estaLogueado ? <HistorialCotizaciones cartProps={commonCartProps} onAddToCart={handleAddToCart} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/devolucion"
          element={
            estaLogueado ? <SolicitarDevolucionScreen cartProps={commonCartProps} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/seguimiento"
          element={
            estaLogueado ? <SeguimientoScreen cartProps={commonCartProps} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/transacciones"
          element={
            estaLogueado ? <HistorialTransacciones cartProps={commonCartProps} /> : <Navigate to="/login" replace />
          }
        />

        {/* Perfil con callback para propagar el nuevo hash de contraseña */}
        <Route
          path="/perfil"
          element={
            estaLogueado ? (
              <PerfilScreen
                cartProps={commonCartProps}
                onActualizarPassword={handleActualizarPasswordUsuario}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/notificaciones"
          element={
            estaLogueado ? (
              <HistorialNotificacionesScreen cartProps={commonCartProps} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Rutas Emprendedor: Solo si soyEmpresa */}
        <Route
          path="/emprendedor"
          element={
            estaLogueado && currentUser?.soyEmpresa ? (
              <EmprendedorDashboard
                onCrearProducto={(nuevo) => handleEditarProducto(nuevo, null)}
                cartProps={commonCartProps}
                currentUser={currentUser}
              />
            ) : (
              <Navigate to={estaLogueado ? "/comprador" : "/login"} replace />
            )
          }
        />

        <Route
          path="/emprendedor/mensajes"
          element={
            estaLogueado && currentUser?.soyEmpresa ? (
              <MensajeriaScreen cartProps={commonCartProps} />
            ) : (
              <Navigate to={estaLogueado ? "/comprador" : "/login"} replace />
            )
          }
        />

        <Route
          path="/emprendedor/publicaciones"
          element={
            estaLogueado && currentUser?.soyEmpresa ? (
              <PublicationsScreen
                productos={productos}
                onEditarProducto={handleEditarProducto}
                onEliminarProducto={handleEliminarProducto}
                currentUser={currentUser}
                cartProps={commonCartProps}
              />
            ) : (
              <Navigate to={estaLogueado ? "/comprador" : "/login"} replace />
            )
          }
        />

        <Route
          path="/emprendedor/stock"
          element={
            estaLogueado && currentUser?.soyEmpresa ? (
              <AdministrarStock
                productos={productos}
                onAtras={() => navigate('/emprendedor')}
                onActualizarStock={handleActualizarStock}
                currentUser={currentUser}
                cartProps={commonCartProps}
              />
            ) : (
              <Navigate to={estaLogueado ? "/comprador" : "/login"} replace />
            )
          }
        />

        <Route
          path="/emprendedor/devoluciones"
          element={
            estaLogueado && currentUser?.soyEmpresa ? (
              <AtenderDevolucionesScreen
                cartProps={commonCartProps}
                currentUser={currentUser}
              />
            ) : (
              <Navigate to={estaLogueado ? "/comprador" : "/login"} replace />
            )
          }
        />

        <Route
          path="/emprendedor/notificaciones"
          element={
            estaLogueado && currentUser?.soyEmpresa ? (
              <HistorialNotificacionesScreen cartProps={commonCartProps} />
            ) : (
              <Navigate to={estaLogueado ? "/comprador" : "/login"} replace />
            )
          }
        />

        {/* Rutas Administrador */}
        <Route
          path="/admin"
          element={
            estaLogueadoAdmin ? (
              <AdminDashboard cartProps={commonCartProps} />
            ) : (
              <AdminLoginScreen
                onLoginSuccess={() => setEstaLogueadoAdmin(true)}
                onVolverSitio={() => navigate('/login')}
              />
            )
          }
        />

        <Route
          path="/admin/activar-cuenta"
          element={
            <ActivarCuentaAdminScreen
              onActivacionExitosa={() => setEstaLogueadoAdmin(true)}
            />
          }
        />

        <Route
          path="/admin/emprendedores"
          element={
            estaLogueadoAdmin ? <EmprendedoresAdminScreen cartProps={commonCartProps} /> : <Navigate to="/admin" replace />
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
              <ZonaFormScreen zonas={zonasTransporte} onGuardarZona={handleGuardarZona} cartProps={commonCartProps} />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />

        <Route
          path="/admin/transporte/editar/:id"
          element={
            estaLogueadoAdmin ? (
              <ZonaFormScreen zonas={zonasTransporte} onGuardarZona={handleGuardarZona} cartProps={commonCartProps} />
            ) : (
              <Navigate to="/admin" replace />
            )
          }
        />

        <Route
          path="/admin/comentarios"
          element={
            estaLogueadoAdmin ? <ComentariosAdminScreen cartProps={commonCartProps} /> : <Navigate to="/admin" replace />
          }
        />

        <Route
          path="/admin/devoluciones"
          element={
            estaLogueadoAdmin ? <DevolucionesAdminScreen cartProps={commonCartProps} /> : <Navigate to="/admin" replace />
          }
        />

        <Route
          path="/admin/notificaciones"
          element={
            estaLogueadoAdmin ? (
              <HistorialNotificacionesScreen cartProps={commonCartProps} />
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