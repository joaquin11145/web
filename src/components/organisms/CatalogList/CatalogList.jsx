import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export default function CatalogList({ productos, servicios, onSelectItem, favoritos = [], onToggleFavorito }) {
  const [tab, setTab] = useState('productos');
  const [busqueda, setBusqueda] = useState('');

  const items = tab === 'productos' ? productos : servicios;
  const filtrados = items.filter((i) =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const esFavorito = (id) => favoritos.some((f) => f.id === id);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Paper
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{ display: 'flex', alignItems: 'center', px: 2, py: 0.5, mb: 2, borderRadius: 3, border: '1px solid var(--color-borde)', boxShadow: 'none' }}
      >
        <InputBase placeholder="Buscar" fullWidth value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <SearchIcon sx={{ color: 'text.secondary' }} />
      </Paper>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          fullWidth
          variant={tab === 'productos' ? 'contained' : 'outlined'}
          onClick={() => setTab('productos')}
          sx={{ borderRadius: 3, textTransform: 'none', bgcolor: tab === 'productos' ? 'var(--color-primario)' : 'transparent', borderColor: 'var(--color-borde)', color: tab === 'productos' ? '#fff' : 'var(--color-texto-oscuro)' }}
        >
          Productos
        </Button>
        <Button
          fullWidth
          variant={tab === 'servicios' ? 'contained' : 'outlined'}
          onClick={() => setTab('servicios')}
          sx={{ borderRadius: 3, textTransform: 'none', bgcolor: tab === 'servicios' ? 'var(--color-primario)' : 'transparent', borderColor: 'var(--color-borde)', color: tab === 'servicios' ? '#fff' : 'var(--color-texto-oscuro)' }}
        >
          Servicios
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        {filtrados.map((item) => (
          <Paper
            key={item.id}
            sx={{ display: 'flex', gap: 2, p: 1.5, borderRadius: 3, border: '1px solid var(--color-borde)', boxShadow: 'none', cursor: 'pointer', '&:hover': { borderColor: 'var(--color-primario)' } }}
          >
            <Box onClick={() => onSelectItem(item)} sx={{ width: 90, height: 90, bgcolor: '#e8e6df', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, flexShrink: 0 }}>
              foto
            </Box>
            <Box onClick={() => onSelectItem(item)} sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600 }}> {item.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">
                 {item.valor.toLocaleString('es-CL')}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => onToggleFavorito && onToggleFavorito(item)}>
              {esFavorito(item.id) ? (
                <StarIcon fontSize="small" sx={{ color: 'var(--color-primario)' }} />
              ) : (
                <StarBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}