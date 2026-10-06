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

export default function CatalogList({
  productos,
  servicios,
  onSelectItem,
  favoritos = [],
  onToggleFavorito,
  modo = 'cliente', 
  onEditar,
  onComentarios,
  onOferta,
}) {
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtrados.map((item) => (
          <Paper
            key={item.id}
            sx={{ display: 'flex', gap: 2, p: 1.5, borderRadius: 3, border: '1px solid var(--color-borde)', boxShadow: 'none' }}
          >
            <Box
              onClick={() => modo === 'cliente' && onSelectItem(item)}
              sx={{ width: 90, height: 90, bgcolor: '#e8e6df', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, flexShrink: 0, cursor: modo === 'cliente' ? 'pointer' : 'default' }}
            >
              foto
            </Box>

            <Box sx={{ flex: 1 }} onClick={() => modo === 'cliente' && onSelectItem(item)}>
              <Typography sx={{ fontWeight: 600 }}>{item.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">
                Valor: {item.valor.toLocaleString('es-CL')}
              </Typography>
              {modo === 'vendedor' && item.descripcion && (
                <Typography variant="caption" color="text.secondary">
                  Descripción: {item.descripcion}
                </Typography>
              )}
            </Box>

            {modo === 'cliente' ? (
              <IconButton size="small" onClick={() => onToggleFavorito && onToggleFavorito(item)}>
                {esFavorito(item.id) ? (
                  <StarIcon fontSize="small" sx={{ color: 'var(--color-primario)' }} />
                ) : (
                  <StarBorderIcon fontSize="small" />
                )}
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, justifyContent: 'center' }}>
                <Button size="small" onClick={() => onEditar && onEditar(item)} sx={{ bgcolor: 'var(--color-primario)', color: '#fff', textTransform: 'none', borderRadius: 3, fontSize: '0.75rem' }}>
                  Editar
                </Button>
                <Button size="small" onClick={() => onComentarios && onComentarios(item)} sx={{ bgcolor: 'var(--color-primario)', color: '#fff', textTransform: 'none', borderRadius: 3, fontSize: '0.75rem' }}>
                  Comentarios
                </Button>
                <Button size="small" onClick={() => onOferta && onOferta(item)} sx={{ bgcolor: 'var(--color-primario)', color: '#fff', textTransform: 'none', borderRadius: 3, fontSize: '0.75rem' }}>
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