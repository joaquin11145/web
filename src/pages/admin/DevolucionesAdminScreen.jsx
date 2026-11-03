import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

const devolucionesData = [
  {
    id: 1,
    nombre: 'Devolución 1',
    emprendedor: 'Confecciones Silva SPA',
    motivo: 'Talla incorrecta',
    estado: 'Pendiente',
    tipo: 'Producto (Polera Deportiva)',
    metodoPago: 'Débito / Crédito',
    detallePago: 'Visa terminada en 3456',
    total: 24000,
  },
  {
    id: 2,
    nombre: 'Devolución 2',
    emprendedor: 'Textiles del Sur Ltda.',
    motivo: 'Costura defectuosa',
    estado: 'Aprobada',
    tipo: 'Producto (Producto 2)',
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'TRX-983210',
    total: 7000,
  },
  {
    id: 3,
    nombre: 'Devolución 3',
    emprendedor: 'Artesanías Andinas',
    motivo: 'No corresponde a la imagen',
    estado: 'Rechazada',
    tipo: 'Producto (Producto 3)',
    metodoPago: 'Débito / Crédito',
    detallePago: 'MasterCard terminada en 1209',
    total: 16000,
  },
  {
    id: 4,
    nombre: 'Devolución 4',
    emprendedor: 'Confecciones Silva SPA',
    motivo: 'Demora excesiva en entrega',
    estado: 'Aprobada',
    tipo: 'Servicio (Confección)',
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'TRX-541209',
    total: 10000,
  },
];

export default function DevolucionesAdminScreen({ cartProps = {} }) {
  const navigate = useNavigate();
  const [devolucionActiva, setDevolucionActiva] = useState(devolucionesData[0]);

  const formatCLP = (m) => Number(m || 0).toLocaleString('es-CL');

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

        <Box
          sx={{
            width: '100%',
            border: '1.5px solid var(--color-borde)',
            borderRadius: '12px',
            bgcolor: 'var(--color-fondo)',
            display: 'flex',
            overflow: 'hidden',
            minHeight: 460,
            boxShadow: '0 8px 24px rgba(44, 44, 42, 0.08)',
          }}
        >
          <Box
            sx={{
              width: { xs: 150, sm: 220 },
              borderRight: '1.5px solid var(--color-borde)',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.2,
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-texto-oscuro)', mb: 0.5 }}>
              Devoluciones
            </Typography>
            {devolucionesData.map((d) => {
              const sel = devolucionActiva.id === d.id;
              return (
                <Box
                  key={d.id}
                  onClick={() => setDevolucionActiva(d)}
                  sx={{
                    p: 1.4,
                    bgcolor: sel ? 'rgba(195, 85, 43, 0.18)' : 'var(--color-input-bg)',
                    border: '1px solid',
                    borderColor: sel ? 'var(--color-primario)' : 'var(--color-borde)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: sel ? 700 : 500,
                    color: sel ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                    '&:hover': { bgcolor: 'rgba(195, 85, 43, 0.12)' },
                  }}
                >
                  {d.nombre}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ flex: 1, p: { xs: 2.5, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: 'var(--color-texto-oscuro)' }}>
              Devolución
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
              <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Emprendedor:</strong> {devolucionActiva.emprendedor}
              </Typography>

              <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Motivo:</strong> {devolucionActiva.motivo}
              </Typography>

              <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Estado:</strong> {devolucionActiva.estado}
              </Typography>

              <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Tipo:</strong> {devolucionActiva.tipo}
              </Typography>

              <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Método de pago:</strong> {devolucionActiva.metodoPago}
              </Typography>

              <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Detalle del Pago:</strong> {devolucionActiva.detallePago}
              </Typography>

              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primario)', mt: 1 }}>
                Total: ${formatCLP(devolucionActiva.total)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}