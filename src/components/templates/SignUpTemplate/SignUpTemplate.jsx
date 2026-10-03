import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function SignUpTemplate({ formSlot, onVolverLogin }) {
  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        bgcolor: 'var(--color-fondo)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Header Bar a pantalla completa */}
      <Box
        component="header"
        sx={{
          width: '100%',
          height: { xs: 65, md: 80 },
          bgcolor: 'var(--color-primario)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Typography
          sx={{
            color: 'var(--color-texto-claro)',
            fontFamily: "'Cinzel', 'Copperplate', 'Georgia', serif",
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.4rem', md: '2.8rem' },
            letterSpacing: '1px',
            userSelect: 'none',
          }}
        >
          MeyerExpress
        </Typography>
      </Box>

      {/* 2. Contenedor central flexible */}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 1100,
          margin: '0 auto',
          px: { xs: 3, sm: 5, md: 8 },
          py: { xs: 3, md: 5 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Fila superior con título y botón para volver */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 3, md: 4 } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 500,
              color: 'var(--color-texto-oscuro)',
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
            }}
          >
            Ingrese sus Datos
          </Typography>

          <Typography
            onClick={onVolverLogin}
            sx={{
              color: 'var(--color-primario)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            ← Volver al Login
          </Typography>
        </Box>

        {/* Slot del Formulario de registro */}
        <Box sx={{ width: '100%', flex: 1 }}>
          {formSlot}
        </Box>
      </Box>
    </Box>
  );
}