import React, { useState } from 'react';
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
    articulos: [
      { nombre: 'Polera Deportiva', cantidad: 2, talla: 'M', color: 'Rojo', precio: 12000 },
    ],
    total: 24000,
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
    articulos: [
      { nombre: 'Producto 2', cantidad: 1, talla: '38', color: 'Rojo', precio: 7000 },
    ],
    total: 7000,
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
    articulos: [
      { nombre: 'Polera', cantidad: 1, talla: 'L', color: 'Verde', precio: 12000 },
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

export default function EmprendedorDashboard({ onCrearProducto, cartProps = {} }) {
  const navigate = useNavigate();

  // Estados de Pedidos
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [pedidoActivo, setPedidoActivo] = useState(pedidosIniciales[0]);

  // Modal para crear publicación desde la barra superior
  const [modalCrearOpen, setModalCrearOpen] = useState(false);

  // Modal de Detalles del Pago
  const [modalPagoOpen, setModalPagoOpen] = useState(false);

  const formatCLP = (monto) => Number(monto || 0).toLocaleString('es-CL');

  // Acción interactiva del botón "Entregar"
  const handleEntregar = () => {
    if (!pedidoActivo) return;
    const actualizados = pedidos.map((p) =>
      p.id === pedidoActivo.id ? { ...p, estado: 'Entregado' } : p
    );
    setPedidos(actualizados);
    setPedidoActivo((prev) => ({ ...prev, estado: 'Entregado' }));
  };

  const handleGuardarNuevaPublicacion = (form) => {
    if (onCrearProducto) {
      onCrearProducto(form);
    }
    setModalCrearOpen(false);
  };

  return (
    <MainLayout {...cartProps}>
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
          {/* Lado Izquierdo: Cuadro grande con scroll (Visor de pedidos de Figma) */}
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
              Pedidos recibidos ({pedidos.length})
            </Typography>

            {pedidos.map((p) => {
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
            })}
          </Box>

          {/* Lado Derecho: Inputs redondeados y botones terracota de Figma */}
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
              {/* Campo Despacho / Retiro */}
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600, display: 'block', mb: 0.4 }}>
                  Despacho/Retiro
                </Typography>
                <Box sx={wireframeInputBoxStyle}>
                  {pedidoActivo?.modalidad || ''}
                </Box>
              </Box>

              {/* Campo Fecha de Emisión */}
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600, display: 'block', mb: 0.4 }}>
                  Fecha de Emisión
                </Typography>
                <Box sx={wireframeInputBoxStyle}>
                  {pedidoActivo?.fechaEmision || ''}
                </Box>
              </Box>

              {/* Campo Fecha de Entrega */}
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600, display: 'block', mb: 0.4 }}>
                  Fecha de entrega
                </Typography>
                <Box sx={wireframeInputBoxStyle}>
                  {pedidoActivo?.fechaEntrega || ''}
                </Box>
              </Box>
            </Box>

            {/* Botones inferiores del wireframe */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                disableElevation
                onClick={() => setModalPagoOpen(true)}
                sx={actionPillButtonStyle}
              >
                Detalles del Pago
              </Button>

              <Button
                fullWidth
                variant="contained"
                disableElevation
                onClick={handleEntregar}
                disabled={pedidoActivo?.estado === 'Entregado'}
                sx={{
                  ...actionPillButtonStyle,
                  bgcolor: pedidoActivo?.estado === 'Entregado' ? 'var(--color-borde)' : 'var(--color-primario)',
                  '&:hover': {
                    bgcolor: pedidoActivo?.estado === 'Entregado' ? 'var(--color-borde)' : 'var(--color-primario-hover, var(--color-primario))',
                  },
                }}
              >
                {pedidoActivo?.estado === 'Entregado' ? 'Entregado ✓' : 'Entregar'}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Modal: Crear Publicación (reutilizando ProductForm) */}
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

// Estilos de botones píldora con borde y sombra del Figma
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

// Estilo de los campos con esquinas redondeadas estilo wireframe
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