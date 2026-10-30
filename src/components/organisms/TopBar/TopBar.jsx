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
import MenuIcon from '@mui/icons-material/Menu';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

export default function TopBar({ onMenuClick, username = 'usuario', onMenuAction, onOpenCart }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar si estamos en el panel del emprendedor
  const esModoEmprendedor = location.pathname.startsWith('/emprendedor');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (opcion) => {
    if (onMenuAction) {
      onMenuAction(opcion);
    }
    handleCloseMenu();
  };

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      navigate('/carrito');
    }
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
          onClick={() => navigate(esModoEmprendedor ? '/emprendedor' : '/comprador')}
          sx={{ height: 32, ml: 1, cursor: 'pointer' }}
        />

        {/* Indicador sutil de Modo Emprendedor */}
        {esModoEmprendedor && (
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

        {/* Favoritos solo visible para el Comprador */}
        {!esModoEmprendedor && (
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
            onClick={() => navigate('/favoritos')}
          >
            <StarBorderIcon fontSize="small" />
            <Typography variant="body2">Favoritos</Typography>
          </Box>
        )}

        {/* Menú de usuario */}
        <Box
          onClick={handleOpenMenu}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            ml: 2,
            cursor: 'pointer',
            px: 1,
            py: 0.5,
            borderRadius: '20px',
            '&:hover': { opacity: 0.9 },
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PersonIcon fontSize="small" sx={{ color: 'var(--color-texto-claro)' }} />
          </Box>
          <Typography variant="body2" sx={{ color: 'var(--color-texto-claro)', fontWeight: 600 }}>
            {username}
          </Typography>
        </Box>

        {/* Menú desplegable */}
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
          {/* Header con Perfil */}
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

          {/* Alternador dinámico según el modo actual */}
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
          )}

          <Divider sx={{ borderColor: 'var(--color-borde)', my: 0.5 }} />

          {/* Cerrar Sesión */}
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

        {/* Carrito de compras SOLO visible en Modo Comprador */}
        {!esModoEmprendedor && (
          <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleCartClick}>
            <ShoppingCartIcon fontSize="small" />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}