import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const vacio = {
  region: '',
  provincia: '',
  comuna: '',
  codigoPostal: '',
  direccion: '',
  numero: '',
  tipoLugar: '',
};

export default function AddressModal({ open, onClose, onAgregar, esEmpresa = false }) {
  const [form, setForm] = useState(vacio);
  const [listaTemporal, setListaTemporal] = useState([]);

  if (!open) return null;

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleTipoLugar = (tipo) => {
    setForm((prev) => ({
      ...prev,
      tipoLugar: prev.tipoLugar === tipo ? '' : tipo,
    }));
  };

  const handleAgregar = (e) => {
    if (e) e.preventDefault();
    if (!form.direccion.trim()) return;

    const nuevaDireccion = { ...form, esEmpresa };
    if (onAgregar) {
      onAgregar(nuevaDireccion);
    }
    setListaTemporal((prev) => [...prev, nuevaDireccion]);
    setForm(vacio);
  };

  const handleQuitar = (index) => {
    setListaTemporal((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSalir = () => {
    setForm(vacio);
    if (onClose) onClose();
  };

  const primerTipoLugar = esEmpresa ? 'Tienda física' : 'oficina';

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
          maxHeight: '94vh',
          bgcolor: 'var(--color-blanco)',
          border: '1.5px solid var(--color-borde)',
          borderRadius: '38px',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.38)',
          p: { xs: 2.5, sm: '24px 38px 20px 38px' },
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {/* 1. Caja Superior de Previsualización con Scrollbar simulado */}
        <Box
          sx={{
            width: '100%',
            height: 120,
            border: '1.2px solid var(--color-borde)',
            bgcolor: 'var(--color-blanco)',
            display: 'flex',
            overflow: 'hidden',
            mb: 1.5,
            flexShrink: 0,
          }}
        >
          {/* Contenido con la lista de direcciones agregadas */}
          <Box
            sx={{
              flex: 1,
              p: 1.2,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.6,
            }}
          >
            {listaTemporal.length === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: 'var(--color-borde)', fontStyle: 'italic', fontSize: '0.85rem' }}
              >
                No hay direcciones agregadas...
              </Typography>
            ) : (
              listaTemporal.map((dir, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'var(--color-fondo)',
                    px: 1.2,
                    py: 0.3,
                    border: '1px solid var(--color-input-bg)',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500, fontSize: '0.85rem' }}
                  >
                    • {dir.direccion} #{dir.numero}, {dir.comuna} {dir.tipoLugar ? `(${dir.tipoLugar})` : ''}
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
              flexShrink: 0,
            }}
          >
            <Box sx={{ fontSize: 8, height: 14, display: 'flex', alignItems: 'center', color: 'var(--color-texto-oscuro)' }}>
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
            <Box sx={{ fontSize: 8, height: 14, display: 'flex', alignItems: 'center', color: 'var(--color-texto-oscuro)' }}>
              ▼
            </Box>
          </Box>
        </Box>

        {/* 2. Checkboxes de Tipo de Lugar (Dependiente de esEmpresa) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.tipoLugar === primerTipoLugar}
                onChange={() => handleTipoLugar(primerTipoLugar)}
                size="small"
                sx={{
                  p: 0.4,
                  color: 'var(--color-texto-oscuro)',
                  '&.Mui-checked': { color: 'var(--color-primario)' },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontSize: '0.88rem' }}>
                {primerTipoLugar}
              </Typography>
            }
            sx={{ m: 0 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={form.tipoLugar === 'Casa/Depto.'}
                onChange={() => handleTipoLugar('Casa/Depto.')}
                size="small"
                sx={{
                  p: 0.4,
                  color: 'var(--color-texto-oscuro)',
                  '&.Mui-checked': { color: 'var(--color-primario)' },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontSize: '0.88rem' }}>
                Casa/Depto.
              </Typography>
            }
            sx={{ m: 0 }}
          />
        </Box>

        {/* 3. Inputs del Formulario */}
        {[
          { label: 'Ingrese Región', field: 'region' },
          { label: 'Ingrese Provincia', field: 'provincia' },
          { label: 'Ingrese Comuna', field: 'comuna' },
          { label: 'Ingrese Código Postal', field: 'codigoPostal' },
          { label: 'Ingrese Dirección', field: 'direccion' },
          { label: 'Ingrese Número de Dirección', field: 'numero' },
        ].map(({ label, field }) => (
          <Box key={field} sx={{ width: '100%', mb: 1 }}>
            <Typography
              variant="body2"
              sx={{
                display: 'block',
                mb: 0.3,
                fontWeight: 500,
                color: 'var(--color-texto-oscuro)',
                fontSize: '0.82rem',
              }}
            >
              {label}
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={form[field]}
              onChange={handleChange(field)}
              inputProps={{ autoComplete: 'off' }}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  height: 32,
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
                  py: 0.5,
                  px: 1.2,
                  fontSize: '0.88rem',
                  color: 'var(--color-texto-oscuro)',
                },
              }}
            />
          </Box>
        ))}

        {/* 4. Botones: Agregar Dirección y Salir */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, width: '100%', mt: 1 }}>
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
              height: 36,
              fontSize: '0.92rem',
              '&:hover': {
                bgcolor: 'var(--color-primario-hover)',
              },
            }}
          >
            Agregar Dirección
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
              height: 32,
              fontSize: '0.92rem',
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

        {/* 5. Divisor inferior característico con punto central */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            mt: 1.8,
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