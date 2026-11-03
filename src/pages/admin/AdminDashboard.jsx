import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

export default function AdminDashboard({ cartProps = {} }) {
  const navigate = useNavigate();

  return (
    <MainLayout {...cartProps}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '65vh',
          p: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.85rem' },
            fontWeight: 700,
            color: 'var(--color-texto-oscuro)',
            mb: { xs: 4, sm: 5 },
            letterSpacing: '0.4px',
          }}
        >
          Administrar
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: { xs: 2.5, sm: 3.5 },
            width: '100%',
            maxWidth: 580,
          }}
        >
          <Button
            variant="contained"
            disableElevation
            onClick={() => navigate('/admin/emprendedores')}
            sx={menuBotonStyle}
          >
            Emprendedores
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={() => navigate('/admin/transporte')}
            sx={menuBotonStyle}
          >
            Transporte
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={() => navigate('/admin/comentarios')}
            sx={menuBotonStyle}
          >
            Comentarios de Usuarios
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={() => navigate('/admin/devoluciones')}
            sx={menuBotonStyle}
          >
            Devoluciones
          </Button>
        </Box>
      </Box>
    </MainLayout>
  );
}

const menuBotonStyle = {
  height: 52,
  borderRadius: '20px',
  bgcolor: 'var(--color-primario)',
  color: 'var(--color-texto-claro)',
  border: '1.5px solid var(--color-texto-oscuro)',
  boxShadow: '0 4px 6px rgba(44, 44, 42, 0.35)',
  fontWeight: 600,
  fontSize: '0.98rem',
  textTransform: 'none',
  letterSpacing: '0.2px',
  '&:hover': {
    bgcolor: 'var(--color-primario-hover, var(--color-primario))',
  },
};