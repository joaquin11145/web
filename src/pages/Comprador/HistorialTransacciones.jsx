import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

const transaccionesIniciales = [
  {
    id: 1,
    nombre: 'Transacción 1',
    estado: 'Completada',
    tipo: 'Compra de producto',
    metodoPago: 'Débito / Crédito',
    detallePago: 'Visa terminada en 3456 (Aprobada)',
    total: 24000,
  },
  {
    id: 2,
    nombre: 'Transacción 2',
    estado: 'Completada',
    tipo: 'Compra de producto',
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'Comprobante TRX-983210 verificado',
    total: 7000,
  },
  {
    id: 3,
    nombre: 'Transacción 3',
    estado: 'Pendiente',
    tipo: 'Cotización aceptada',
    metodoPago: 'Débito / Crédito',
    detallePago: 'MasterCard terminada en 1209 (En validación)',
    total: 16000,
  },
  {
    id: 4,
    nombre: 'Transacción 4',
    estado: 'Completada',
    tipo: 'Compra de servicio',
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'Comprobante TRX-541209 verificado',
    total: 10000,
  },
];

export default function HistorialTransacciones({ cartProps = {} }) {
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));

  const [transacciones] = useState(transaccionesIniciales);
  const [transaccionActiva, setTransaccionActiva] = useState(transaccionesIniciales[0]);
  const [vistaMovil, setVistaMovil] = useState('lista');

  const handleSeleccionarTransaccion = (item) => {
    setTransaccionActiva(item);
    if (esMovil) {
      setVistaMovil('detalle');
    }
  };

  const handleVolverALista = () => {
    setVistaMovil('lista');
  };

  const formatCLP = (monto) => Number(monto || 0).toLocaleString('es-CL');

  return (
    <MainLayout {...cartProps}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 960,
          mx: 'auto',
          height: { xs: 'calc(100vh - 100px)', md: 'calc(100vh - 120px)' },
          border: '1.5px solid var(--color-borde)',
          borderRadius: { xs: 0, md: '12px' },
          bgcolor: 'var(--color-fondo)',
          display: 'flex',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(44, 44, 42, 0.08)',
          boxSizing: 'border-box',
        }}
      >
        {/* Columna Izquierda: Lista de Transacciones */}
        <Box
          sx={{
            width: { xs: '100%', md: 260 },
            borderRight: { xs: 'none', md: '1.5px solid var(--color-borde)' },
            bgcolor: 'var(--color-fondo)',
            display: {
              xs: vistaMovil === 'lista' ? 'flex' : 'none',
              md: 'flex',
            },
            flexDirection: 'column',
            p: 2.5,
            gap: 1.5,
            flexShrink: 0,
            boxSizing: 'border-box',
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--color-texto-oscuro)',
              mb: 1,
            }}
          >
            Transacciones
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.2,
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {transacciones.map((t) => {
              const seleccionada = transaccionActiva.id === t.id;
              return (
                <Box
                  key={t.id}
                  onClick={() => handleSeleccionarTransaccion(t)}
                  sx={{
                    bgcolor: seleccionada ? 'rgba(195, 85, 43, 0.18)' : 'var(--color-input-bg)',
                    border: '1px solid',
                    borderColor: seleccionada ? 'var(--color-primario)' : 'var(--color-borde)',
                    borderRadius: '4px',
                    p: 1.6,
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: seleccionada ? 'rgba(195, 85, 43, 0.18)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.92rem',
                      fontWeight: seleccionada ? 700 : 500,
                      color: seleccionada ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                    }}
                  >
                    {t.nombre}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Columna Derecha: Detalle de la Transacción */}
        <Box
          sx={{
            flex: 1,
            display: {
              xs: vistaMovil === 'detalle' ? 'flex' : 'none',
              md: 'flex',
            },
            flexDirection: 'column',
            bgcolor: 'var(--color-fondo)',
            height: '100%',
            overflowY: 'auto',
            p: { xs: 2.5, md: 4 },
            boxSizing: 'border-box',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            {esMovil && (
              <IconButton
                size="small"
                onClick={handleVolverALista}
                sx={{ color: 'var(--color-primario)', mr: 0.5 }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.4rem',
                color: 'var(--color-texto-oscuro)',
              }}
            >
              Transacción
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, maxWidth: 540 }}>
            <Box>
              <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Estado:</strong> {transaccionActiva.estado}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Tipo:</strong> {transaccionActiva.tipo}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Método de pago:</strong> {transaccionActiva.metodoPago}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Detalle del Pago:</strong> {transaccionActiva.detallePago}
              </Typography>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--color-primario)',
                }}
              >
                Total: ${formatCLP(transaccionActiva.total)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}