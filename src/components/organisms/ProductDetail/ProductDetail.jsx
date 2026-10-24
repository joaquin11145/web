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

export default function ProductDetail({
  item,
  onBack,
  favoritos = [],
  onToggleFavorito,
  onAddToCart,
}) {
  const esFavorito = (id) => favoritos.some((f) => f.id === id);
  const [talla, setTalla] = useState(null);
  const [color, setColor] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [comentario, setComentario] = useState('');

  const handleAgregar = () => {
    if (onAddToCart) {
      onAddToCart({
        ...item,
        cantidad: Number(cantidad) || 1,
        tallaSeleccionada: talla,
        colorSeleccionado: color,
      });
    }
  };

  const handlePublicarComentario = () => {
    console.log({ producto: item.nombre, comentario });
    setComentario('');
  };

  const listaTamanos = item.tamanos || [];
  const listaColores = item.colores || [];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Button
        onClick={onBack}
        sx={{
          mb: 1,
          textTransform: 'none',
          color: 'var(--color-texto-oscuro)',
          fontWeight: 600,
        }}
      >
        ← Volver al catálogo
      </Button>

      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          border: '1px solid var(--color-borde)',
          boxShadow: 'none',
          bgcolor: 'var(--color-fondo)',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 700 }}>
            {item.nombre}
          </Typography>
          <IconButton size="small" onClick={() => onToggleFavorito?.(item)}>
            {esFavorito(item.id) ? (
              <StarIcon sx={{ color: 'var(--color-primario)' }} />
            ) : (
              <StarBorderIcon sx={{ color: 'var(--color-texto-oscuro)' }} />
            )}
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box
            sx={{
              width: 200,
              height: 200,
              bgcolor: 'var(--color-input-bg)',
              border: '1px solid var(--color-borde)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              fontSize: '1.2rem',
              color: 'var(--color-texto-oscuro)',
            }}
          >
            foto
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--color-borde)',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              {[
                { label: 'Tamaño', valor: item.tamanos ? item.tamanos.join(', ') : '' },
                { label: 'Color(es)', valor: item.colores ? item.colores.join(', ') : '' },
                { label: 'Peso', valor: item.peso || '' },
                { label: 'Material', valor: item.material || '' },
              ].map((campo, index) => (
                <Box
                  key={campo.label}
                  sx={{
                    display: 'flex',
                    borderBottom: index < 3 ? '1px solid var(--color-borde)' : 'none',
                  }}
                >
                  <Box
                    sx={{
                      width: '40%',
                      p: 0.75,
                      fontWeight: 600,
                      borderRight: '1px solid var(--color-borde)',
                      bgcolor: 'var(--color-input-bg)',
                      color: 'var(--color-texto-oscuro)',
                      fontSize: '0.88rem',
                    }}
                  >
                    {campo.label}
                  </Box>
                  <Box
                    sx={{
                      width: '60%',
                      p: 0.75,
                      color: 'var(--color-texto-oscuro)',
                      fontSize: '0.88rem',
                    }}
                  >
                    {campo.valor}
                  </Box>
                </Box>
              ))}
            </Box>

            <Typography
              variant="body2"
              sx={{ mt: 1.5, color: 'var(--color-texto-oscuro)' }}
            >
              {item.descripcion || 'Descripción del producto o servicio no especificada.'}
            </Typography>
          </Box>
        </Box>

        {listaTamanos.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'var(--color-texto-oscuro)' }}>
              Talla:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {listaTamanos.map((t) => (
                <Button
                  key={t}
                  size="small"
                  variant={talla === t ? 'contained' : 'outlined'}
                  onClick={() => setTalla(t)}
                  sx={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: talla === t ? 'var(--color-primario)' : 'transparent',
                    borderColor: 'var(--color-borde)',
                    color: talla === t ? 'var(--color-texto-claro)' : 'var(--color-texto-oscuro)',
                    '&:hover': {
                      bgcolor: talla === t ? 'var(--color-primario-hover)' : 'transparent',
                      borderColor: 'var(--color-texto-oscuro)',
                    },
                  }}
                >
                  {t}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {listaColores.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'var(--color-texto-oscuro)' }}>
              Color:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {listaColores.map((c) => (
                <Button
                  key={c}
                  size="small"
                  variant={color === c ? 'contained' : 'outlined'}
                  onClick={() => setColor(c)}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    bgcolor: color === c ? 'var(--color-primario)' : 'transparent',
                    borderColor: 'var(--color-borde)',
                    color: color === c ? 'var(--color-texto-claro)' : 'var(--color-texto-oscuro)',
                    '&:hover': {
                      bgcolor: color === c ? 'var(--color-primario-hover)' : 'transparent',
                      borderColor: 'var(--color-texto-oscuro)',
                    },
                  }}
                >
                  {c}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {/* Cantidad + Agregar al Carrito */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
            Cantidad:
          </Typography>
          <IconButton
            size="small"
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            sx={{ color: 'var(--color-texto-oscuro)' }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <TextField
            size="small"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, Number(e.target.value) || 1))}
            sx={{
              width: 55,
              '& .MuiInputBase-input': {
                textAlign: 'center',
                color: 'var(--color-texto-oscuro)',
                py: 0.5,
              },
            }}
          />
          <IconButton
            size="small"
            onClick={() => setCantidad((c) => c + 1)}
            sx={{ color: 'var(--color-texto-oscuro)' }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" sx={{ color: 'var(--color-borde)' }}>
            Quedan ({item.stock ?? 0}) en Stock
          </Typography>
          <Button
            variant="contained"
            disableElevation
            startIcon={<ShoppingCartIcon />}
            onClick={handleAgregar}
            sx={{
              ml: 'auto',
              bgcolor: 'var(--color-primario)',
              color: 'var(--color-texto-claro)',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              px: 2.5,
              '&:hover': {
                bgcolor: 'var(--color-primario-hover)',
              },
            }}
          >
            Agregar
          </Button>
        </Box>
      </Paper>

      {/* Comentarios */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          border: '1px solid var(--color-borde)',
          boxShadow: 'none',
          bgcolor: 'var(--color-fondo)',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'var(--color-texto-oscuro)' }}>
          Ingrese sus Comentarios del (Producto/Servicio):
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="Escriba acá ..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          sx={{
            bgcolor: 'var(--color-input-bg)',
            '& .MuiInputBase-input': {
              color: 'var(--color-texto-oscuro)',
            },
          }}
        />
        <Button
          onClick={handlePublicarComentario}
          sx={{
            mt: 1,
            bgcolor: 'var(--color-primario)',
            color: 'var(--color-texto-claro)',
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 600,
            px: 2,
            '&:hover': {
              bgcolor: 'var(--color-primario-hover)',
            },
          }}
        >
          Publicar
        </Button>
      </Paper>
    </Box>
  );
}