import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function AdminLoginScreen({ onLoginSuccess, onVolverSitio }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación de credenciales de administrador en memoria
    if (usuario.trim().toLowerCase() === 'admin' && password === 'admin123') {
      setError('');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setError('Credenciales incorrectas. Verifique usuario y contraseña.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'var(--color-fondo)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        boxSizing: 'border-box',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: 'var(--color-fondo)',
          border: '1.5px solid var(--color-texto-oscuro)',
          borderRadius: '26px',
          boxShadow: '0 16px 40px rgba(44, 44, 42, 0.25)',
          p: { xs: 3, sm: '36px 36px 30px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Ícono de Administrador */}
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            bgcolor: 'var(--color-primario)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-texto-claro)',
            mb: 2,
          }}
        >
          <AdminPanelSettingsIcon sx={{ fontSize: 34 }} />
        </Box>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1.35rem',
            color: 'var(--color-texto-oscuro)',
            letterSpacing: '0.3px',
          }}
        >
          Acceso Administrador
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: 'var(--color-borde)',
            fontSize: '0.82rem',
            mb: 3,
            textAlign: 'center',
          }}
        >
          Área restringida para gestión de la plataforma
        </Typography>

        {/* Campos de acceso */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.8, mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)', mb: 0.4, display: 'block' }}>
              Usuario Admin
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="admin"
              value={usuario}
              onChange={(e) => {
                setUsuario(e.target.value);
                setError('');
              }}
              required
              sx={adminInputStyle}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)', mb: 0.4, display: 'block' }}>
              Contraseña
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
              sx={adminInputStyle}
            />
          </Box>

          {error && (
            <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 600, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
        </Box>

        {/* Botones de acción */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.2, mt: 1 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              height: 40,
              borderRadius: '20px',
              bgcolor: 'var(--color-primario)',
              color: 'var(--color-texto-claro)',
              border: '1.2px solid var(--color-texto-oscuro)',
              fontWeight: 600,
              fontSize: '0.92rem',
              textTransform: 'none',
              boxShadow: '0 3px 6px rgba(44, 44, 42, 0.3)',
              '&:hover': {
                bgcolor: 'var(--color-primario-hover, var(--color-primario))',
              },
            }}
          >
            Ingresar al Panel
          </Button>

          {onVolverSitio && (
            <Button
              type="button"
              fullWidth
              variant="text"
              onClick={onVolverSitio}
              sx={{
                color: 'var(--color-texto-oscuro)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.86rem',
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Volver al Catálogo
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

const adminInputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    bgcolor: 'var(--color-input-bg)',
    '& fieldset': { borderColor: 'var(--color-texto-oscuro)' },
    '&:hover fieldset': { borderColor: 'var(--color-texto-oscuro)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-primario)' },
  },
  '& .MuiInputBase-input': {
    color: 'var(--color-texto-oscuro)',
    fontSize: '0.88rem',
    py: 0.9,
  },
};