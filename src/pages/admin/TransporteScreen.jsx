import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AddIcon from '@mui/icons-material/Add';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

export default function TransporteScreen({ zonas = [], onToggleHabilitar, cartProps = {} }) {
  const navigate = useNavigate();

  const formatCLP = (m) => Number(m || 0).toLocaleString('es-CL');

  return (
    <MainLayout {...cartProps}>
      <Box sx={{ maxWidth: 880, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
        
        {/* Botón Volver */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          sx={{
            textTransform: 'none',
            color: 'var(--color-texto-oscuro)',
            mb: 2,
            fontWeight: 600,
          }}
        >
          Volver a Administrar
        </Button>

        {/* Cabecera */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
            px: 0.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShippingOutlinedIcon sx={{ color: 'var(--color-texto-oscuro)', fontSize: 26 }} />
            <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-texto-oscuro)' }}>
              Costos de Envío
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/transporte/agregar')}
            sx={{
              borderRadius: '18px',
              borderColor: 'var(--color-borde)',
              color: 'var(--color-texto-oscuro)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              px: 2,
              py: 0.4,
              bgcolor: 'var(--color-fondo)',
              '&:hover': {
                borderColor: 'var(--color-primario)',
                color: 'var(--color-primario)',
              },
            }}
          >
            Agregar Zona
          </Button>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: 'var(--color-texto-oscuro)',
            fontWeight: 700,
            fontSize: '0.82rem',
            px: 0.5,
            display: 'block',
            mb: 2.5,
          }}
        >
          Zonas de Entrega
        </Typography>

        {/* Lista de Zonas Configuradas */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
          {zonas.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'var(--color-borde)', textAlign: 'center', py: 4 }}>
              No hay zonas de transporte registradas. Haz clic en "Agregar Zona".
            </Typography>
          ) : (
            zonas.map((zona) => (
              <Box
                key={zona.id}
                sx={{
                  bgcolor: 'var(--color-fondo)',
                  border: '1.5px solid var(--color-texto-oscuro)',
                  borderRadius: '24px',
                  p: { xs: 2, sm: '18px 24px' },
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: 2,
                  boxShadow: '0 4px 12px rgba(44, 44, 42, 0.08)',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-texto-oscuro)' }}>
                      {zona.nombre}
                    </Typography>
                    <Chip
                      label={zona.habilitada ? 'Habilitado' : 'Deshabilitado'}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: zona.habilitada ? 'rgba(46, 125, 50, 0.12)' : 'rgba(211, 47, 47, 0.12)',
                        color: zona.habilitada ? '#2e7d32' : '#d32f2f',
                        border: '1px solid',
                        borderColor: zona.habilitada ? '#2e7d32' : '#d32f2f',
                      }}
                    />
                  </Box>

                  <Typography sx={{ fontSize: '0.85rem', color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                    <strong>Región:</strong> {zona.region} ({zona.ciudad})
                  </Typography>

                  <Typography sx={{ fontSize: '0.82rem', color: 'var(--color-borde)' }}>
                    Comunas ({zona.comunas ? zona.comunas.length : 0}):{' '}
                    {zona.comunas ? zona.comunas.slice(0, 4).join(', ') : ''}
                    {zona.comunas && zona.comunas.length > 4 ? '...' : ''} | Entrega: {zona.tiempoEntrega}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, sm: 2 },
                    flexWrap: 'wrap',
                    width: { xs: '100%', md: 'auto' },
                    justifyContent: { xs: 'space-between', md: 'flex-end' },
                  }}
                >
                  <Box sx={{ textAlign: 'center', minWidth: 70 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-texto-oscuro)' }}>
                      ${formatCLP(zona.tarifaBase)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--color-borde)', display: 'block' }}>
                      tarifa base
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    disableElevation
                    onClick={() => navigate(`/admin/transporte/editar/${zona.id}`)}
                    sx={botonEditarStyle}
                  >
                    Editar
                  </Button>

                  <Button
                    variant="contained"
                    disableElevation
                    onClick={() => onToggleHabilitar && onToggleHabilitar(zona.id)}
                    sx={{
                      ...botonHabilitarStyle,
                      bgcolor: zona.habilitada ? 'var(--color-primario)' : 'var(--color-input-bg)',
                      color: zona.habilitada ? 'var(--color-texto-claro)' : 'var(--color-texto-oscuro)',
                    }}
                  >
                    Habilitar o desactivar
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </MainLayout>
  );
}

const botonEditarStyle = {
  width: 90,
  height: 34,
  borderRadius: '18px',
  bgcolor: 'var(--color-primario)',
  color: 'var(--color-texto-claro)',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.88rem',
  border: '1.2px solid var(--color-texto-oscuro)',
  boxShadow: '0 2px 4px rgba(44, 44, 42, 0.25)',
  '&:hover': { bgcolor: 'var(--color-primario-hover, var(--color-primario))' },
};

const botonHabilitarStyle = {
  height: 34,
  borderRadius: '18px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.82rem',
  px: 1.8,
  border: '1.2px solid var(--color-texto-oscuro)',
  boxShadow: '0 2px 4px rgba(44, 44, 42, 0.25)',
  '&:hover': { opacity: 0.9 },
};