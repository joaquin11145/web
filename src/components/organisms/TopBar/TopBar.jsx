import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function TopBar({ onMenuClick, username = 'usuario', onMenuAction }) {
  const navigate = useNavigate();

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
          onClick={() => navigate('/comprador')}
          sx={{ height: 32, ml: 1, cursor: 'pointer' }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
          onClick={() => navigate('/favoritos')}
        >
          <StarBorderIcon fontSize="small" />
          <Typography variant="body2">Favoritos</Typography>
        </Box>


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
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
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
            <PersonIcon fontSize="small" sx={{ color: '#fff' }} />
          </Box>
          <Typography variant="body2" sx={{ color: '#fff' }}>
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
          PaperProps={{
            sx: { minWidth: 220, borderRadius: 2, mt: 1 },
          }}
        >

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: 'var(--color-primario)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PersonIcon sx={{ color: '#fff' }} fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{username}</Typography>
              <Typography
                onClick={() => handleOptionClick('Ver Perfil')}
                sx={{ fontSize: '0.8rem', color: 'var(--color-primario)', cursor: 'pointer' }}
              >
                Ver perfil
              </Typography>
            </Box>
          </Box>

          <Divider />

          <MenuItem onClick={() => handleOptionClick('Iniciar Sesión')} sx={{ fontSize: '0.9rem', py: 1 }}>
            Iniciar Sesión
          </MenuItem>

          <MenuItem onClick={() => handleOptionClick('Registrarse')} sx={{ fontSize: '0.9rem', py: 1 }}>
            Registrarse
          </MenuItem>
          
          <Divider />

          <MenuItem onClick={() => handleOptionClick('Cerrar Sesión')} sx={{ fontSize: '0.9rem', py: 1 }}>
            Cerrar Sesión
          </MenuItem>
        </Menu>

        <IconButton color="inherit" sx={{ ml: 1 }} onClick={() => navigate('/carrito')}>
          <ShoppingCartIcon fontSize="small" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}