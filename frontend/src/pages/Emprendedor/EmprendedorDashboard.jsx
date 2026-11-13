import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import ProductForm from '../../components/organisms/ProductForm/ProductoForm.jsx';

const pedidosIniciales = [
  {
    id: 1,
    codigo: 'PED-101',
    cliente: 'Juan Pérez',
    vendedor: 'Textiles del Sur SpA',
    articulos: [
      { nombre: 'Manta Tejida en Lana de Oveja', cantidad: 2, talla: '2 Plazas', color: 'Crudo', precio: 35000 },
    ],
    total: 70000,
    modalidad: 'Despacho a Domicilio',
    fechaEmision: '20 de Oct. de 2026',
    fechaEntrega: '25 de Oct. de 2026',
    estado: 'En preparación',
    metodoPago: 'Débito / Crédito (Visa *** 3456)',
    estadoPago: 'Aprobado y Liquidado',
  },
  {
    id: 2,
    codigo: 'PED-102',
    cliente: 'María López',
    vendedor: 'Textiles del Sur SpA',
    articulos: [
      { nombre: 'Sweater Cuello Tortuga', cantidad: 1, talla: 'M', color: 'Vino', precio: 32000 },
    ],
    total: 32000,
    modalidad: 'Retiro en Tienda',
    fechaEmision: '22 de Oct. de 2026',
    fechaEntrega: '26 de Oct. de 2026',
    estado: 'Listo para retiro',
    metodoPago: 'Transferencia Bancaria',
    estadoPago: 'Comprobante TRX-983210 verificado',
  },
  {
    id: 3,
    codigo: 'PED-103',
    cliente: 'Carlos Soto',
    vendedor: 'Tienda Oficial',
    articulos: [
      { nombre: 'Polera Deportiva Transpirable', cantidad: 1, talla: 'L', color: 'Azul', precio: 12000 },
    ],
    total: 12000,
    modalidad: 'Despacho a Domicilio',
    fechaEmision: '18 de Oct. de 2026',
    fechaEntrega: '23 de Oct. de 2026',
    estado: 'Entregado',
    metodoPago: 'Débito / Crédito (MasterCard *** 8812)',
    estadoPago: 'Aprobado y Liquidado',
  },
];

export default function EmprendedorDashboard({ onCrearProducto, cartProps = {}, currentUser = null }) {
  const navigate = useNavigate();

  const miEmpresa = currentUser?.nombreEmpresa || currentUser?.name || 'Textiles del Sur SpA';

  const [pedidos, setPedidos] = useState(pedidosIniciales);

  // FILTRO ESTRICTO: Solo pedidos de la empresa en sesión
  const misPedidos = useMemo(() => {
    return pedidos.filter(
      (p) => (p.vendedor || '').trim().toLowerCase() === miEmpresa.trim().toLowerCase()
    );
  }, [pedidos, miEmpresa]);

  const [pedidoActivo, setPedidoActivo] = useState(misPedidos[0] || null);

  useEffect(() => {
    if (misPedidos.length > 0 && (!pedidoActivo || !misPedidos.some((p) => p.id === pedidoActivo.id))) {
      setPedidoActivo(misPedidos[0]);
    }
  }, [misPedidos, pedidoActivo]);

  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalPagoOpen, setModalPagoOpen] = useState(false);

  const formatCLP = (monto) => Number(monto || 0).toLocaleString('es-CL');

  const handleEntregar = () => {
    if (!pedidoActivo) return;
    console.log('[BACKEND PENDIENTE] PATCH /api/emprendedor/pedidos/' + pedidoActivo.id + '/entregar');
    setPedidos((prev) =>
      prev.map((p) => (p.id === pedidoActivo.id ? { ...p, estado: 'Entregado' } : p))
    );
    setPedidoActivo((prev) => ({ ...prev, estado: 'Entregado' }));
  };

  const handleGuardarNuevaPublicacion = (form) => {
    if (onCrearProducto) {
      onCrearProducto({ ...form, vendedor: miEmpresa });
    }
    setModalCrearOpen(false);
  };

  return (
    <MainLayout {...cartProps} currentUser={currentUser}>
      <Box sx={{ maxWidth: 860, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2.2, pb: 4 }}>
        {/* 1. Barra de los 4 botones superiores de Figma */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={() => navigate('/emprendedor/publicaciones')}
            sx={topPillButtonStyle}
          >
            Publicaciones
          </Button>

          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={() => setModalCrearOpen(true)}
            sx={topPillButtonStyle}
          >
            Crear publicacion
          </Button>

          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={() => navigate('/emprendedor/stock')}
            sx={topPillButtonStyle}
          >
            Administrar Stock
          </Button>

          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={() => navigate('/comprador')}
            sx={topPillButtonStyle}
          >
            Ingresar como cliente
          </Button>
        </Box>

        {/* Indicador de empresa activa */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'var(--color-input-bg)',
            borderRadius: '12px',
            border: '1px solid var(--color-borde)',
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
            Panel de Pedidos: <strong style={{ color: 'var(--color-primario)' }}>{miEmpresa}</strong>
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--color-borde)' }}>
            Tienes {misPedidos.length} órdenes asignadas a tu empresa
          </Typography>
        </Box>

        {/* 2. Contenedor de Gestión de Pedidos de Figma */}
        <Box
          sx={{
            border: '2px solid var(--color-borde)',
            borderRadius: '16px',
            bgcolor: 'var(--color-fondo)',
            p: { xs: 1.5, sm: 2.5 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            boxShadow: '0 6px 18px rgba(44, 44, 42, 0.08)',
          }}
        >
          {/* Lado Izquierdo: Visor de pedidos */}
          <Box
            sx={{
              flex: 1.8,
              minHeight: 280,
              maxHeight: 400,
              border: '1.5px solid var(--color-borde)',
              borderRadius: '8px',
              bgcolor: 'var(--color-input-bg)',
              p: 1.5,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.2,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--color-texto-oscuro)', px: 0.5 }}>
              Pedidos recibidos ({misPedidos.length})
            </Typography>

            {misPedidos.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'var(--color-borde)', fontStyle: 'italic', py: 4, textAlign: 'center' }}>
                No tienes pedidos recibidos pendientes para tu empresa.
              </Typography>
            ) : (
              misPedidos.map((p) => {
                const seleccionado = pedidoActivo?.id === p.id;
                return (
                  <Box
                    key={p.id}
                    onClick={() => setPedidoActivo(p)}
                    sx={{
                      p: 1.5,
                      bgcolor: seleccionado ? 'rgba(195, 85, 43, 0.12)' : 'var(--color-fondo)',
                      border: '1.2px solid',
                      borderColor: seleccionado ? 'var(--color-primario)' : 'var(--color-borde)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: seleccionado ? 'rgba(195, 85, 43, 0.12)' : 'rgba(0, 0, 0, 0.03)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
                        {p.codigo} — {p.cliente}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: p.estado === 'Entregado' ? '#2e7d32' : 'var(--color-primario)',
                        }}
                      >
                        {p.estado}
                      </Typography>
                    </Box>

                    {p.articulos.map((art, idx) => (
                      <Typography key={idx} variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontSize: '0.82rem' }}>
                        • {art.nombre} (x{art.cantidad}) {art.talla && `[Talla: ${art.talla}]`} {art.color && `[Color: ${art.color}]`}
                      </Typography>
                    ))}

                    <Typography
                      sx={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--color-primario)',
                        mt: 0.5,
                        textAlign: 'right',
                      }}
                    >
                      Total: ${formatCLP(p.total)}
                    </Typography>
                  </Box>
                );
              })
            )}
          </Box>

          {/* Lado Derecho: Inputs redondeados y botones terracota */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600, display: 'block', mb: 0.4 }}>
                  Despacho/Retiro
                </Typography>
                <Box sx={wireframeInputBoxStyle}>
                  {pedidoActivo?.modalidad || ''}
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600, display: 'block', mb: 0.4 }}>
                  Fecha de Emisión
                </Typography>
                <Box sx={wireframeInputBoxStyle}>
                  {pedidoActivo?.fechaEmision || ''}
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600, display: 'block', mb: 0.4 }}>
                  Fecha de entrega
                </Typography>
                <Box sx={wireframeInputBoxStyle}>
                  {pedidoActivo?.fechaEntrega || ''}
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                disableElevation
                onClick={() => setModalPagoOpen(true)}
                disabled={!pedidoActivo}
                sx={actionPillButtonStyle}
              >
                Detalles del Pago
              </Button>

              <Button
                fullWidth
                variant="contained"
                disableElevation
                onClick={handleEntregar}
                disabled={!pedidoActivo || pedidoActivo?.estado === 'Entregado'}
                sx={{
                  ...actionPillButtonStyle,
                  bgcolor: (!pedidoActivo || pedidoActivo?.estado === 'Entregado') ? 'var(--color-borde)' : 'var(--color-primario)',
                  '&:hover': {
                    bgcolor: (!pedidoActivo || pedidoActivo?.estado === 'Entregado')
                      ? 'var(--color-borde)'
                      : 'var(--color-primario-hover, var(--color-primario))',
                  },
                }}
              >
                {pedidoActivo?.estado === 'Entregado' ? 'Entregado ✓' : 'Entregar'}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Modal: Crear Publicación */}
        <ProductForm
          open={modalCrearOpen}
          onClose={() => setModalCrearOpen(false)}
          onSave={handleGuardarNuevaPublicacion}
          producto={null}
        />

        {/* Modal: Detalles del Pago */}
        <Dialog
          open={modalPagoOpen}
          onClose={() => setModalPagoOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              border: '1.5px solid var(--color-texto-oscuro)',
              p: 2,
              bgcolor: 'var(--color-fondo)',
              maxWidth: 420,
              width: '100%',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, color: 'var(--color-primario)', fontSize: '1.15rem' }}>
            Detalles del Pago — {pedidoActivo?.codigo}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, pt: 1 }}>
            <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)' }}>
              <strong>Cliente:</strong> {pedidoActivo?.cliente}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)' }}>
              <strong>Método de pago:</strong> {pedidoActivo?.metodoPago}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)' }}>
              <strong>Estado del pago:</strong> {pedidoActivo?.estadoPago}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 700, mt: 1 }}>
              Total recibido: ${formatCLP(pedidoActivo?.total)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setModalPagoOpen(false)}
              sx={{
                bgcolor: 'var(--color-primario)',
                color: 'var(--color-texto-claro)',
                borderRadius: '20px',
                textTransform: 'none',
                px: 3,
                fontWeight: 600,
                '&:hover': { bgcolor: 'var(--color-primario-hover)' },
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}

const topPillButtonStyle = {
  height: 38,
  borderRadius: '20px',
  bgcolor: 'var(--color-primario)',
  color: 'var(--color-texto-claro)',
  border: '1.5px solid var(--color-texto-oscuro)',
  boxShadow: '0 3px 6px rgba(44, 44, 42, 0.35)',
  fontWeight: 600,
  fontSize: '0.92rem',
  textTransform: 'none',
  '&:hover': {
    bgcolor: 'var(--color-primario-hover, var(--color-primario))',
  },
};

const actionPillButtonStyle = {
  height: 36,
  borderRadius: '20px',
  bgcolor: 'var(--color-primario)',
  color: 'var(--color-texto-claro)',
  border: '1.2px solid var(--color-texto-oscuro)',
  boxShadow: '0 3px 6px rgba(44, 44, 42, 0.3)',
  fontWeight: 600,
  fontSize: '0.88rem',
  textTransform: 'none',
  '&:hover': {
    bgcolor: 'var(--color-primario-hover, var(--color-primario))',
  },
};

const wireframeInputBoxStyle = {
  height: 36,
  borderRadius: '18px',
  border: '1.5px solid var(--color-texto-oscuro)',
  bgcolor: 'var(--color-input-bg)',
  display: 'flex',
  alignItems: 'center',
  px: 2,
  fontSize: '0.85rem',
  color: 'var(--color-texto-oscuro)',
  fontWeight: 500,
};