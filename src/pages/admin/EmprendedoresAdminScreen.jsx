import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

const emprendedoresData = [
  {
    id: 1,
    nombre: 'Confecciones Silva SPA',
    rut: '76.432.109-8',
    direcciones: 'Av. Providencia 1240, Of. 402, Santiago',
    datosPersonales: 'Contacto: María Silva / Fono: +56 9 8765 4321 / Email: contacto@confecciones.cl',
  },
  {
    id: 2,
    nombre: 'Textiles del Sur Ltda.',
    rut: '77.890.321-K',
    direcciones: 'Calle Prat 560, Concepción',
    datosPersonales: 'Contacto: Rodrigo Soto / Fono: +56 9 7654 3210 / Email: r.soto@textilesdelsur.cl',
  },
  {
    id: 3,
    nombre: 'Artesanías Andinas',
    rut: '15.678.901-2',
    direcciones: 'Pasaje Los Alerces 89, Temuco',
    datosPersonales: 'Contacto: Carmen Gloria / Fono: +56 9 6543 2109 / Email: carmen@artesanias.cl',
  },
];

export default function EmprendedoresAdminScreen({ cartProps = {} }) {
  const navigate = useNavigate();

  return (
    <MainLayout {...cartProps}>
      <Box sx={{ maxWidth: 880, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          sx={{ textTransform: 'none', color: 'var(--color-texto-oscuro)', mb: 2 }}
        >
          Volver a Administrar
        </Button>

        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={() => navigate('/admin')}
          sx={{
            height: 38,
            borderRadius: '20px',
            bgcolor: 'var(--color-primario)',
            color: 'var(--color-texto-claro)',
            border: '1.2px solid var(--color-texto-oscuro)',
            boxShadow: '0 2px 6px rgba(44, 44, 42, 0.25)',
            fontWeight: 600,
            fontSize: '0.92rem',
            textTransform: 'none',
            mb: 2.5,
            '&:hover': { bgcolor: 'var(--color-primario-hover, var(--color-primario))' },
          }}
        >
          Atras
        </Button>

        <Box
          sx={{
            border: '1.5px solid var(--color-borde)',
            borderRadius: '16px',
            p: { xs: 2, sm: 3 },
            bgcolor: 'var(--color-fondo)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          {emprendedoresData.map((emp) => (
            <Box
              key={emp.id}
              sx={{
                border: '1.5px solid var(--color-borde)',
                borderRadius: '12px',
                p: 2.5,
                bgcolor: 'var(--color-input-bg)',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                  <strong>Nombre:</strong> {emp.nombre} ({emp.rut})
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'var(--color-texto-oscuro)' }}>
                  <strong>Direcciones:</strong> {emp.direcciones}
                </Typography>
                <Typography sx={{ fontSize: '0.88rem', color: 'var(--color-texto-oscuro)' }}>
                  <strong>Datos Personales:</strong> {emp.datosPersonales}
                </Typography>
              </Box>

              <Button
                variant="contained"
                disableElevation
                onClick={() => navigate('/mensajes')}
                sx={{
                  minWidth: 120,
                  height: 36,
                  borderRadius: '20px',
                  bgcolor: 'var(--color-primario)',
                  color: 'var(--color-texto-claro)',
                  textTransform: 'none',
                  fontWeight: 600,
                  alignSelf: { xs: 'flex-end', sm: 'center' },
                  border: '1px solid var(--color-texto-oscuro)',
                  boxShadow: '0 2px 4px rgba(44, 44, 42, 0.25)',
                  '&:hover': { bgcolor: 'var(--color-primario-hover, var(--color-primario))' },
                }}
              >
                Mensaje
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </MainLayout>
  );
}