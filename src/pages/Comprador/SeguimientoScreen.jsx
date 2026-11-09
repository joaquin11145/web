import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

const etapasDefecto = [
  { clave: 'recibido', titulo: 'RECIBIDO', fecha: '12 de Sept. de 2026', color: 'var(--color-primario)' },
  { clave: 'preparacion', titulo: 'En preparación', fecha: '15 de Sept. de 2026', color: 'var(--color-primario)' },
  { clave: 'enviado', titulo: 'Enviado', fecha: '18 de Sept. de 2026', color: 'var(--color-primario)' },
  { clave: 'entregado', titulo: 'Entregado', fecha: '24 de Sept. de 2026', color: '#2e7d32' },
];

export default function SeguimientoScreen({ cartProps = {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  const pedido = location.state?.pedido || {
    id: 1,
    nombre: 'Pedido 1',
    estado: 'Entregado',
    numeroSeguimiento: '60346032',
    transporte: 'Starken',
    fechaEnvio: '12 de Sept. de 2026',
    fechaEntrega: '24 de Sept. de 2026',
  };

  return (
    <MainLayout {...cartProps}>
      <Box sx={{ maxWidth: 960, mx: 'auto', p: { xs: 1, sm: 2 } }}>
        <Button
          onClick={() => navigate('/pedidos')}
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 2,
            textTransform: 'none',
            color: 'var(--color-texto-oscuro)',
            fontWeight: 600,
          }}
        >
          Volver a Tus Pedidos
        </Button>

        <Box
          sx={{
            border: '1.5px solid var(--color-borde)',
            borderRadius: '16px',
            bgcolor: 'var(--color-fondo)',
            boxShadow: '0 8px 24px rgba(44, 44, 42, 0.08)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            overflow: 'hidden',
            minHeight: 520,
          }}
        >
          <Box
            sx={{
              flex: 1.2,
              p: { xs: 3, sm: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ width: 'fit-content', mb: 2 }}>
              <Typography
                sx={{
                  fontSize: { xs: '1.4rem', sm: '1.7rem' },
                  fontWeight: 600,
                  color: 'var(--color-texto-oscuro)',
                  letterSpacing: '0.5px',
                  mb: 0.5,
                }}
              >
                {pedido.fechaEntrega || '24 de Sept. de 2026'}
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 4,
                  bgcolor: 'var(--color-texto-oscuro)',
                  borderRadius: '2px',
                }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: '1.1rem',
                fontWeight: 500,
                color: 'var(--color-texto-oscuro)',
                mb: 4,
              }}
            >
              {pedido.estado || 'Entregado'}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, my: 'auto', pl: { xs: 1, sm: 2 } }}>
              {etapasDefecto.map((etapa, index) => {
                const esUltimo = index === etapasDefecto.length - 1;
                return (
                  <Box
                    key={etapa.clave}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ width: 140, flexShrink: 0 }}>
                      <Typography
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: 'var(--color-texto-oscuro)',
                          lineHeight: 1.2,
                        }}
                      >
                        {etapa.titulo}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.8rem',
                          color: 'var(--color-borde)',
                          display: 'block',
                        }}
                      >
                        Fecha
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                      }}
                    >
                      {!esUltimo && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            bottom: -36,
                            width: 3,
                            bgcolor: 'var(--color-input-bg)',
                            borderLeft: '1px solid var(--color-borde)',
                            zIndex: 1,
                          }}
                        />
                      )}

                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          bgcolor: etapa.color,
                          zIndex: 2,
                          boxShadow: '0 0 0 2px var(--color-fondo)',
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              bgcolor: 'var(--color-input-bg)',
              borderLeft: { xs: 'none', md: '1.5px solid var(--color-borde)' },
              borderTop: { xs: '1.5px solid var(--color-borde)', md: 'none' },
              p: { xs: 3, sm: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                bgcolor: 'var(--color-fondo)',
                border: '1.2px solid var(--color-borde)',
                borderRadius: '12px',
                p: { xs: 2.5, sm: 3.5 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Numero de seguimiento:</strong> {pedido.numeroSeguimiento || '60346032'}
              </Typography>

              <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Transporte:</strong> {pedido.transporte || 'Starken'}
              </Typography>

              <Box sx={{ height: 1, bgcolor: 'var(--color-borde)', my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '0.9rem', color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>
                  Fecha de envío
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'var(--color-texto-oscuro)' }}>
                  {pedido.fechaEnvio || '12 de Sept. de 2026'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '0.9rem', color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>
                  Fecha de entrega
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'var(--color-texto-oscuro)' }}>
                  {pedido.fechaEntrega || '24 de Sept. de 2026'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}