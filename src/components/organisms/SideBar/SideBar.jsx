import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

const categorias = [
  { nombre: 'Categoria 1', subcategorias: ['Subcategoria 1', 'Subcategoria 2', 'Subcategoria 3'] },
  { nombre: 'Categoria 2', subcategorias: ['Subcategoria 4', 'Subcategoria 5'] },
  { nombre: 'Categoria 3', subcategorias: ['Subcategoria 6', 'Subcategoria 7'] },
  { nombre: 'Categoria 4', subcategorias: ['Subcategoria 8', 'Subcategoria 9'] },
  { nombre: 'Categoria 5', subcategorias: ['Subcategoria 10', 'Subcategoria 11'] },
];

export default function Sidebar({ open, onClose, onNavigate }) {
  const location = useLocation();
  const esModoAdmin = location.pathname.startsWith('/admin');
  const esModoEmprendedor = location.pathname.startsWith('/emprendedor');

  const [anchorEl, setAnchorEl] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  const handleOpenSubmenu = (event, cat) => {
    setAnchorEl(event.currentTarget);
    setCategoriaActiva(cat);
  };

  const handleCloseSubmenu = () => {
    setAnchorEl(null);
    setCategoriaActiva(null);
  };

  const handleItemClick = (opcion) => {
    handleCloseSubmenu();
    if (onNavigate) {
      onNavigate(opcion);
    }
    if (onClose) {
      onClose();
    }
  };

  const opcionesComprador = [
    { label: 'Mensajes', icon: <EmailOutlinedIcon fontSize="small" /> },
    { label: 'Tus Pedidos', icon: <ShoppingBagOutlinedIcon fontSize="small" /> },
    { label: 'Cotizaciones', icon: <RequestQuoteOutlinedIcon fontSize="small" /> },
    { label: 'Transacciones', icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
  ];

  const opcionesEmprendedor = [
    { label: 'Mensajes', icon: <EmailOutlinedIcon fontSize="small" /> },
    { label: 'Pedidos Recibidos', icon: <ShoppingBagOutlinedIcon fontSize="small" /> },
    { label: 'Devoluciones', icon: <AssignmentReturnOutlinedIcon fontSize="small" /> },
    { label: 'Publicaciones', icon: <ListAltOutlinedIcon fontSize="small" /> },
    { label: 'Administrar Stock', icon: <Inventory2OutlinedIcon fontSize="small" /> },
    { label: 'Ingresar como cliente', icon: <StorefrontIcon fontSize="small" /> },
  ];

  const opcionesAdmin = [
    { label: 'Administrar Panel', icon: <AdminPanelSettingsOutlinedIcon fontSize="small" /> },
    { label: 'Volver a Comprador', icon: <StorefrontIcon fontSize="small" /> },
    { label: 'Volver a Emprendedor', icon: <StorefrontIcon fontSize="small" /> },
  ];

  const opcionesActuales = esModoAdmin
    ? opcionesAdmin
    : esModoEmprendedor
    ? opcionesEmprendedor
    : opcionesComprador;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => {
        handleCloseSubmenu();
        if (onClose) onClose();
      }}
      slotProps={{
        paper: {
          sx: {
            width: 280,
            my: { xs: 1, sm: 2 },
            ml: { xs: 1, sm: 2 },
            height: { xs: 'calc(100vh - 16px)', sm: 'calc(100vh - 32px)' },
            borderRadius: '24px', // Esquinas redondeadas estilo tarjeta flotante
            border: '1.5px solid var(--color-texto-oscuro)',
            bgcolor: 'var(--color-fondo)',
            boxShadow: '0 12px 36px rgba(44, 44, 42, 0.22)',
            overflowX: 'visible',
            overflowY: 'auto',
          },
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          p: 2.2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
        }}
        role="presentation"
        onMouseLeave={handleCloseSubmenu}
      >
        {/* Cabecera del Sidebar */}
        <Box sx={{ px: 1, py: 1, mb: 1 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '1.2rem',
              color: 'var(--color-primario)',
              letterSpacing: '0.3px',
            }}
          >
            {esModoAdmin
              ? 'Panel Administrador'
              : esModoEmprendedor
              ? 'Panel Emprendedor'
              : 'Menú Principal'}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'var(--color-borde)', mb: 1.5 }} />

        {/* Opciones directas según el rol */}
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
          {opcionesActuales.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => handleItemClick(item.label)}
              sx={{
                borderRadius: '14px', // Ítems redondeados estilo píldora
                py: 1,
                px: 1.6,
                color: 'var(--color-texto-oscuro)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(195, 85, 43, 0.12)',
                  color: 'var(--color-primario)',
                  '& .MuiListItemIcon-root': { color: 'var(--color-primario)' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'var(--color-texto-oscuro)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { fontWeight: 600, fontSize: '0.92rem' } }}
              />
            </ListItemButton>
          ))}
        </List>

        {/* Categorías del catálogo solo para Comprador */}
        {!esModoEmprendedor && !esModoAdmin && (
          <>
            <Divider sx={{ borderColor: 'var(--color-borde)', my: 2 }} />

            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                mb: 1,
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--color-borde)',
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              Categorías
            </Typography>

            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, overflowY: 'auto' }}>
              {categorias.map((cat) => {
                const activo = categoriaActiva?.nombre === cat.nombre;
                return (
                  <ListItemButton
                    key={cat.nombre}
                    selected={activo}
                    onMouseEnter={(e) => handleOpenSubmenu(e, cat)}
                    onClick={() => handleItemClick(cat.nombre)}
                    sx={{
                      borderRadius: '14px',
                      py: 0.8,
                      px: 1.6,
                      color: activo ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                      bgcolor: activo ? 'rgba(195, 85, 43, 0.12) !important' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(195, 85, 43, 0.08)',
                        color: 'var(--color-primario)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 34, color: activo ? 'var(--color-primario)' : 'var(--color-borde)' }}>
                      <CategoryIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={cat.nombre}
                      slotProps={{ primary: { fontWeight: activo ? 700 : 500, fontSize: '0.9rem' } }}
                    />
                    <ChevronRightIcon fontSize="small" sx={{ color: activo ? 'var(--color-primario)' : 'var(--color-borde)' }} />
                  </ListItemButton>
                );
              })}
            </List>
          </>
        )}

        {/* Submenú Flotante Redondeado tipo Figma */}
        <Popper
          open={Boolean(anchorEl && categoriaActiva)}
          anchorEl={anchorEl}
          placement="right-start"
          transition
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 10], // Separación visual suave respecto al sidebar
              },
            },
          ]}
          sx={{ zIndex: 1400 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={180}>
              <Paper
                elevation={6}
                onMouseEnter={() => {}}
                onMouseLeave={handleCloseSubmenu}
                sx={{
                  minWidth: 230,
                  borderRadius: '20px', // Redondeado coordinado con el drawer
                  border: '1.5px solid var(--color-texto-oscuro)',
                  bgcolor: 'var(--color-fondo)',
                  p: 1.6,
                  boxShadow: '0 10px 28px rgba(44, 44, 42, 0.25)',
                  boxSizing: 'border-box',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.96rem',
                    color: 'var(--color-primario)',
                    px: 1.2,
                    py: 0.6,
                  }}
                >
                  {categoriaActiva?.nombre}
                </Typography>

                <Divider sx={{ borderColor: 'var(--color-borde)', my: 0.8 }} />

                <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {categoriaActiva?.subcategorias.map((sub) => (
                    <ListItemButton
                      key={sub}
                      onClick={() => handleItemClick(sub)}
                      sx={{
                        py: 0.8,
                        px: 1.4,
                        borderRadius: '12px',
                        color: 'var(--color-texto-oscuro)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: 'rgba(195, 85, 43, 0.12)',
                          color: 'var(--color-primario)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={sub}
                        slotProps={{ primary: { fontSize: '0.88rem', fontWeight: 500 } }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </Drawer>
  );
}