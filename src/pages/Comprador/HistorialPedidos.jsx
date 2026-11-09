import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CustomButton from '../../components/atoms/Button/CustomButton';

const listaPedidosEjemplo = [
  {
    id: 1,
    nombre: 'Pedido 1',
    estado: 'Entregado',
    producto: 'Polera Deportiva Roja',
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
    estado: 'En tránsito',
    producto: 'Zapatillas Urbanas Talla 38',
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

  const formatCLP = (monto) => monto.toLocaleString('es-CL');

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
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
              Pedidos
            </Typography>
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
              width: 140,
              height: 140,
              bgcolor: 'var(--color-input-bg)',
              border: '1px solid var(--color-borde)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: 'var(--color-texto-oscuro)',
              mb: 3,
            }}
          >
            foto
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, mb: 4, maxWidth: 500 }}>
            <Box>
              <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Producto:</strong> {pedidoActivo.producto}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Método de pago:</strong> {pedidoActivo.metodoPago}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Detalle del Pago:</strong> {pedidoActivo.detallePago}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '1.05rem', color: 'var(--color-texto-oscuro)', fontWeight: 700 }}>
                Total: ${formatCLP(pedidoActivo.total)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', maxWidth: 500, mt: 'auto' }}>
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