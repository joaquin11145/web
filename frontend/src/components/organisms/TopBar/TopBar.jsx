import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';

import MenuIcon from '@mui/icons-material/Menu';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// Alertas precargadas para demostración según rol
const alertasIniciales = [
  // Comprador
  { id: 1, rol: 'comprador', titulo: 'Pedido en camino', mensaje: 'Tu pedido #1042 ha cambiado a estado: En reparto a Viña del Mar.', fecha: 'Hace 10 min', leida: false },
  { id: 2, rol: 'comprador', titulo: 'Cotización respondida', mensaje: 'Textiles del Sur ha validado los precios de tu cotización #COT-891.', fecha: 'Hace 2 horas', leida: false },
  { id: 3, rol: 'comprador', titulo: 'Mensaje nuevo', mensaje: 'Soporte MeyerExpress te envió un mensaje.', fecha: 'Ayer', leida: true },

  // Emprendedor
  { id: 101, rol: 'emprendedor', titulo: 'Nueva Venta Recibida', mensaje: 'Camila Rojas compró 2 unidades de "Polera Roja (S)".', fecha: 'Hace 5 min', leida: false },
  { id: 102, rol: 'emprendedor', titulo: 'Solicitud de Devolución', mensaje: 'El cliente Andrés Morales solicitó devolución para el pedido #983.', fecha: 'Hace 1 hora', leida: false },
  { id: 103, rol: 'emprendedor', titulo: 'Stock Bajo', mensaje: 'Quedan solo 2 unidades de "Producto 2 (Talla 36)".', fecha: 'Hace 1 día', leida: true },

  // Administrador
  { id: 201, rol: 'admin', titulo: 'Nuevo Emprendedor Registrado', mensaje: 'La empresa "Calzados Chile SpA" solicita validación de cuenta.', fecha: 'Hace 20 min', leida: false },
  { id: 202, rol: 'admin', titulo: 'Zona de Transporte Inhabilitada', mensaje: 'Se detectó corte de ruta en la zona "Valparaíso Costa".', fecha: 'Hace 3 horas', leida: false },
];

export default function TopBar({
  onMenuClick,
  username = 'usuario',
  currentUser = {},
  onMenuAction,
  onOpenCart,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const esModoAdmin = location.pathname.startsWith('/admin');
  const esModoEmprendedor = location.pathname.startsWith('/emprendedor');
  const esAdmin =
    currentUser?.rol === 'admin' ||
    (currentUser?.rut || '').replace(/[^0-9kK]/g, '') === '999999999';
  const puedeSerEmprendedor = Boolean(currentUser?.soyEmpresa) || esAdmin;

  const rolActual = esModoAdmin ? 'admin' : esModoEmprendedor ? 'emprendedor' : 'comprador';

  // Menú de usuario
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Popover de Campanita
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const openNotif = Boolean(anchorElNotif);

  const [notificaciones, setNotificaciones] = useState(alertasIniciales);

  const notificacionesRol = notificaciones.filter((n) => n.rol === rolActual);
  const noLeidasCount = notificacionesRol.filter((n) => !n.leida).length;

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleOpenNotif = (event) => setAnchorElNotif(event.currentTarget);
  const handleCloseNotif = () => setAnchorElNotif(null);

  const handleOptionClick = (opcion) => {
    if (onMenuAction) onMenuAction(opcion);
    handleCloseMenu();
  };

  const handleCartClick = () => {
    if (onOpenCart) onOpenCart();
    else navigate('/carrito');
  };

  const handleMarcarTodasLeidas = () => {
    console.log('[BACKEND PENDIENTE] PATCH /api/notificaciones/marcar-todas-leidas', { rol: rolActual });
    setNotificaciones((prev) =>
      prev.map((n) => (n.rol === rolActual ? { ...n, leida: true } : n))
    );
  };

  const handleMarcarLeida = (id) => {
    console.log('[BACKEND PENDIENTE] PATCH /api/notificaciones/' + id + '/leer');
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const handleIrAHistorialCompleto = () => {
    handleCloseNotif();
    if (esModoEmprendedor) navigate('/emprendedor/notificaciones');
    else if (esModoAdmin) navigate('/admin/notificaciones');
    else navigate('/notificaciones');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'var(--color-primario)', boxShadow: 'none' }}>
      <Toolbar sx={{ gap: 1 }}>
        <IconButton edge="start" color="inherit" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>

        <Box
          component="img"
          src="/logo.png"
          alt="MeyerExpress"
          onClick={() => {
            if (esModoAdmin) navigate('/admin');
            else if (esModoEmprendedor) navigate('/emprendedor');
            else navigate('/comprador');
          }}
          sx={{ height: 32, ml: 1, cursor: 'pointer' }}
        />

        {esModoAdmin && (
          <Typography
            sx={{
              ml: 1.5,
              fontSize: '0.85rem',
              fontWeight: 800,
              bgcolor: 'rgba(0, 0, 0, 0.22)',
              px: 1.5,
              py: 0.4,
              borderRadius: '12px',
              color: 'var(--color-texto-claro)',
            }}
          >
            ADMINISTRADOR
          </Typography>
        )}

        {!esModoAdmin && esModoEmprendedor && (
          <Typography
            sx={{
              ml: 1.5,
              fontSize: '0.82rem',
              fontWeight: 700,
              bgcolor: 'rgba(0, 0, 0, 0.2)',
              px: 1.2,
              py: 0.3,
              borderRadius: '12px',
              color: 'var(--color-texto-claro)',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            PANEL EMPRENDEDOR
          </Typography>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Favoritos (Solo para Comprador) */}
        {!esModoAdmin && !esModoEmprendedor && (
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', mr: 1 }}
            onClick={() => navigate('/favoritos')}
          >
            <StarBorderIcon fontSize="small" />
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Favoritos
            </Typography>
          </Box>
        )}

        {/* CAMPANITA DE NOTIFICACIONES */}
        <IconButton
          color="inherit"
          onClick={handleOpenNotif}
          sx={{
            p: 1,
            borderRadius: '50%',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
          }}
        >
          <Badge
            badgeContent={noLeidasCount}
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: '#222222',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.72rem',
                border: '1.5px solid var(--color-primario)',
              },
            }}
          >
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        {/* POPOVER FLOTANTE DE ALERTAS */}
        <Popover
          open={openNotif}
          anchorEl={anchorElNotif}
          onClose={handleCloseNotif}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                width: 320,
                maxHeight: 460,
                borderRadius: '16px',
                border: '1.2px solid var(--color-texto-oscuro)',
                bgcolor: 'var(--color-fondo)',
                mt: 1,
                p: 1.5,
                boxShadow: '0 8px 24px rgba(44, 44, 42, 0.25)',
                display: 'flex',
                flexDirection: 'column',
              },
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: 0.5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--color-texto-oscuro)' }}>
              Notificaciones {noLeidasCount > 0 && `(${noLeidasCount})`}
            </Typography>
            {noLeidasCount > 0 && (
              <Button
                size="small"
                onClick={handleMarcarTodasLeidas}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  p: 0,
                  color: 'var(--color-primario)',
                  fontWeight: 600,
                  '&:hover': { background: 'none', textDecoration: 'underline' },
                }}
              >
                Marcar leídas
              </Button>
            )}
          </Box>

          <Divider sx={{ borderColor: 'var(--color-borde)', mb: 1 }} />

          <List disablePadding sx={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
            {notificacionesRol.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'var(--color-borde)', textAlign: 'center', py: 3, fontStyle: 'italic' }}>
                No tienes notificaciones
              </Typography>
            ) : (
              notificacionesRol.map((notif) => (
                <ListItemButton
                  key={notif.id}
                  onClick={() => handleMarcarLeida(notif.id)}
                  sx={{
                    borderRadius: '10px',
                    p: 1.2,
                    bgcolor: notif.leida ? 'transparent' : 'rgba(195, 85, 43, 0.08)',
                    border: '1px solid',
                    borderColor: notif.leida ? 'var(--color-borde)' : 'var(--color-primario)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 0.3,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(195, 85, 43, 0.12)' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: notif.leida ? 600 : 800, fontSize: '0.86rem', color: 'var(--color-texto-oscuro)' }}>
                      {notif.titulo}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontSize: '0.72rem' }}>
                      {notif.fecha}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'var(--color-texto-oscuro)', lineHeight: 1.3 }}>
                    {notif.mensaje}
                  </Typography>
                </ListItemButton>
              ))
            )}
          </List>

          <Divider sx={{ borderColor: 'var(--color-borde)', my: 1 }} />

          <Button
            fullWidth
            size="small"
            onClick={handleIrAHistorialCompleto}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              color: 'var(--color-primario)',
              fontSize: '0.84rem',
              '&:hover': { bgcolor: 'rgba(195, 85, 43, 0.08)' },
            }}
          >
            Ver historial completo de alertas
          </Button>
        </Popover>

        {/* ACCIONES DEL PERFIL / SALIR */}
        {esModoAdmin ? (
          <Button
            startIcon={<LogoutIcon />}
            onClick={() => navigate('/comprador')}
            sx={{
              color: 'var(--color-texto-claro)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              bgcolor: 'rgba(0, 0, 0, 0.15)',
              borderRadius: '16px',
              px: 1.8,
              ml: 1,
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.28)' },
            }}
          >
            Salir al Sitio
          </Button>
        ) : (
          <>
            <Box
              onClick={handleOpenMenu}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                ml: 1,
                cursor: 'pointer',
                px: 1,
                py: 0.5,
                borderRadius: '20px',
                '&:hover': { opacity: 0.9 },
              }}
            >
              <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PersonIcon fontSize="small" sx={{ color: 'var(--color-texto-claro)' }} />
              </Box>
              <Typography variant="body2" sx={{ color: 'var(--color-texto-claro)', fontWeight: 600 }}>
                {username}
              </Typography>
            </Box>

            <Menu
              id="user-profile-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{
                paper: {
                  sx: {
                    minWidth: 230,
                    borderRadius: '16px',
                    border: '1.2px solid var(--color-texto-oscuro)',
                    bgcolor: 'var(--color-fondo)',
                    mt: 1,
                    p: 0.5,
                    boxShadow: '0 8px 24px rgba(44, 44, 42, 0.25)',
                  },
                },
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2, pt: 1.5, pb: 1.5, gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      bgcolor: 'var(--color-primario)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <PersonIcon sx={{ color: 'var(--color-texto-claro)' }} fontSize="small" />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                    {username}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => handleOptionClick('Perfil')}
                  sx={{
                    borderRadius: '18px',
                    borderColor: 'var(--color-primario)',
                    color: 'var(--color-primario)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    textTransform: 'none',
                    py: 0.4,
                    '&:hover': {
                      borderColor: 'var(--color-primario)',
                      bgcolor: 'transparent',
                      opacity: 0.8,
                    },
                  }}
                >
                  Ver perfil
                </Button>
              </Box>

              <Divider sx={{ borderColor: 'var(--color-borde)', my: 0.5 }} />

              {/* Botón Modo Administrador visible cuando el usuario tiene rol admin */}
              {esAdmin && (
                <MenuItem
                  onClick={() => handleOptionClick('Modo Administrador')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--color-texto-oscuro)',
                    py: 1,
                    mx: 0.5,
                    '&:hover': { color: 'var(--color-primario)' },
                  }}
                >
                  <AdminPanelSettingsOutlinedIcon fontSize="small" sx={{ color: 'inherit' }} />
                  Modo Administrador
                </MenuItem>
              )}

              {/* Cambio entre Modo Emprendedor e Ingresar como Cliente */}
              {esModoEmprendedor ? (
                <MenuItem
                  onClick={() => handleOptionClick('Modo Comprador')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--color-texto-oscuro)',
                    py: 1,
                    mx: 0.5,
                    '&:hover': { color: 'var(--color-primario)' },
                  }}
                >
                  <ShoppingBagOutlinedIcon fontSize="small" sx={{ color: 'inherit' }} />
                  Ingresar como Cliente
                </MenuItem>
              ) : (
                puedeSerEmprendedor && (
                  <MenuItem
                    onClick={() => handleOptionClick('Modo Emprendedor')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.2,
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: 'var(--color-texto-oscuro)',
                      py: 1,
                      mx: 0.5,
                      '&:hover': { color: 'var(--color-primario)' },
                    }}
                  >
                    <StorefrontIcon fontSize="small" sx={{ color: 'inherit' }} />
                    Modo Emprendedor
                  </MenuItem>
                )
              )}

              {(puedeSerEmprendedor || esAdmin) && (
                <Divider sx={{ borderColor: 'var(--color-borde)', my: 0.5 }} />
              )}

              <MenuItem
                onClick={() => handleOptionClick('Cerrar Sesión')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--color-primario)',
                  py: 1,
                  mx: 0.5,
                  '&:hover': { opacity: 0.85 },
                }}
              >
                <LogoutIcon fontSize="small" sx={{ color: 'inherit' }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>

            {!esModoEmprendedor && (
              <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleCartClick}>
                <ShoppingCartIcon fontSize="small" />
              </IconButton>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}