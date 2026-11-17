import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';

export default function FavoritesList({ favoritos, onQuitarFavorito }) {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Favoritos:
      </Typography>

      {favoritos.length === 0 ? (
        <Typography color="text.secondary">
          Aún no tienes productos favoritos.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {favoritos.map((item) => (
            <Paper
              key={item.id}
              sx={{
                display: 'flex',
                gap: 2,
                p: 1.5,
                borderRadius: 3,
                border: '1px solid var(--color-borde)',
                boxShadow: 'none',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  bgcolor: '#e8e6df',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              >
                foto
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>Nombre: {item.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Valor: {item.valor.toLocaleString('es-CL')}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => onQuitarFavorito(item.id)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <StarIcon fontSize="small" sx={{ color: 'var(--color-primario)' }} />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}