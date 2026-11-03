import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

const comentariosData = [
  { id: 1, usuario: 'Juan Pérez', texto: 'Muy buena confección y entrega a tiempo.', tipo: 'producto', rating: 5 },
  { id: 2, usuario: 'María López', texto: 'La tela es suave pero demoró dos días más del compromiso.', tipo: 'producto', rating: 4 },
  { id: 3, usuario: 'Carlos Rojas', texto: 'Excelente atención y resolución rápida de dudas.', tipo: 'vendedor', rating: 5 },
  { id: 4, usuario: 'Ana Morales', texto: 'Comprobante y despacho correctos.', tipo: 'vendedor', rating: 4 },
];

export default function ComentariosAdminScreen({ cartProps = {} }) {
  const navigate = useNavigate();
  const [tabComentario, setTabComentario] = useState('producto');

  return (
    <MainLayout {...cartProps}>
      <Box sx={{ maxWidth: 880, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          sx={{ textTransform: 'none', color: 'var(--color-texto-oscuro)', mb: 2 }}
        >
          Volver a Administrar
        </Button>

        <Box
          sx={{
            border: '1.5px solid var(--color-borde)',
            borderRadius: '16px',
            p: { xs: 2, sm: 3 },
            bgcolor: 'var(--color-fondo)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          {/* Selector de Valoración Vendedor vs Producto según Figma */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              border: '1px solid var(--color-borde)',
              borderRadius: '12px',
              overflow: 'hidden',
              bgcolor: 'var(--color-fondo)',
            }}
          >
            <Box
              onClick={() => setTabComentario('vendedor')}
              sx={{
                flex: 1,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                bgcolor: tabComentario === 'vendedor' ? 'rgba(195, 85, 43, 0.12)' : 'transparent',
                borderRight: { xs: 'none', md: '1px solid var(--color-borde)' },
                borderBottom: { xs: '1px solid var(--color-borde)', md: 'none' },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                Vendedor: (Nombre del Vendedor)
              </Typography>
              <Rating value={4.5} precision={0.5} readOnly sx={{ color: 'var(--color-primario)' }} />
            </Box>

            <Box
              onClick={() => setTabComentario('producto')}
              sx={{
                flex: 1,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                bgcolor: tabComentario === 'producto' ? 'rgba(195, 85, 43, 0.12)' : 'transparent',
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                Nombre: (Producto/Servicio)
              </Typography>
              <Rating value={4.2} precision={0.5} readOnly sx={{ color: 'var(--color-primario)' }} />
            </Box>
          </Box>

          {/* Listado de comentarios */}
          <Box
            sx={{
              border: '1.2px solid var(--color-borde)',
              borderRadius: '12px',
              p: 2.5,
              bgcolor: 'var(--color-fondo)',
            }}
          >
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-texto-oscuro)', mb: 2 }}>
              {tabComentario === 'producto'
                ? 'Comentarios del (Producto/Servicio):'
                : 'Comentarios del Vendedor:'}
            </Typography>

            <Box
              sx={{
                width: '100%',
                minHeight: 220,
                maxHeight: 350,
                overflowY: 'auto',
                border: '1px solid var(--color-borde)',
                borderRadius: '6px',
                p: 2,
                bgcolor: 'var(--color-input-bg)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                boxSizing: 'border-box',
              }}
            >
              {comentariosData
                .filter((c) => c.tipo === tabComentario)
                .map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      p: 1.5,
                      bgcolor: 'var(--color-fondo)',
                      borderRadius: '8px',
                      border: '1px solid var(--color-borde)',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primario)' }}>
                        {item.usuario}
                      </Typography>
                      <Rating value={item.rating} size="small" readOnly sx={{ color: 'var(--color-primario)' }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.88rem', color: 'var(--color-texto-oscuro)' }}>
                      {item.texto}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}