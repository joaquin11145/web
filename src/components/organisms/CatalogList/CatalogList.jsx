import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export default function CatalogList({
  productos = [],
  servicios = [],
  favoritos = [],
  onToggleFavorito,
  modo = 'cliente',
  onEditar,
  onComentarios,
  onOferta,
}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('productos');
  const [busqueda, setBusqueda] = useState('');

  const items = tab === 'productos' ? productos : servicios;
  const filtrados = items.filter((i) =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const esFavorito = (id) => favoritos.some((f) => f.id === id);

  const handleIrAlDetalle = (item) => {
    if (modo === 'cliente') {
      navigate(`/producto/${item.id}`);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Paper
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 0.5,
          mb: 2,
          borderRadius: 3,
          border: '1px solid var(--color-borde)',
          boxShadow: 'none',
          bgcolor: 'var(--color-fondo)',
        }}
      >
        <InputBase
          placeholder="Buscar"
          fullWidth
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{ color: 'var(--color-texto-oscuro)' }}
        />
        <SearchIcon sx={{ color: 'var(--color-borde)' }} />
      </Paper>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          fullWidth
          variant={tab === 'productos' ? 'contained' : 'outlined'}
          onClick={() => setTab('productos')}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            bgcolor: tab === 'productos' ? 'var(--color-primario)' : 'transparent',
            borderColor: 'var(--color-borde)',
            color: tab === 'productos' ? 'var(--color-texto-claro)' : 'var(--color-texto-oscuro)',
            '&:hover': {
              bgcolor: tab === 'productos' ? 'var(--color-primario-hover)' : 'transparent',
              borderColor: 'var(--color-texto-oscuro)',
            },
          }}
        >
          Productos
        </Button>
        <Button
          fullWidth
          variant={tab === 'servicios' ? 'contained' : 'outlined'}
          onClick={() => setTab('servicios')}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            bgcolor: tab === 'servicios' ? 'var(--color-primario)' : 'transparent',
            borderColor: 'var(--color-borde)',
            color: tab === 'servicios' ? 'var(--color-texto-claro)' : 'var(--color-texto-oscuro)',
            '&:hover': {
              bgcolor: tab === 'servicios' ? 'var(--color-primario-hover)' : 'transparent',
              borderColor: 'var(--color-texto-oscuro)',
            },
          }}
        >
          Servicios
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtrados.map((item) => (
          <Paper
            key={item.id}
            sx={{
              display: 'flex',
              gap: 2,
              p: 1.5,
              borderRadius: 3,
              border: '1px solid var(--color-borde)',
              boxShadow: 'none',
              bgcolor: 'var(--color-fondo)',
              alignItems: 'center',
            }}
          >
            <Box
              onClick={() => handleIrAlDetalle(item)}
              sx={{
                width: 90,
                height: 90,
                bgcolor: 'var(--color-input-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                flexShrink: 0,
                cursor: modo === 'cliente' ? 'pointer' : 'default',
                color: 'var(--color-texto-oscuro)',
                fontSize: '1rem',
              }}
            >
              foto
            </Box>

            <Box
              sx={{ flex: 1, cursor: modo === 'cliente' ? 'pointer' : 'default' }}
              onClick={() => handleIrAlDetalle(item)}
            >
              <Typography sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
                {item.nombre}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-borde)' }}>
                Valor: ${Number(item.valor || 0).toLocaleString('es-CL')}
              </Typography>
              {modo === 'vendedor' && item.descripcion && (
                <Typography variant="caption" sx={{ color: 'var(--color-borde)' }}>
                  Descripción: {item.descripcion}
                </Typography>
              )}
            </Box>

            {modo === 'cliente' ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorito && onToggleFavorito(item);
                }}
              >
                {esFavorito(item.id) ? (
                  <StarIcon fontSize="small" sx={{ color: 'var(--color-primario)' }} />
                ) : (
                  <StarBorderIcon fontSize="small" sx={{ color: 'var(--color-texto-oscuro)' }} />
                )}
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, justifyContent: 'center' }}>
                <Button
                  size="small"
                  onClick={() => onEditar && onEditar(item)}
                  sx={{
                    bgcolor: 'var(--color-primario)',
                    color: 'var(--color-texto-claro)',
                    textTransform: 'none',
                    borderRadius: 3,
                    fontSize: '0.75rem',
                    '&:hover': { bgcolor: 'var(--color-primario-hover)' },
                  }}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  onClick={() => onComentarios && onComentarios(item)}
                  sx={{
                    bgcolor: 'var(--color-primario)',
                    color: 'var(--color-texto-claro)',
                    textTransform: 'none',
                    borderRadius: 3,
                    fontSize: '0.75rem',
                    '&:hover': { bgcolor: 'var(--color-primario-hover)' },
                  }}
                >
                  Comentarios
                </Button>
                <Button
                  size="small"
                  onClick={() => onOferta && onOferta(item)}
                  sx={{
                    bgcolor: 'var(--color-primario)',
                    color: 'var(--color-texto-claro)',
                    textTransform: 'none',
                    borderRadius: 3,
                    fontSize: '0.75rem',
                    '&:hover': { bgcolor: 'var(--color-primario-hover)' },
                  }}
                >
                  Oferta
                </Button>
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
}