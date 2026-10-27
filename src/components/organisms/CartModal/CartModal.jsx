import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CustomButton from '../../atoms/Button/CustomButton';

export default function CartModal({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onCotizar,
  onPagar,
  onFiltrarVendedor,
}) {
  if (!isOpen) return null;

  const total = cartItems.reduce(
    (acc, item) => acc + (Number(item.valor) || 0) * (Number(item.cantidad) || 1),
    0
  );
  const neto = Math.round(total / 1.19);
  const iva = total - neto;

  const vendedorActual = cartItems.length > 0 ? cartItems[0].vendedor || 'Tienda Oficial' : null;

  const formatCLP = (monto) => monto.toLocaleString('es-CL');

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
        justifyContent: 'flex-end',
        zIndex: 1400,
      }}
      onClick={onClose}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: '100%',
          maxWidth: 400,
          height: '100vh',
          bgcolor: 'var(--color-fondo)',
          borderLeft: '1.5px solid var(--color-texto-oscuro)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 20px rgba(44, 44, 42, 0.25)',
          boxSizing: 'border-box',
        }}
      >
        {/* Cabecera terracota con la X de Figma */}
        <Box
          sx={{
            bgcolor: 'var(--color-primario)',
            height: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: 2,
            flexShrink: 0,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              color: 'var(--color-texto-oscuro)',
              p: 0.5,
              '&:hover': {
                bgcolor: 'transparent',
                opacity: 0.8,
              },
            }}
          >
            <CloseIcon sx={{ fontSize: '2.4rem', fontWeight: 800 }} />
          </IconButton>
        </Box>

        {/* Lista central de productos */}
        <Box
          sx={{
            flex: 1,
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
          }}
        >
          {cartItems.length === 0 ? (
            <Typography
              sx={{
                color: 'var(--color-borde)',
                textAlign: 'center',
                mt: 5,
                fontSize: '0.95rem',
              }}
            >
              El carrito está vacío
            </Typography>
          ) : (
            cartItems.map((item) => {
              const cantidad = item.cantidad || 1;
              const subtotal = (Number(item.valor) || 0) * cantidad;
              const cantDisplay = cantidad < 10 ? `0${cantidad}` : `${cantidad}`;
              const key = item.itemKey || item.id;

              return (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    pb: 1,
                    borderBottom: '1px solid var(--color-borde)',
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: 'var(--color-texto-oscuro)',
                      }}
                    >
                      {item.nombre}
                    </Typography>
                    {(item.tallaSeleccionada || item.colorSeleccionado) && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'var(--color-borde)',
                          display: 'block',
                          fontSize: '0.78rem',
                        }}
                      >
                        {item.tallaSeleccionada && `Talla: ${item.tallaSeleccionada} `}
                        {item.colorSeleccionado && `| Color: ${item.colorSeleccionado}`}
                      </Typography>
                    )}
                  </Box>

                  {/* Stepper de cantidad estilo Figma [ 02 ▵▿ ] */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--color-texto-oscuro)',
                      bgcolor: 'var(--color-input-bg)',
                      height: 28,
                      borderRadius: '2px',
                    }}
                  >
                    <Typography
                      sx={{
                        width: 30,
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--color-texto-oscuro)',
                      }}
                    >
                      {cantDisplay}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        borderLeft: '1px solid var(--color-texto-oscuro)',
                      }}
                    >
                      <Box
                        component="button"
                        type="button"
                        onClick={() => onUpdateQuantity && onUpdateQuantity(key, cantidad + 1)}
                        sx={arrowBtnStyle}
                      >
                        ▲
                      </Box>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => onUpdateQuantity && onUpdateQuantity(key, Math.max(0, cantidad - 1))}
                        sx={arrowBtnStyle}
                      >
                        ▼
                      </Box>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--color-primario)',
                      minWidth: 75,
                      textAlign: 'right',
                    }}
                  >
                    {formatCLP(subtotal)}
                  </Typography>
                </Box>
              );
            })
          )}
        </Box>

        {/* Sección inferior fija: Regla vendedor único, Neto, IVA y Total */}
        <Box
          sx={{
            borderTop: '1.5px solid var(--color-texto-oscuro)',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.8,
            bgcolor: 'var(--color-fondo)',
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Typography sx={{ fontSize: '0.8rem', color: 'var(--color-texto-oscuro)', lineHeight: 1.2 }}>
              Solo se pueden agregar Artículos del mismo vendedor
            </Typography>
            <CustomButton
              pill
              fullWidth={false}
              onClick={() => onFiltrarVendedor && onFiltrarVendedor(vendedorActual)}
              sx={{
                px: 1.8,
                py: 0.3,
                height: 28,
                fontSize: '0.82rem',
                minWidth: 'auto',
              }}
            >
              Ver
            </CustomButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--color-texto-oscuro)' }}>
              Neto
            </Typography>
            <Box sx={calcBoxStyle}>{formatCLP(neto)}</Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--color-texto-oscuro)' }}>
              IVA (19%)
            </Typography>
            <Box sx={calcBoxStyle}>{formatCLP(iva)}</Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--color-texto-oscuro)' }}>
              Total
            </Typography>
            <Box sx={calcBoxStyle}>{formatCLP(total)}</Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
            <CustomButton
              pill
              onClick={() => onCotizar && onCotizar(cartItems)}
              disabled={cartItems.length === 0}
            >
              Cotizar
            </CustomButton>

            <CustomButton
              pill
              onClick={() => onPagar && onPagar(cartItems)}
              disabled={cartItems.length === 0}
            >
              Pagar
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const arrowBtnStyle = {
  background: 'none',
  border: 'none',
  height: '13px',
  width: '16px',
  fontSize: '8px',
  lineHeight: '12px',
  textAlign: 'center',
  cursor: 'pointer',
  color: 'var(--color-texto-oscuro)',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: 'var(--color-fondo)',
  },
};

const calcBoxStyle = {
  minWidth: 90,
  height: 24,
  border: '1px solid var(--color-texto-oscuro)',
  bgcolor: 'var(--color-input-bg)',
  borderRadius: '3px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.88rem',
  fontWeight: 700,
  color: 'var(--color-primario)',
  px: 0.8,
  boxSizing: 'border-box',
};