import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TextField from '@mui/material/TextField';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

export default function ProductDetail({ item, onBack , favoritos = [], onToggleFavorito }) {
  const esFavorito = (id) => favoritos.some((f) => f.id === id);
  const [talla, setTalla] = useState(null);
  const [color, setColor] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [comentario, setComentario] = useState('');

  const handleAgregar = () => {
    console.log({
      producto: item.nombre,
      talla,
      color,
      cantidad,
    });
  };

  const handlePublicarComentario = () => {
    console.log({ producto: item.nombre, comentario });
    setComentario('');
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Button onClick={onBack} sx={{ mb: 1, textTransform: 'none' }}>
        ← Volver al catálogo
      </Button>

      <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid var(--color-borde)', boxShadow: 'none', mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">{item.nombre}</Typography>
          <IconButton size="small" onClick={() => onToggleFavorito?.(item)}>
            {esFavorito(item.id) ? (
              <StarIcon sx={{ color: 'var(--color-primario)' }} />
            ) : (
              <StarBorderIcon />
            )}
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box
            sx={{
              width: 200, height: 200, bgcolor: '#e8e6df',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 1, fontSize: '1.2rem',
            }}
          >
            foto
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {['Tamaño', 'Color(es)', 'Peso', 'Material'].map((campo) => (
                  <tr key={campo}>
                    <td style={{ border: '1px solid var(--color-borde)', padding: 6, fontWeight: 600, width: '40%' }}>{campo}</td>
                    <td style={{ border: '1px solid var(--color-borde)', padding: 6 }}></td>
                  </tr>
                ))}
              </tbody>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              descripción
            </Typography>
          </Box>
        </Box>


        {(item.tamanos.length || []).length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Talla:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {item.tamanos.map((t) => (
                <Button
                  key={t}
                  size="small"
                  variant={talla === t ? 'contained' : 'outlined'}
                  onClick={() => setTalla(t)}
                  sx={{ minWidth: 36, borderRadius: '50%', color: talla === t ? '#fff' : 'inherit' }}
                >
                  {t}
                </Button>
              ))}
            </Box>
          </Box>
        )}


        {(item.colores.length || []).length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Color:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {item.colores.map((c) => (
                <Button
                  key={c}
                  size="small"
                  variant={color === c ? 'contained' : 'outlined'}
                  onClick={() => setColor(c)}
                  sx={{ borderRadius: 5, textTransform: 'none', color: color === c ? '#fff' : 'inherit' }}
                >
                  {c}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {/* Cantidad + Agregar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Cantidad:</Typography>
          <IconButton size="small" onClick={() => setCantidad((c) => Math.max(1, c - 1))}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <TextField size="small" value={cantidad} sx={{ width: 50 }} slotProps={{ htmlInput: { style: { textAlign: 'center' } } }} />
          <IconButton size="small" onClick={() => setCantidad((c) => c + 1)}>
            <AddIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            Quedan ({item.stock}) en Stock
          </Typography>
          <Button
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAgregar}
            sx={{ ml: 'auto', bgcolor: 'var(--color-primario)', borderRadius: 3, textTransform: 'none' }}
          >
            Agregar
          </Button>
        </Box>
      </Paper>

      {/* Comentarios */}
      <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid var(--color-borde)', boxShadow: 'none' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Ingrese sus Comentarios del (Producto/Servicio):
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="Escriba acá ..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
        <Button
          onClick={handlePublicarComentario}
          sx={{ mt: 1, bgcolor: 'var(--color-primario)', color: '#fff', borderRadius: 3, textTransform: 'none' }}
        >
          Publicar
        </Button>
      </Paper>
    </Box>
  );
}