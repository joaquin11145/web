import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function EmprendedorDashboard() {
  const navigate = useNavigate();

  const opciones = [
    { label: 'Publicaciones', ruta: '/emprendedor/publicaciones' },
    { label: 'Crear publicación', ruta: '/emprendedor/publicaciones?crear=1' },
    { label: 'Administrar Stock', ruta: '/emprendedor/publicaciones' },
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
            sx={{ bgcolor: 'var(--color-primario)', textTransform: 'none', borderRadius: 3, py: 1.2 }}
          >
            {op.label}
          </Button>
        ))}
      </Box>
    </MainLayout>
  );
}