import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomButton from '../../atoms/Button/CustomButton';

export default function PaymentModal({
  open,
  onClose,
  total = 0,
  direccionesGuardadas = [],
  onAbrirNuevaDireccion,
  onPagoCompletado,
}) {
  const [metodoPago, setMetodoPago] = useState('');
  const [paso, setPaso] = useState('metodo'); // 'metodo' | 'despacho' | 'formulario'
  const [tipoEntrega, setTipoEntrega] = useState('retiro'); // 'retiro' | 'despacho'
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('');

  // Formulario Débito / Crédito
  const [tarjeta, setTarjeta] = useState({
    nombre: '',
    numero: '',
    vencimiento: '',
    cvv: '',
  });

  // Formulario Transferencia
  const [transferencia, setTransferencia] = useState({
    nombre: '',
    codigoTransferencia: '',
  });

  if (!open) return null;

  const handleReset = () => {
    setPaso('metodo');
    setMetodoPago('');
    setTipoEntrega('retiro');
    setDireccionSeleccionada('');
    setTarjeta({ nombre: '', numero: '', vencimiento: '', cvv: '' });
    setTransferencia({ nombre: '', codigoTransferencia: '' });
    if (onClose) onClose();
  };

  const handleFinalizar = () => {
    const orden = {
      metodoPago,
      tipoEntrega,
      direccion: tipoEntrega === 'despacho' ? direccionSeleccionada : 'Retiro en tienda (Dirección de la Tienda)',
      datosPago: metodoPago === 'transferencia' ? transferencia : tarjeta,
      total,
    };
    if (onPagoCompletado) {
      onPagoCompletado(orden);
    }
    alert('¡Pago y pedido procesados con éxito!');
    handleReset();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1500,
        p: 2,
        boxSizing: 'border-box',
      }}
      onClick={handleReset}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: '100%',
          maxWidth: 480,
          maxHeight: '94vh',
          bgcolor: 'var(--color-fondo)',
          border: '1.5px solid var(--color-texto-oscuro)',
          borderRadius: '16px',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.38)',
          p: { xs: 2.5, sm: 3.5 },
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {/* Cabecera naranja estilo Figma */}
        <Box
          sx={{
            mb: 2.5,
            p: 1.2,
            bgcolor: 'var(--color-primario)',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--color-texto-claro)',
            }}
          >
            {paso === 'metodo' && 'Seleccione Método de Pago'}
            {paso === 'despacho' && 'Despacho y Entrega'}
            {paso === 'formulario' && (metodoPago === 'debito-credito' ? 'Débito / Crédito' : 'Transferencia Bancaria')}
          </Typography>
        </Box>

        {/* PASO 1: Selección de Método de Pago estilo Figma */}
        {paso === 'metodo' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 1 }}>
            <Box
              sx={{
                border: '1.2px solid var(--color-borde)',
                borderRadius: '6px',
                bgcolor: 'var(--color-input-bg)',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  p: 1.2,
                  bgcolor: 'var(--color-fondo)',
                  borderBottom: '1px solid var(--color-borde)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
                  Selecciona una opción:
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'var(--color-borde)' }}>▼</Typography>
              </Box>

              <Box
                onClick={() => setMetodoPago('debito-credito')}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--color-borde)',
                  bgcolor: metodoPago === 'debito-credito' ? 'rgba(195, 85, 43, 0.12)' : 'transparent',
                  color: metodoPago === 'debito-credito' ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                  fontWeight: metodoPago === 'debito-credito' ? 700 : 500,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    bgcolor: 'rgba(195, 85, 43, 0.08)',
                  },
                }}
              >
                Débito / Crédito
                {metodoPago === 'debito-credito' && <span>✓</span>}
              </Box>

              <Box
                onClick={() => setMetodoPago('transferencia')}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  bgcolor: metodoPago === 'transferencia' ? 'rgba(195, 85, 43, 0.12)' : 'transparent',
                  color: metodoPago === 'transferencia' ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                  fontWeight: metodoPago === 'transferencia' ? 700 : 500,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    bgcolor: 'rgba(195, 85, 43, 0.08)',
                  },
                }}
              >
                Transferencia
                {metodoPago === 'transferencia' && <span>✓</span>}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
              <CustomButton pill outlined onClick={handleReset}>
                Cancelar
              </CustomButton>
              <CustomButton
                pill
                onClick={() => metodoPago && setPaso('despacho')}
                disabled={!metodoPago}
              >
                Siguiente
              </CustomButton>
            </Box>
          </Box>
        )}

        {/* PASO 2: Selección de Despacho / Retiro */}
        {paso === 'despacho' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Opción 1: Retiro en tienda */}
            <Box
              sx={{
                border: '1.5px solid var(--color-borde)',
                borderRadius: '8px',
                p: 2,
                bgcolor: tipoEntrega === 'retiro' ? 'var(--color-input-bg)' : 'transparent',
              }}
            >
              <FormControlLabel
                value="retiro"
                control={
                  <Radio
                    checked={tipoEntrega === 'retiro'}
                    onChange={() => setTipoEntrega('retiro')}
                    sx={{ color: 'var(--color-texto-oscuro)', '&.Mui-checked': { color: 'var(--color-primario)' } }}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                    Retiro en tienda
                  </Typography>
                }
              />
              <Typography variant="body2" sx={{ ml: 4, color: 'var(--color-borde)' }}>
                ( Dirección de la Tienda Principal )
              </Typography>
            </Box>

            {/* Opción 2: Despacho a Domicilio */}
            <Box
              sx={{
                border: '1.5px solid var(--color-borde)',
                borderRadius: '8px',
                p: 2,
                bgcolor: tipoEntrega === 'despacho' ? 'var(--color-input-bg)' : 'transparent',
              }}
            >
              <FormControlLabel
                value="despacho"
                control={
                  <Radio
                    checked={tipoEntrega === 'despacho'}
                    onChange={() => setTipoEntrega('despacho')}
                    sx={{ color: 'var(--color-texto-oscuro)', '&.Mui-checked': { color: 'var(--color-primario)' } }}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                    Despacho
                  </Typography>
                }
              />
              <Typography variant="body2" sx={{ ml: 4, mb: 1.5, color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                Selecciona tu Dirección de Despacho:
              </Typography>

              {tipoEntrega === 'despacho' && (
                <Box sx={{ ml: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <RadioGroup
                    value={direccionSeleccionada}
                    onChange={(e) => setDireccionSeleccionada(e.target.value)}
                  >
                    {direccionesGuardadas.length === 0 ? (
                      <Typography variant="caption" sx={{ color: 'var(--color-borde)', mb: 1 }}>
                        No tienes direcciones guardadas
                      </Typography>
                    ) : (
                      direccionesGuardadas.map((dir, index) => (
                        <Box
                          key={index}
                          sx={{
                            border: '1px solid var(--color-borde)',
                            p: 0.8,
                            borderRadius: '4px',
                            mb: 0.5,
                            bgcolor: 'var(--color-fondo)',
                          }}
                        >
                          <FormControlLabel
                            value={`${dir.direccion} #${dir.numero}, ${dir.comuna}`}
                            control={<Radio size="small" sx={{ '&.Mui-checked': { color: 'var(--color-primario)' } }} />}
                            label={
                              <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontSize: '0.85rem' }}>
                                {dir.direccion} #{dir.numero}, {dir.comuna}
                              </Typography>
                            }
                          />
                        </Box>
                      ))
                    )}
                  </RadioGroup>

                  <Box
                    component="button"
                    type="button"
                    onClick={() => onAbrirNuevaDireccion && onAbrirNuevaDireccion()}
                    sx={{
                      background: 'none',
                      border: 'none',
                      p: 0,
                      color: 'var(--color-primario)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textDecoration: 'underline',
                      mt: 0.5,
                      '&:hover': { opacity: 0.8 },
                    }}
                  >
                    + Agregar o gestionar direcciones
                  </Box>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
              <CustomButton pill outlined onClick={() => setPaso('metodo')}>
                Atrás
              </CustomButton>
              <CustomButton
                pill
                onClick={() => setPaso('formulario')}
                disabled={tipoEntrega === 'despacho' && !direccionSeleccionada && direccionesGuardadas.length > 0}
              >
                Siguiente
              </CustomButton>
            </Box>
          </Box>
        )}

        {/* PASO 3: Formulario Débito / Crédito */}
        {paso === 'formulario' && metodoPago === 'debito-credito' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
                Nombre
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={tarjeta.nombre}
                onChange={(e) => setTarjeta({ ...tarjeta, nombre: e.target.value })}
                sx={inputStyle}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
                Número de tarjeta
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="1234 5678 9012 3456"
                value={tarjeta.numero}
                onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value })}
                sx={inputStyle}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
                Vencimiento
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="MM/AA"
                value={tarjeta.vencimiento}
                onChange={(e) => setTarjeta({ ...tarjeta, vencimiento: e.target.value })}
                sx={inputStyle}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
                Código de Seguridad
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="CVV"
                type="password"
                value={tarjeta.cvv}
                onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value })}
                sx={inputStyle}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
              <CustomButton pill outlined onClick={() => setPaso('despacho')}>
                Atrás
              </CustomButton>
              <CustomButton
                pill
                onClick={handleFinalizar}
                disabled={!tarjeta.nombre || !tarjeta.numero || !tarjeta.cvv}
              >
                Finalizar
              </CustomButton>
            </Box>
          </Box>
        )}

        {/* PASO 3: Formulario Transferencia */}
        {paso === 'formulario' && metodoPago === 'transferencia' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
                Nombre
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={transferencia.nombre}
                onChange={(e) => setTransferencia({ ...transferencia, nombre: e.target.value })}
                sx={inputStyle}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
                Código de Transferencia
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Ej: TRX-983210"
                value={transferencia.codigoTransferencia}
                onChange={(e) => setTransferencia({ ...transferencia, codigoTransferencia: e.target.value })}
                sx={inputStyle}
              />
            </Box>

            {/* Recuadro informativo con datos bancarios de Figma */}
            <Box
              sx={{
                border: '1.2px solid var(--color-borde)',
                borderRadius: '6px',
                p: 1.5,
                bgcolor: 'var(--color-input-bg)',
                mt: 1,
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-texto-oscuro)', mb: 0.8 }}>
                Datos de Transferencia:
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Nombre:</strong> MeyerExpress Spa
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Rut:</strong> 76.543.210-K
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Banco:</strong> Banco de Chile
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Número de Cuenta:</strong> 00-123-45678-90
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Tipo:</strong> Cuenta Corriente
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
              <CustomButton pill outlined onClick={() => setPaso('despacho')}>
                Atrás
              </CustomButton>
              <CustomButton
                pill
                onClick={handleFinalizar}
                disabled={!transferencia.nombre || !transferencia.codigoTransferencia}
              >
                Finalizar
              </CustomButton>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

const inputStyle = {
  mt: 0.3,
  '& .MuiOutlinedInput-root': {
    bgcolor: 'var(--color-input-bg)',
    borderRadius: '4px',
    height: 34,
    '& fieldset': { borderColor: 'var(--color-borde)' },
    '&:hover fieldset': { borderColor: 'var(--color-texto-oscuro)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-primario)' },
  },
  '& .MuiInputBase-input': {
    py: 0.6,
    px: 1.2,
    fontSize: '0.88rem',
    color: 'var(--color-texto-oscuro)',
  },
};