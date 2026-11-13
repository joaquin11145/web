import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function LoginTemplate({ brandSlot, formSlot }) {
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
          boxShadow: 'none',
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

      {/* 2. Cuerpo del lienzo: fondo suave de Figma */}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: 1100,
          margin: '0 auto',
          px: { xs: 3, sm: 5, md: 8 },
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Título alineado a la izquierda según el diseño */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 500,
            color: 'var(--color-texto-oscuro)',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
            mb: { xs: 4, md: 6 },
          }}
        >
          Iniciar Sesión
        </Typography>

        {/* Grilla de 2 columnas: Logo a la izquierda, Formulario a la derecha */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: { xs: 5, md: 8 },
            flex: 1,
          }}
        >
          {/* Columna Izquierda: Logo */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: { xs: '100%', md: '45%' },
            }}
          >
            {brandSlot}
          </Box>

          {/* Columna Derecha: Formulario */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: { xs: '100%', md: '55%' },
            }}
          >
            {formSlot}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}