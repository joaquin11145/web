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
import { CrudFeedbackProvider } from './components/organisms/CrudFeedback/CrudFeedbackProvider.jsx';

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
import UsuariosAdminScreen from './pages/Admin/UsuariosAdminScreen.jsx';
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
    passwordPlanaInicial: '123',
    passwordHash: '',
    rol: 'comprador',
    name: 'Juan Pérez (Comprador)',
    email: 'juan.comprador@meyerexpress.cl',
    fechaNacimiento: '14/05/1995',
    soyEmpresa: false,
    nombreEmpresa: '',
    telefonos: ['+56 9 8765 4321'],
    direcciones: [
      { id: 1, direccion: 'Av. Libertad', numero: '750', comuna: 'Viña del Mar', region: 'Valparaíso' },
    ],
  },
  {
    rut: '22.222.222-2',
    passwordPlanaInicial: '123',
    passwordHash: '',
    rol: 'emprendedor',
    name: 'Carlos Gómez (Emprendedor)',
    email: 'contacto@textilesdelsur.cl',
    fechaNacimiento: '20/08/1988',
    soyEmpresa: true,
    nombreEmpresa: 'Textiles del Sur SpA',
    tieneWeb: true,
    paginaWeb: 'https://textilesdelsur.cl',
    telefonos: ['+56 9 1234 5678'],
    direcciones: [
      { id: 1, direccion: 'Av. Providencia', numero: '1240', comuna: 'Santiago', region: 'Metropolitana de Santiago' },
    ],
  },
  {
    rut: '99.999.999-9',
    passwordPlanaInicial: 'admin123',
    passwordHash: '',
    rol: 'admin',
    name: 'Superadministrador Sistema',
    email: 'admin@meyerexpress.cl',
    fechaNacimiento: '01/01/1985',
    soyEmpresa: false,
    nombreEmpresa: 'Administración Central',
    telefonos: ['+56 9 9999 9999'],
    direcciones: [
      { id: 1, direccion: 'Av. Guillermo Bühler', numero: '1500', comuna: 'Osorno', region: 'Los Lagos' },
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

  useEffect(() => {
    async function inicializarHashes() {
      const usuariosHasheados = await Promise.all(
        CUENTAS_DEMO.map(async (u) => {
          const hashGenerado = await hashPassword(u.passwordPlanaInicial || '123');
          const { passwordPlanaInicial, ...usuarioSinClavePlana } = u;
          return {
            ...usuarioSinClavePlana,
            passwordHash: hashGenerado,
          };
        })
      );
      setUsuariosRegistrados(usuariosHasheados);
      console.log('[SEGURIDAD BCRYPT] Cuentas iniciales inicializadas con hashes Bcrypt ($2a$10$...).');
    }
    inicializarHashes();
  }, []);

  const handleLogin = async (rut, password, recuerdame) => {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();

    let usuarioEncontrado = usuariosRegistrados.find(
      (u) => u.rut.replace(/[^0-9kK]/g, '').toUpperCase() === rutLimpio
    );

    let esAdminTemporal = false;
    if (!usuarioEncontrado) {
      try {
        const adminsTemp = JSON.parse(sessionStorage.getItem('admins_temporales') || '[]');
        const adminTemp = adminsTemp.find(
          (a) => (a.rut || '').replace(/[^0-9kK]/g, '').toUpperCase() === rutLimpio
        );
        if (adminTemp) {
          usuarioEncontrado = {
            ...adminTemp,
            rol: 'admin',
            name: adminTemp.nombre || 'Administrador',
          };
          esAdminTemporal = true;
        }
      } catch (e) {
        console.warn('Error leyendo admins temporales:', e);
      }
    }

    if (!usuarioEncontrado) {
      console.log('[BACKEND PENDIENTE] POST /api/auth/login -> Usuario no encontrado para RUT:', rutLimpio);
      return { success: false, mensaje: 'RUT o contraseña incorrectos.' };
    }

    let hashParaComparar = usuarioEncontrado.passwordHash;
    if (!hashParaComparar) {
      const claveFallback = usuarioEncontrado.rol === 'admin' ? 'admin123' : '123';
      hashParaComparar = await hashPassword(claveFallback);
    }

    const esPasswordCorrecta = await verifyPassword(password, hashParaComparar);

    console.log('[BACKEND PENDIENTE] POST /api/auth/login (Validación Bcrypt)', {
      rut: rutLimpio,
      rolDetectado: usuarioEncontrado.rol || (usuarioEncontrado.soyEmpresa ? 'emprendedor' : 'comprador'),
      passwordHashComparado: hashParaComparar,
      bcryptCompareMatch: esPasswordCorrecta,
      recuerdame,
    });

    if (!esPasswordCorrecta) {
      return { success: false, mensaje: 'RUT o contraseña incorrectos.' };
    }

    if (esAdminTemporal && usuarioEncontrado.requiereCambioPassword) {
      navigate('/admin/activar-cuenta', {
        state: { rut: usuarioEncontrado.rut, nombre: usuarioEncontrado.name },
      });
      return { success: true };
    }

    const usuarioSesion = {
      ...usuarioEncontrado,
      passwordHash: hashParaComparar,
    };

    setCurrentUser(usuarioSesion);
    setEstaLogueado(true);

    if (usuarioSesion.rol === 'admin' || rutLimpio === '999999999') {
      navigate('/admin');
    } else if (usuarioSesion.soyEmpresa || usuarioSesion.rol === 'emprendedor') {
      navigate('/emprendedor');
    } else {
      navigate('/comprador');
    }

    return { success: true };
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
      rol: nuevoUsuario.soyEmpresa ? 'emprendedor' : 'comprador',
      passwordHash: passwordHashGenerado,
      name: `${nuevoUsuario.nombres} ${nuevoUsuario.apellidos}`,
      fechaCreacion: new Date().toISOString(),
    };

    console.log('[BACKEND PENDIENTE] POST /api/auth/register (Hash Bcrypt generado):', {
      rut: nuevo.rut,
      email: nuevo.email,
      rol: nuevo.rol,
      fechaNacimiento: nuevo.fechaNacimiento,
      passwordHash: nuevo.passwordHash,
    });

    setUsuariosRegistrados((prev) => [...prev, nuevo]);
  };

  const handleCrearUsuarioAdmin = (nuevoUsuario) => {
    console.log('[BACKEND PENDIENTE] POST /api/admin/usuarios', {
      rut: nuevoUsuario.rut,
      name: nuevoUsuario.name,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol,
      passwordHash: nuevoUsuario.passwordHash,
    });
    setUsuariosRegistrados((prev) => [...prev, nuevoUsuario]);
  };

  const handleEditarUsuarioAdmin = (rutOriginal, datosActualizados) => {
    const rutLimpio = rutOriginal.replace(/[^0-9kK]/g, '').toUpperCase();
    console.log('[BACKEND PENDIENTE] PUT /api/admin/usuarios/' + rutLimpio, {
      ...datosActualizados,
      passwordHash: datosActualizados.passwordHash || '(sin cambios)',
    });
    setUsuariosRegistrados((prev) =>
      prev.map((u) =>
        u.rut.replace(/[^0-9kK]/g, '').toUpperCase() === rutLimpio
          ? { ...u, ...datosActualizados }
          : u
      )
    );
  };

  const handleEliminarUsuarioAdmin = (rut) => {
    const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    console.log('[BACKEND PENDIENTE] DELETE /api/admin/usuarios/' + rutLimpio);
    setUsuariosRegistrados((prev) =>
      prev.filter((u) => u.rut.replace(/[^0-9kK]/g, '').toUpperCase() !== rutLimpio)
    );
  };

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

  const esAdminActivo =
    estaLogueado &&
    (currentUser?.rol === 'admin' ||
      (currentUser?.rut || '').replace(/[^0-9kK]/g, '') === '999999999');

  const puedeAccederEmprendedor =
    estaLogueado && (Boolean(currentUser?.soyEmpresa) || esAdminActivo);

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
      <CrudFeedbackProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

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

          {/* Rutas Emprendedor */}
          <Route
            path="/emprendedor"
            element={
              puedeAccederEmprendedor ? (
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
              puedeAccederEmprendedor ? (
                <MensajeriaScreen cartProps={commonCartProps} />
              ) : (
                <Navigate to={estaLogueado ? "/comprador" : "/login"} replace />
              )
            }
          />

          <Route
            path="/emprendedor/publicaciones"
            element={
              puedeAccederEmprendedor ? (
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
              puedeAccederEmprendedor ? (
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
              puedeAccederEmprendedor ? (
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
              puedeAccederEmprendedor ? (
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
              esAdminActivo ? (
                <AdminDashboard
                  onCrearUsuarioAdmin={handleCrearUsuarioAdmin}
                  cartProps={commonCartProps}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/admin/usuarios"
            element={
              esAdminActivo ? (
                <UsuariosAdminScreen
                  usuarios={usuariosRegistrados}
                  onCrearUsuarioAdmin={handleCrearUsuarioAdmin}
                  onEditarUsuarioAdmin={handleEditarUsuarioAdmin}
                  onEliminarUsuarioAdmin={handleEliminarUsuarioAdmin}
                  cartProps={commonCartProps}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/admin/activar-cuenta"
            element={
              <ActivarCuentaAdminScreen
                onActivacionExitosa={() => {
                  setEstaLogueado(true);
                  navigate('/admin');
                }}
              />
            }
          />

          <Route
            path="/admin/emprendedores"
            element={
              esAdminActivo ? <EmprendedoresAdminScreen cartProps={commonCartProps} /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/admin/transporte"
            element={
              esAdminActivo ? (
                <TransporteScreen
                  zonas={zonasTransporte}
                  onToggleHabilitar={handleToggleHabilitarZona}
                  cartProps={commonCartProps}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/admin/transporte/agregar"
            element={
              esAdminActivo ? (
                <ZonaFormScreen zonas={zonasTransporte} onGuardarZona={handleGuardarZona} cartProps={commonCartProps} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/admin/transporte/editar/:id"
            element={
              esAdminActivo ? (
                <ZonaFormScreen zonas={zonasTransporte} onGuardarZona={handleGuardarZona} cartProps={commonCartProps} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/admin/comentarios"
            element={
              esAdminActivo ? <ComentariosAdminScreen cartProps={commonCartProps} /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/admin/devoluciones"
            element={
              esAdminActivo ? <DevolucionesAdminScreen cartProps={commonCartProps} /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/admin/notificaciones"
            element={
              esAdminActivo ? (
                <HistorialNotificacionesScreen cartProps={commonCartProps} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>

        {/* Modal Advertencia Vendedor Único */}
        <Dialog
          open={alertaVendedor.open}
          onClose={() => setAlertaVendedor({ open: false, vendedorExistente: '', vendedorNuevo: '' })}
          slotProps={{
            paper: {
              sx: {
                borderRadius: '20px',
                border: '1.5px solid var(--color-texto-oscuro)',
                p: 1.5,
                bgcolor: 'var(--color-fondo)',
              },
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
      </CrudFeedbackProvider>
    </ThemeProvider>
  );
}