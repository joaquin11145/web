import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomButton from '../../atoms/Button/CustomButton';

export default function QuotationModal({
  open,
  onClose,
  itemsCotizados = [],
  totalCotizado = 0,
}) {
  const [paso, setPaso] = useState('exito');

  if (!open) return null;

  const handleCerrarModal = () => {
    setPaso('exito');
    if (onClose) onClose();
  };

  const formatCLP = (monto) => Number(monto || 0).toLocaleString('es-CL');

  // Fecha de vencimiento a 15 días calculada de forma sincrónica en memoria
  const hoy = new Date();
  const fechaVence = new Date(hoy.setDate(hoy.getDate() + 15)).toLocaleDateString('es-CL');

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(44, 44, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1600,
        p: 2,
        boxSizing: 'border-box',
      }}
      onClick={handleCerrarModal}
    >
      {/* VISTA 1: Cotización exitosa (Figma) */}
      {paso === 'exito' && (
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: '100%',
            maxWidth: 340,
            bgcolor: 'var(--color-fondo)',
            border: '1.5px solid var(--color-texto-oscuro)',
            borderRadius: '28px',
            p: 3,
            boxShadow: '0 12px 32px rgba(44, 44, 42, 0.28)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            boxSizing: 'border-box',
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '1rem',
              color: 'var(--color-texto-oscuro)',
            }}
          >
            Cotización exitosa
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ width: 110 }}>
              <CustomButton
                pill
                onClick={() => setPaso('detalle')}
                sx={{ height: 34, fontSize: '0.9rem' }}
              >
                Ver
              </CustomButton>
            </Box>
          </Box>
        </Box>
      )}

      {/* VISTA 2: Cotización Detalle con especificación de Talla y Color */}
      {paso === 'detalle' && (
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: '100%',
            maxWidth: 400,
            bgcolor: 'var(--color-fondo)',
            border: '1.5px solid var(--color-texto-oscuro)',
            borderRadius: '28px',
            p: 3,
            boxShadow: '0 12px 32px rgba(44, 44, 42, 0.28)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxSizing: 'border-box',
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '1rem',
              color: 'var(--color-texto-oscuro)',
            }}
          >
            Cotización
          </Typography>

          {/* Caja con borde que contiene el desglose, estado y fecha de vencimiento */}
          <Box
            sx={{
              border: '1px solid var(--color-texto-oscuro)',
              borderRadius: '4px',
              bgcolor: 'var(--color-fondo)',
              p: 2,
              minHeight: 190,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Lista de productos cotizados con Talla y Color detallados */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.2,
                overflowY: 'auto',
                maxHeight: 130,
              }}
            >
              <Typography sx={{ fontSize: '0.82rem', color: 'var(--color-borde)', mb: 0.5 }}>
                Detalle...
              </Typography>
              {itemsCotizados.map((item, index) => {
                const subtotal = (Number(item.valor) || 0) * (Number(item.cantidad) || 1);
                const tieneVariantes = Boolean(item.tallaSeleccionada || item.colorSeleccionado);

                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 1,
                      borderBottom: index < itemsCotizados.length - 1 ? '1px dashed var(--color-borde)' : 'none',
                      pb: index < itemsCotizados.length - 1 ? 0.8 : 0,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
                        • {item.nombre} (x{item.cantidad || 1})
                      </Typography>
                      {tieneVariantes && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: 'var(--color-borde)',
                            fontSize: '0.76rem',
                            ml: 1.2,
                          }}
                        >
                          {item.tallaSeleccionada && `Talla: ${item.tallaSeleccionada} `}
                          {item.colorSeleccionado && `| Color: ${item.colorSeleccionado}`}
                        </Typography>
                      )}
                    </Box>

                    <Typography sx={{ fontSize: '0.84rem', color: 'var(--color-primario)', fontWeight: 700 }}>
                      ${formatCLP(subtotal)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Campos inferiores: Estado y Vencimiento */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <Typography sx={{ fontSize: '0.78rem', color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>
                  Estado:
                </Typography>
                <Box
                  sx={{
                    border: '1px solid var(--color-texto-oscuro)',
                    borderRadius: '2px',
                    px: 0.8,
                    py: 0.2,
                    fontSize: '0.75rem',
                    bgcolor: 'var(--color-input-bg)',
                    color: 'var(--color-texto-oscuro)',
                    minWidth: 55,
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  Válida
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <Typography sx={{ fontSize: '0.78rem', color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>
                  vence:
                </Typography>
                <Box
                  sx={{
                    border: '1px solid var(--color-texto-oscuro)',
                    borderRadius: '2px',
                    px: 0.8,
                    py: 0.2,
                    fontSize: '0.75rem',
                    bgcolor: 'var(--color-input-bg)',
                    color: 'var(--color-texto-oscuro)',
                    minWidth: 70,
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  {fechaVence}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
            <Box sx={{ width: 110 }}>
              <CustomButton
                pill
                onClick={handleCerrarModal}
                sx={{ height: 34, fontSize: '0.9rem' }}
              >
                Cerrar
              </CustomButton>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}