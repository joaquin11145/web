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

const categorias = [
  { nombre: 'Categoria 1', subcategorias: ['Subcategoria 1', 'Subcategoria 2', 'Subcategoria 3'] },
  { nombre: 'Categoria 2', subcategorias: ['Subcategoria 4', 'Subcategoria 5'] },
  { nombre: 'Categoria 3', subcategorias: ['Subcategoria 6', 'Subcategoria 7'] },
  { nombre: 'Categoria 4', subcategorias: ['Subcategoria 8', 'Subcategoria 9'] },
  { nombre: 'Categoria 5', subcategorias: ['Subcategoria 10', 'Subcategoria 11'] },
];

export default function Sidebar({ open, onClose, onNavigate }) {
  const location = useLocation();
  const esModoEmprendedor = location.pathname.startsWith('/emprendedor');

  const [categoriaHover, setCategoriaHover] = useState(null);

  const handleItemClick = (opcion) => {
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

  const opcionesActuales = esModoEmprendedor ? opcionesEmprendedor : opcionesComprador;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'var(--color-fondo)',
            borderRight: '1.5px solid var(--color-texto-oscuro)',
            boxShadow: '8px 0 24px rgba(44, 44, 42, 0.15)',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', height: '100%' }} onMouseLeave={() => setCategoriaHover(null)}>
        {/* Panel Principal */}
        <Box sx={{ width: 260, p: 2, display: 'flex', flexDirection: 'column' }} role="presentation">
          <Box sx={{ px: 1, py: 1.5, mb: 1 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '1.15rem',
                color: 'var(--color-primario)',
                letterSpacing: '0.3px',
              }}
            >
              {esModoEmprendedor ? 'Panel Emprendedor' : 'Menú Principal'}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: 'var(--color-borde)', mb: 1.5 }} />

          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
            {opcionesActuales.map((item) => (
              <ListItemButton
                key={item.label}
                onClick={() => handleItemClick(item.label)}
                sx={{
                  borderRadius: '10px',
                  py: 1,
                  px: 1.5,
                  color: 'var(--color-texto-oscuro)',
                  '&:hover': {
                    bgcolor: 'rgba(195, 85, 43, 0.1)',
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

          {!esModoEmprendedor && (
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
                {categorias.map((categoria) => {
                  const activo = categoriaHover === categoria.nombre;
                  return (
                    <ListItemButton
                      key={categoria.nombre}
                      selected={activo}
                      onMouseEnter={() => setCategoriaHover(categoria.nombre)}
                      onClick={() => handleItemClick(categoria.nombre)}
                      sx={{
                        borderRadius: '10px',
                        py: 0.8,
                        px: 1.5,
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
                        primary={categoria.nombre}
                        slotProps={{ primary: { fontWeight: activo ? 700 : 500, fontSize: '0.9rem' } }}
                      />
                      <ChevronRightIcon fontSize="small" sx={{ color: activo ? 'var(--color-primario)' : 'var(--color-borde)' }} />
                    </ListItemButton>
                  );
                })}
              </List>
            </>
          )}
        </Box>

        {!esModoEmprendedor && categoriaHover && (
          <Paper
            elevation={4}
            sx={{
              width: 230,
              borderRadius: 0,
              borderLeft: '1.5px solid var(--color-texto-oscuro)',
              bgcolor: 'var(--color-fondo)',
              p: 2.5,
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
          >
            {categorias
              .filter((c) => c.nombre === categoriaHover)
              .map((c) => (
                <Box key={c.nombre}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: 'var(--color-primario)',
                      mb: 1.5,
                      fontSize: '0.98rem',
                    }}
                  >
                    {c.nombre}
                  </Typography>
                  <Divider sx={{ borderColor: 'var(--color-borde)', mb: 1.5 }} />
                  <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {c.subcategorias.map((sub) => (
                      <ListItemButton
                        key={sub}
                        onClick={() => handleItemClick(sub)}
                        sx={{
                          py: 0.6,
                          px: 1,
                          borderRadius: '8px',
                          color: 'var(--color-texto-oscuro)',
                          '&:hover': {
                            bgcolor: 'rgba(195, 85, 43, 0.1)',
                            color: 'var(--color-primario)',
                          },
                        }}
                      >
                        <ListItemText
                          primary={sub}
                          slotProps={{ primary: { fontSize: '0.86rem', fontWeight: 500 } }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              ))}
          </Paper>
        )}
      </Box>
    </Drawer>
  );
}