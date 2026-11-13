import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CustomButton from '../../components/atoms/Button/CustomButton';
import { generarComprobanteVentaPDF } from '../../utils/pdfGenerator';

const listaPedidosEjemplo = [
  {
    id: 1,
    nombre: 'Pedido 1',
    estado: 'Entregado',
    producto: 'Polera Deportiva Roja',
    items: [{ nombre: 'Polera Deportiva Roja', cantidad: 2, valor: 12000 }],
    metodoPago: 'Débito / Crédito',
    detallePago: 'Transacción aprobada (Visa **** 3456)',
    numeroSeguimiento: '60346032',
    transporte: 'Starken',
    fechaEnvio: '12 de Sept. de 2026',
    fechaEntrega: '24 de Sept. de 2026',
    total: 24000,
  },
  {
    id: 2,
    nombre: 'Pedido 2',
    estado: 'Enviado',
    producto: 'Zapatillas Urbanas Talla 38',
    items: [{ nombre: 'Zapatillas Urbanas Talla 38', cantidad: 1, valor: 7000 }],
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'Comprobante TRX-983210 verificado',
    numeroSeguimiento: '71984210',
    transporte: 'Chilexpress',
    fechaEnvio: '20 de Sept. de 2026',
    fechaEntrega: '28 de Sept. de 2026',
    total: 7000,
  },
  {
    id: 3,
    nombre: 'Pedido 3',
    estado: 'Entregado',
    producto: 'Pack 2 Polerones Negros',
    items: [{ nombre: 'Pack 2 Polerones Negros', cantidad: 1, valor: 16000 }],
    metodoPago: 'Débito / Crédito',
    detallePago: 'Transacción aprobada (MasterCard **** 1209)',
    numeroSeguimiento: '55129031',
    transporte: 'Starken',
    fechaEnvio: '05 de Sept. de 2026',
    fechaEntrega: '11 de Sept. de 2026',
    total: 16000,
  },
  {
    id: 4,
    nombre: 'Pedido 4',
    estado: 'En preparación',
    producto: 'Accesorios Deportivos Varios',
    items: [{ nombre: 'Accesorios Deportivos Varios', cantidad: 1, valor: 10000 }],
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'Comprobante TRX-541209 verificado',
    numeroSeguimiento: '88301923',
    transporte: 'Blue Express',
    fechaEnvio: '25 de Sept. de 2026',
    fechaEntrega: '30 de Sept. de 2026',
    total: 10000,
  },
];

export default function HistorialPedidos({ cartProps = {} }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));

  const [pedidos] = useState(listaPedidosEjemplo);
  const [pedidoActivo, setPedidoActivo] = useState(listaPedidosEjemplo[0]);
  const [vistaMovil, setVistaMovil] = useState('lista');

  const handleSeleccionarPedido = (pedido) => {
    setPedidoActivo(pedido);
    if (esMovil) {
      setVistaMovil('detalle');
    }
  };

  const handleVolverALista = () => {
    setVistaMovil('lista');
  };

  const handleSolicitarDevolucion = () => {
    navigate('/devolucion', { state: { pedido: pedidoActivo } });
  };

  const handleVerSeguimiento = () => {
    navigate('/seguimiento', { state: { pedido: pedidoActivo } });
  };

  const handleExportarComprobantePDF = () => {
    generarComprobanteVentaPDF(pedidoActivo, cartProps?.currentUser);
  };

  const formatCLP = (monto) => Number(monto || 0).toLocaleString('es-CL');
  const valorNetoActivo = Math.round((Number(pedidoActivo.total) || 0) / 1.19);
  const ivaActivo = (Number(pedidoActivo.total) || 0) - valorNetoActivo;

  return (
    <MainLayout {...cartProps}>
      <Box
        sx={{
          width: '100%',
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
        <Box
          sx={{
            width: { xs: '100%', md: 280 },
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
              fontWeight: 800,
              fontSize: '1.15rem',
              color: 'var(--color-texto-oscuro)',
              mb: 1,
            }}
          >
            Pedidos
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
            {pedidos.map((pedido) => {
              const seleccionado = pedidoActivo.id === pedido.id;
              return (
                <Box
                  key={pedido.id}
                  onClick={() => handleSeleccionarPedido(pedido)}
                  sx={{
                    bgcolor: seleccionado ? 'rgba(195, 85, 43, 0.18)' : 'var(--color-input-bg)',
                    border: '1px solid',
                    borderColor: seleccionado ? 'var(--color-primario)' : 'var(--color-borde)',
                    borderRadius: '6px',
                    p: 1.8,
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: seleccionado ? 'rgba(195, 85, 43, 0.18)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      fontWeight: seleccionado ? 700 : 500,
                      color: seleccionado ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                    }}
                  >
                    {pedido.nombre}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--color-borde)', display: 'block' }}>
                    {pedido.estado} • ${formatCLP(pedido.total)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
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
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  color: 'var(--color-texto-oscuro)',
                }}
              >
                Detalle del Pedido
              </Typography>
            </Box>

            <Box sx={{ minWidth: 230 }}>
              <CustomButton
                pill
                outlined
                onClick={handleExportarComprobantePDF}
                sx={{
                  borderColor: 'var(--color-primario)',
                  color: 'var(--color-primario)',
                  fontSize: '0.84rem',
                }}
              >
                <PictureAsPdfIcon sx={{ fontSize: 18, mr: 0.8 }} />
                Boleta / Factura PDF
              </CustomButton>
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              color: 'var(--color-texto-oscuro)',
              mb: 2,
            }}
          >
            Estado: <strong>{pedidoActivo.estado}</strong>
          </Typography>

          <Box
            sx={{
              width: 120,
              height: 120,
              bgcolor: 'var(--color-input-bg)',
              border: '1px solid var(--color-borde)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              color: 'var(--color-texto-oscuro)',
              mb: 2.5,
            }}
          >
            foto
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3, maxWidth: 520 }}>
            <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
              <strong>Producto:</strong> {pedidoActivo.producto}
            </Typography>

            <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
              <strong>Fecha de transacción:</strong> {pedidoActivo.fechaEnvio}
            </Typography>

            <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
              <strong>Método de pago:</strong> {pedidoActivo.metodoPago}
            </Typography>

            <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
              <strong>Detalle del Pago:</strong> {pedidoActivo.detallePago}
            </Typography>

            {/* Desglose tributario exigido en pauta */}
            <Box
              sx={{
                p: 1.8,
                bgcolor: 'var(--color-input-bg)',
                border: '1px solid var(--color-borde)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.6,
              }}
            >
              <Typography sx={{ fontSize: '0.88rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Valor Neto (sin IVA):</strong> ${formatCLP(valorNetoActivo)}
              </Typography>
              <Typography sx={{ fontSize: '0.88rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>IVA (19%):</strong> ${formatCLP(ivaActivo)}
              </Typography>
              <Typography sx={{ fontSize: '1.05rem', color: 'var(--color-primario)', fontWeight: 800, pt: 0.5, borderTop: '1px dashed var(--color-borde)' }}>
                Total Cobrado: ${formatCLP(pedidoActivo.total)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', maxWidth: 520, mt: 'auto' }}>
            <Box sx={{ flex: 1, minWidth: 160 }}>
              <CustomButton pill onClick={handleSolicitarDevolucion}>
                Solicitar Devolución
              </CustomButton>
            </Box>
            <Box sx={{ flex: 1, minWidth: 160 }}>
              <CustomButton pill onClick={handleVerSeguimiento}>
                Ver Seguimiento
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}