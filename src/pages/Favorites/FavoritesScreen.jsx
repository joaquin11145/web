import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

export default function FavoritesScreen({ favoritos = [], onToggleFavorito, cartProps = {} }) {
  const navigate = useNavigate();

  return (
    <MainLayout {...cartProps}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Button
          onClick={() => navigate('/catalog')}
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 2,
            textTransform: 'none',
            color: 'var(--color-texto-oscuro)',
            fontWeight: 600,
          }}
        >
          Volver al catálogo
        </Button>

        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--color-primario)', mb: 2 }}>
          Mis Favoritos
        </Typography>

        {favoritos.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              border: '1px solid var(--color-borde)',
              bgcolor: 'var(--color-fondo)',
              boxShadow: 'none',
            }}
          >
            <Typography variant="body1" sx={{ color: 'var(--color-borde)' }}>
              Aún no tienes productos agregados a favoritos.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {favoritos.map((item) => (
              <Paper
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid var(--color-borde)',
                  bgcolor: 'var(--color-fondo)',
                  boxShadow: 'none',
                }}
              >
                <Box
                  onClick={() => navigate(`/producto/${item.id}`)}
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'var(--color-input-bg)',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--color-texto-oscuro)',
                    fontSize: '0.9rem',
                    flexShrink: 0,
                  }}
                >
                  foto
                </Box>

                <Box sx={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/producto/${item.id}`)}>
                  <Typography sx={{ fontWeight: 700, color: 'var(--color-texto-oscuro)' }}>
                    {item.nombre}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--color-borde)' }}>
                    Valor: ${Number(item.valor || 0).toLocaleString('es-CL')}
                  </Typography>
                </Box>

                <IconButton size="small" onClick={() => onToggleFavorito && onToggleFavorito(item)}>
                  <StarIcon sx={{ color: 'var(--color-primario)' }} />
                </IconButton>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}