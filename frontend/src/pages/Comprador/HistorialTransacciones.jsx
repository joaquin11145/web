import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CustomButton from '../../components/atoms/Button/CustomButton';
import { generarHistorialTransaccionalPDF } from '../../utils/pdfGenerator';

const transaccionesIniciales = [
  {
    id: 1,
    nombre: 'Transacción 1',
    fecha: '12/09/2026',
    estado: 'Completada',
    tipo: 'Compra de producto',
    metodoPago: 'Débito / Crédito',
    detallePago: 'Visa terminada en 3456 (Aprobada)',
    total: 24000,
  },
  {
    id: 2,
    nombre: 'Transacción 2',
    fecha: '20/09/2026',
    estado: 'Completada',
    tipo: 'Compra de producto',
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'Comprobante TRX-983210 verificado',
    total: 7000,
  },
  {
    id: 3,
    nombre: 'Transacción 3',
    fecha: '05/10/2026',
    estado: 'Pendiente',
    tipo: 'Cotización aceptada',
    metodoPago: 'Débito / Crédito',
    detallePago: 'MasterCard terminada en 1209 (En validación)',
    total: 16000,
  },
  {
    id: 4,
    nombre: 'Transacción 4',
    fecha: '18/10/2026',
    estado: 'Completada',
    tipo: 'Compra de servicio',
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'Comprobante TRX-541209 verificado',
    total: 10000,
  },
];

const devolucionesAprobadasMock = [
  {
    id: 101,
    cliente: 'Juan Pérez (11.111.111-1)',
    producto: 'Polera Deportiva Roja (Talla S)',
    motivo: 'Talla no corresponde a la tabla publicada',
    estado: 'Aprobada',
    montoReintegrado: 12000,
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

  const handleExportarHistorialPDF = () => {
    generarHistorialTransaccionalPDF(transacciones, devolucionesAprobadasMock, cartProps?.currentUser);
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
                  <Typography variant="caption" sx={{ color: 'var(--color-borde)', display: 'block' }}>
                    {t.fecha} • {t.estado}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Columna Derecha: Detalle de la Transacción + Exportación Reporte Operativo */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                Detalle Transacción
              </Typography>
            </Box>

            <Box sx={{ minWidth: 230 }}>
              <CustomButton
                pill
                outlined
                onClick={handleExportarHistorialPDF}
                sx={{
                  borderColor: 'var(--color-primario)',
                  color: 'var(--color-primario)',
                  fontSize: '0.84rem',
                }}
              >
                <PictureAsPdfIcon sx={{ fontSize: 18, mr: 0.8 }} />
                Reporte Operativo PDF
              </CustomButton>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 540 }}>
            <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
              <strong>Fecha:</strong> {transaccionActiva.fecha}
            </Typography>

            <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
              <strong>Estado:</strong> {transaccionActiva.estado}
            </Typography>

            <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
              <strong>Tipo:</strong> {transaccionActiva.tipo}
            </Typography>

            <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
              <strong>Método de pago:</strong> {transaccionActiva.metodoPago}
            </Typography>

            <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
              <strong>Detalle del Pago:</strong> {transaccionActiva.detallePago}
            </Typography>

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