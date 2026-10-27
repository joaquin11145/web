import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CustomButton from '../../components/atoms/Button/CustomButton';

const cotizacionesEjemplo = [
  {
    id: 1,
    codigo: 'COT-001',
    vendedor: 'Tienda Oficial',
    estado: 'Válida',
    fechaEmision: '20 de Oct. de 2026',
    fechaVence: '04 de Nov. de 2026',
    items: [
      { id: 1, nombre: 'Polera Deportiva', valor: 12000, cantidad: 2, tallaSeleccionada: 'M', colorSeleccionado: 'Rojo' },
      { id: 2, nombre: 'Producto 2', valor: 7000, cantidad: 1, tallaSeleccionada: '38', colorSeleccionado: 'Rojo' },
    ],
  },
  {
    id: 2,
    codigo: 'COT-002',
    vendedor: 'Textiles del Sur',
    estado: 'Pendiente',
    fechaEmision: '24 de Oct. de 2026',
    fechaVence: '08 de Nov. de 2026',
    items: [
      { id: 3, nombre: 'Producto 3', valor: 12000, cantidad: 3, tallaSeleccionada: '40', colorSeleccionado: 'Verde' },
    ],
  },
  {
    id: 3,
    codigo: 'COT-003',
    vendedor: 'Tienda Oficial',
    estado: 'Vencida',
    fechaEmision: '01 de Oct. de 2026',
    fechaVence: '16 de Oct. de 2026',
    items: [
      { id: 1, nombre: 'Polera', valor: 12000, cantidad: 1, tallaSeleccionada: 'L', colorSeleccionado: 'Amarillo' },
    ],
  },
];

export default function HistorialCotizaciones({ cartProps = {}, onAddToCart }) {
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));

  const [cotizaciones, setCotizaciones] = useState(cotizacionesEjemplo);
  const [cotizacionActiva, setCotizacionActiva] = useState(cotizacionesEjemplo[0]);
  const [vistaMovil, setVistaMovil] = useState('lista');

  const handleSeleccionarCotizacion = (cot) => {
    setCotizacionActiva(cot);
    if (esMovil) {
      setVistaMovil('detalle');
    }
  };

  const handleVolverALista = () => {
    setVistaMovil('lista');
  };

  const formatCLP = (monto) => Number(monto || 0).toLocaleString('es-CL');

  // Calcular el total de la cotización activa
  const totalActivo = cotizacionActiva.items.reduce(
    (acc, curr) => acc + (Number(curr.valor) || 0) * (Number(curr.cantidad) || 1),
    0
  );

  // Acción interactiva: Pasar todos los productos de la cotización al carrito
  const handleAceptarYPasarAlCarrito = () => {
    if (cotizacionActiva.estado === 'Vencida') {
      alert('Esta cotización ha vencido y no se puede procesar.');
      return;
    }
    if (onAddToCart) {
      cotizacionActiva.items.forEach((item) => {
        onAddToCart({
          ...item,
          vendedor: cotizacionActiva.vendedor,
        });
      });
    }
  };

  // Acción interactiva: Cancelar o rechazar cotización
  const handleAnularCotizacion = () => {
    setCotizaciones((prev) =>
      prev.map((c) => (c.id === cotizacionActiva.id ? { ...c, estado: 'Anulada' } : c))
    );
    setCotizacionActiva((prev) => ({ ...prev, estado: 'Anulada' }));
  };

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
        {/* Columna Izquierda: Lista de Cotizaciones */}
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
            Mis Cotizaciones
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
            {cotizaciones.map((cot) => {
              const seleccionada = cotizacionActiva.id === cot.id;
              return (
                <Box
                  key={cot.id}
                  onClick={() => handleSeleccionarCotizacion(cot)}
                  sx={{
                    bgcolor: seleccionada ? 'rgba(195, 85, 43, 0.18)' : 'var(--color-input-bg)',
                    border: '1px solid',
                    borderColor: seleccionada ? 'var(--color-primario)' : 'var(--color-borde)',
                    borderRadius: '8px',
                    p: 1.6,
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: seleccionada ? 'rgba(195, 85, 43, 0.18)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: '0.92rem',
                        fontWeight: seleccionada ? 700 : 600,
                        color: seleccionada ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                      }}
                    >
                      {cot.codigo}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color:
                          cot.estado === 'Válida'
                            ? '#2e7d32'
                            : cot.estado === 'Vencida' || cot.estado === 'Anulada'
                            ? '#d32f2f'
                            : 'var(--color-primario)',
                      }}
                    >
                      {cot.estado}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'var(--color-borde)', display: 'block' }}>
                    Vence: {cot.fechaVence}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Columna Derecha: Detalle de Cotización Interactivo */}
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
              Detalle de Cotización ({cotizacionActiva.codigo})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
              <strong>Vendedor:</strong> {cotizacionActiva.vendedor}
            </Typography>
            <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
              <strong>Estado:</strong> {cotizacionActiva.estado}
            </Typography>
            <Typography sx={{ fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
              <strong>Vence:</strong> {cotizacionActiva.fechaVence}
            </Typography>
          </Box>

          {/* Desglose de Artículos y Variantes */}
          <Box
            sx={{
              border: '1.2px solid var(--color-borde)',
              borderRadius: '8px',
              p: 2,
              bgcolor: 'var(--color-input-bg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              mb: 3,
            }}
          >
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-texto-oscuro)' }}>
              Artículos incluidos:
            </Typography>

            {cotizacionActiva.items.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1.2,
                  bgcolor: 'var(--color-fondo)',
                  borderRadius: '6px',
                  border: '1px solid var(--color-borde)',
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
                    • {item.nombre} (x{item.cantidad})
                  </Typography>
                  {(item.tallaSeleccionada || item.colorSeleccionado) && (
                    <Typography variant="caption" sx={{ color: 'var(--color-borde)', display: 'block', ml: 1.2 }}>
                      {item.tallaSeleccionada && `Talla: ${item.tallaSeleccionada} `}
                      {item.colorSeleccionado && `| Color: ${item.colorSeleccionado}`}
                    </Typography>
                  )}
                </Box>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primario)' }}>
                  ${formatCLP((Number(item.valor) || 0) * (Number(item.cantidad) || 1))}
                </Typography>
              </Box>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, pt: 1, borderTop: '1px dashed var(--color-borde)' }}>
              <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primario)' }}>
                Total Cotizado: ${formatCLP(totalActivo)}
              </Typography>
            </Box>
          </Box>

          {/* Botones de Interacción con la Cotización */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 'auto', maxWidth: 500 }}>
            <Box sx={{ flex: 1, minWidth: 160 }}>
              <CustomButton
                pill
                onClick={handleAceptarYPasarAlCarrito}
                disabled={cotizacionActiva.estado === 'Vencida' || cotizacionActiva.estado === 'Anulada'}
              >
                Pagar Cotización
              </CustomButton>
            </Box>

            <Box sx={{ flex: 1, minWidth: 160 }}>
              <CustomButton
                pill
                outlined
                onClick={handleAnularCotizacion}
                disabled={cotizacionActiva.estado === 'Vencida' || cotizacionActiva.estado === 'Anulada'}
                sx={{
                  borderColor: 'var(--color-texto-oscuro)',
                  color: 'var(--color-texto-oscuro)',
                }}
              >
                Anular Cotización
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}