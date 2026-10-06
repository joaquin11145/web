import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

export default function PhoneModal({ open, onClose, onAgregar }) {
  const [telefono, setTelefono] = useState('');
  const [listaTemporal, setListaTemporal] = useState([]);

  if (!open) return null;

  const handleAgregar = (e) => {
    if (e) e.preventDefault();
    if (!telefono.trim()) return;

    const nuevoNumero = telefono.trim();
    if (onAgregar) {
      onAgregar(nuevoNumero);
    }
    setListaTemporal((prev) => [...prev, nuevoNumero]);
    setTelefono('');
  };

  const handleQuitar = (index) => {
    setListaTemporal((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSalir = () => {
    setTelefono('');
    if (onClose) onClose();
  };

  return (
    /* Fondo oscuro semitransparente que cubre la pantalla */
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        p: 2,
        boxSizing: 'border-box',
      }}
      onClick={handleSalir}
    >
      {/* Tarjeta Modal Blanca Flotante con Esquinas Redondeadas de Figma */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: '100%',
          maxWidth: 580,
          bgcolor: 'var(--color-blanco)',
          border: '1.5px solid var(--color-borde)',
          borderRadius: '38px',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.38)',
          p: { xs: 3, sm: '32px 42px 24px 42px' },
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {/* 1. Caja Superior de Previsualización con Scrollbar simulado */}
        <Box
          sx={{
            width: '100%',
            height: 155,
            border: '1.2px solid var(--color-borde)',
            bgcolor: 'var(--color-blanco)',
            display: 'flex',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          {/* Contenido con la lista de números agregados */}
          <Box
            sx={{
              flex: 1,
              p: 1.5,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.8,
            }}
          >
            {listaTemporal.length === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: 'var(--color-borde)', fontStyle: 'italic' }}
              >
                No hay números agregados...
              </Typography>
            ) : (
              listaTemporal.map((num, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'var(--color-fondo)',
                    px: 1.2,
                    py: 0.4,
                    border: '1px solid var(--color-input-bg)',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}
                  >
                    • {num}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleQuitar(idx)}
                    sx={{ color: 'var(--color-texto-oscuro)', p: 0.2 }}
                  >
                    ×
                  </IconButton>
                </Box>
              ))
            )}
          </Box>

          {/* Barra de desplazamiento estética estilo Figma */}
          <Box
            sx={{
              width: 17,
              bgcolor: 'var(--color-input-bg)',
              borderLeft: '1px solid var(--color-borde)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              userSelect: 'none',
            }}
          >
            <Box
              sx={{
                fontSize: 8,
                height: 14,
                display: 'flex',
                alignItems: 'center',
                color: 'var(--color-texto-oscuro)',
              }}
            >
              ▲
            </Box>
            <Box
              sx={{
                flex: 1,
                width: '100%',
                bgcolor: 'var(--color-fondo)',
                borderTop: '1px solid var(--color-borde)',
                borderBottom: '1px solid var(--color-borde)',
              }}
            />
            <Box
              sx={{
                fontSize: 8,
                height: 14,
                display: 'flex',
                alignItems: 'center',
                color: 'var(--color-texto-oscuro)',
              }}
            >
              ▼
            </Box>
          </Box>
        </Box>

        {/* 2. Campo de Entrada: Ingrese Número de Teléfono */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              display: 'block',
              mb: 0.6,
              fontWeight: 500,
              color: 'var(--color-texto-oscuro)',
              fontSize: '0.88rem',
            }}
          >
            Ingrese Número de Teléfono
          </Typography>

          <TextField
            fullWidth
            size="small"
            type="tel"
            placeholder="+56 9 1234 5678"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            inputProps={{
              autoComplete: 'off',
            }}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                height: 36,
                backgroundColor: 'var(--color-blanco)',
                '& fieldset': {
                  borderColor: 'var(--color-borde)',
                  borderWidth: '1.2px',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--color-texto-oscuro)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--color-primario)',
                },
              },
              '& .MuiInputBase-input': {
                py: 0.8,
                px: 1.5,
                fontSize: '0.95rem',
                color: 'var(--color-texto-oscuro)',
              },
            }}
          />
        </Box>

        {/* 3. Botones: Agregar Numero y Salir (sin bordes con letras naranjas) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
          <Button
            type="button"
            fullWidth
            variant="contained"
            disableElevation
            onClick={handleAgregar}
            sx={{
              bgcolor: 'var(--color-primario)',
              color: 'var(--color-texto-claro)',
              borderRadius: 0,
              textTransform: 'none',
              fontWeight: 600,
              height: 38,
              fontSize: '0.95rem',
              '&:hover': {
                bgcolor: 'var(--color-primario-hover)',
              },
            }}
          >
            Agregar Numero
          </Button>

          {/* Botón Salir: Plano, sin borde ni fondo, texto naranja */}
          <Button
            type="button"
            fullWidth
            variant="text"
            disableRipple
            onClick={handleSalir}
            sx={{
              bgcolor: 'transparent',
              color: 'var(--color-primario)',
              border: 'none',
              textTransform: 'none',
              fontWeight: 600,
              height: 36,
              fontSize: '0.95rem',
              '&:hover': {
                bgcolor: 'transparent',
                color: 'var(--color-primario-hover)',
                textDecoration: 'underline',
              },
            }}
          >
            Salir
          </Button>
        </Box>

        {/* 4. Divisor inferior característico con punto central */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            mt: 2.5,
            width: '100%',
          }}
        >
          <Box sx={{ flex: 1, height: '1.2px', bgcolor: 'var(--color-texto-oscuro)' }} />
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'var(--color-texto-oscuro)' }} />
          <Box sx={{ flex: 1, height: '1.2px', bgcolor: 'var(--color-texto-oscuro)' }} />
        </Box>
      </Box>
    </Box>
  );
}