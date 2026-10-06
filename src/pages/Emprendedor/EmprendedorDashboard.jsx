import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function EmprendedorDashboard() {
  const navigate = useNavigate();

  const opciones = [
    { label: 'Administrar Publicaicones', ruta: '/emprendedor/publicaciones?crear=1' },
    { label: 'Administrar Stock', ruta: '/emprendedor/stock' },
    { label: 'Ingresar como cliente', ruta: '/comprador' },
  ];

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 600, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {opciones.map((op) => (
          <Button
            key={op.label}
            fullWidth
            variant="contained"
            onClick={() => navigate(op.ruta)}
            sx={{
              bgcolor: 'var(--color-primario)',
              textTransform: 'none',
              borderRadius: 3,
              py: 1.2,
              '&:hover': {
                bgcolor: 'var(--color-primario-hover, var(--color-primario))',
              },
            }}
          >
            {op.label}
          </Button>
        ))}
      </Box>
    </MainLayout>
  );
}