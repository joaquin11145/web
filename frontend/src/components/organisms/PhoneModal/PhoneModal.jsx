import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';

export default function PhoneModal({ open, onClose, onAgregar }) {
  const [telefono, setTelefono] = useState('');
  const [listaTemporal, setListaTemporal] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState('');

  if (!open) return null;

  // Formateador que bloquea letras y da formato +56 9 XXXX XXXX
  const handleTelefonoChange = (e) => {
    let digitos = e.target.value.replace(/\D/g, ''); // Elimina letras y símbolos

    if (digitos.startsWith('569')) digitos = '9' + digitos.slice(3);
    else if (digitos.startsWith('56')) digitos = digitos.slice(2);

    digitos = digitos.slice(0, 9); // Solo 9 dígitos locales

    let formateado = '';
    if (digitos.length === 0) formateado = '';
    else if (digitos.length <= 1) formateado = `+56 ${digitos}`;
    else if (digitos.length <= 5) formateado = `+56 ${digitos.slice(0, 1)} ${digitos.slice(1)}`;
    else formateado = `+56 ${digitos.slice(0, 1)} ${digitos.slice(1, 5)} ${digitos.slice(5)}`;

    setTelefono(formateado);
    if (errorMensaje) setErrorMensaje('');
  };

  const handleAgregar = (e) => {
    if (e) e.preventDefault();
    const soloDigitos = telefono.replace(/\D/g, '');

    if (soloDigitos.length < 9) {
      setErrorMensaje('Ingrese un número telefónico válido de 9 dígitos.');
      return;
    }

    const nuevoNumero = telefono.trim();
    if (onAgregar) {
      onAgregar(nuevoNumero);
    }
    setListaTemporal((prev) => [...prev, nuevoNumero]);
    setTelefono('');
    setErrorMensaje('');
  };

  const handleQuitar = (index) => {
    setListaTemporal((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSalir = () => {
    setTelefono('');
    setErrorMensaje('');
    if (onClose) onClose();
  };

  return (
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
        {/* Alerta de validación en MUI */}
        <Collapse in={Boolean(errorMensaje)} sx={{ mb: 1.5, width: '100%' }}>
          <Alert severity="error" sx={{ borderRadius: '8px', fontSize: '0.82rem', py: 0.3 }}>
            {errorMensaje}
          </Alert>
        </Collapse>

        {/* 1. Caja Superior de Previsualización */}
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
            <Box sx={{ fontSize: 8, height: 14, display: 'flex', alignItems: 'center', color: 'var(--color-texto-oscuro)' }}>▲</Box>
            <Box sx={{ flex: 1, width: '100%', bgcolor: 'var(--color-fondo)', borderTop: '1px solid var(--color-borde)', borderBottom: '1px solid var(--color-borde)' }} />
            <Box sx={{ fontSize: 8, height: 14, display: 'flex', alignItems: 'center', color: 'var(--color-texto-oscuro)' }}>▼</Box>
          </Box>
        </Box>

        {/* 2. Campo con filtro de números */}
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
            Ingrese Número de Teléfono (Solo números)
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="+56 9 1234 5678"
            value={telefono}
            onChange={handleTelefonoChange}
            inputProps={{
              autoComplete: 'off',
              maxLength: 16,
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

        {/* 3. Botones */}
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

        {/* 4. Divisor inferior */}
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