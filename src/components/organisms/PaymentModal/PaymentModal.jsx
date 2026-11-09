import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CustomButton from '../../atoms/Button/CustomButton';

const TIEMPO_PAGO_SEGUNDOS = 15 * 60; // 15 minutos

export default function PaymentModal({
  open,
  onClose,
  total = 0,
  cartItems = [],
  direccionesGuardadas = [],
  zonasTransporte = [],
  onAbrirNuevaDireccion,
  onPagoCompletado,
}) {
  const [metodoPago, setMetodoPago] = useState('');
  const [paso, setPaso] = useState('metodo');
  const [tipoEntrega, setTipoEntrega] = useState('retiro');
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('');

  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_PAGO_SEGUNDOS);
  const [tiempoExpirado, setTiempoExpirado] = useState(false);

  const [tarjeta, setTarjeta] = useState({
    nombre: '',
    numero: '',
    vencimiento: '',
    cvv: '',
  });

  const [transferencia, setTransferencia] = useState({
    nombre: '',
    codigoTransferencia: '',
  });

  const [errorAlerta, setErrorAlerta] = useState('');

  useEffect(() => {
    if (!open) {
      setTiempoRestante(TIEMPO_PAGO_SEGUNDOS);
      setTiempoExpirado(false);
      return;
    }

    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTiempoExpirado(true);
          console.warn('[PAGO EXPIRADO] Se vencieron los 15 minutos de reserva de compra');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  if (!open) return null;

  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  const tiempoFormateado = `${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;

  const vendedorNombre = cartItems.length > 0 && cartItems[0].vendedor ? cartItems[0].vendedor : 'Tienda Oficial';
  const direccionVendedor = 'Av. Providencia 1240, Taller 4, Santiago';
  const comunaOrigen = 'Santiago';
  const regionOrigen = 'Metropolitana de Santiago';

  const listaDirecciones = direccionesGuardadas.length > 0
    ? direccionesGuardadas
    : [
        { id: 1, direccion: 'Av. Libertad', numero: '750', comuna: 'Viña del Mar', region: 'Valparaíso' },
        { id: 2, direccion: 'Av. Providencia', numero: '1240', comuna: 'Santiago', region: 'Metropolitana de Santiago' },
      ];

  const formatCLP = (m) => Number(m || 0).toLocaleString('es-CL');
  const pesoEstimado = cartItems.reduce((acc, item) => acc + (Number(item.cantidad) || 1) * 0.8, 0);

  const calcularLogistica = () => {
    if (tipoEntrega === 'retiro') {
      return {
        costo: 0,
        mensaje: 'Retiro presencial gratuito en la tienda del vendedor',
        tiempo: 'Inmediato (en horario de tienda)',
      };
    }

    const dirComprador = listaDirecciones.find(
      (d) => `${d.direccion} #${d.numero}, ${d.comuna}` === direccionSeleccionada
    ) || listaDirecciones[0];

    const comunaDestino = dirComprador ? dirComprador.comuna : 'Santiago';
    const regionDestino = dirComprador ? dirComprador.region : 'Metropolitana de Santiago';

    const zonaDirecta = zonasTransporte.find(
      (z) => z.habilitada && z.comunas.includes(comunaDestino) && z.comunas.includes(comunaOrigen)
    );

    if (zonaDirecta) {
      const extraPeso = Math.max(0, pesoEstimado - zonaDirecta.kilosIncluidos) * zonaDirecta.costoKiloExtra;
      const flete = zonaDirecta.tarifaBase + extraPeso;
      return {
        costo: flete,
        mensaje: `Despacho directo por ${zonaDirecta.nombre}`,
        tiempo: zonaDirecta.tiempoEntrega,
      };
    }

    const esMismaRegion = regionOrigen === regionDestino;
    const zonaOrigen = zonasTransporte.find((z) => z.habilitada && z.comunas.includes(comunaOrigen));
    const baseLocal = zonaOrigen ? zonaOrigen.tarifaBase : 2900;
    const baseTroncal = esMismaRegion ? 2000 : 3800;
    return {
      costo: baseLocal + baseTroncal,
      mensaje: esMismaRegion
        ? `Traspaso regional: ${comunaOrigen} a ${comunaDestino}`
        : `Traspaso nacional: ${regionOrigen} a ${regionDestino}`,
      tiempo: esMismaRegion ? '24 - 48 horas' : '48 - 72 horas',
    };
  };

  const logistica = calcularLogistica();
  const totalConDespacho = total + logistica.costo;

  const handleReset = () => {
    setPaso('metodo');
    setMetodoPago('');
    setTipoEntrega('retiro');
    setDireccionSeleccionada('');
    setTarjeta({ nombre: '', numero: '', vencimiento: '', cvv: '' });
    setTransferencia({ nombre: '', codigoTransferencia: '' });
    setErrorAlerta('');
    if (onClose) onClose();
  };

  const handleFinalizar = () => {
    if (tiempoExpirado) {
      setErrorAlerta('El tiempo límite para pagar ha expirado. Por favor reinicie el proceso.');
      return;
    }

    if (metodoPago === 'debito-credito') {
      if (!tarjeta.nombre.trim() || !tarjeta.numero.trim() || !tarjeta.vencimiento.trim() || !tarjeta.cvv.trim()) {
        setErrorAlerta('Complete todos los datos de su tarjeta.');
        return;
      }
    } else {
      if (!transferencia.nombre.trim() || !transferencia.codigoTransferencia.trim()) {
        setErrorAlerta('Ingrese su nombre y el código de comprobante.');
        return;
      }
    }

    const orden = {
      ordenId: `ORD-${Date.now()}`,
      fecha: new Date().toISOString(),
      metodoPago,
      tipoEntrega,
      direccion: tipoEntrega === 'despacho' ? direccionSeleccionada : `Retiro en tienda (${direccionVendedor})`,
      datosPago: metodoPago === 'transferencia' ? transferencia : { ...tarjeta, cvv: '***' },
      items: cartItems,
      subtotal: total,
      costoEnvio: logistica.costo,
      total: totalConDespacho,
    };

    console.log('[BACKEND PENDIENTE] POST /api/ordenes/checkout', orden);

    if (onPagoCompletado) onPagoCompletado(orden);
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
          maxWidth: 520,
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
        {/* Cabecera con temporizador */}
        <Box
          sx={{
            mb: 2,
            p: 1.2,
            bgcolor: 'var(--color-primario)',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
          }}
        >
          <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-texto-claro)' }}>
            {paso === 'metodo' && 'Seleccione Método de Pago'}
            {paso === 'despacho' && 'Despacho y Entrega'}
            {paso === 'detalle_despacho' && 'Detalle del Despacho y Envío'}
            {paso === 'formulario' && (metodoPago === 'debito-credito' ? 'Débito / Crédito' : 'Transferencia Bancaria')}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(0,0,0,0.2)', px: 1, py: 0.3, borderRadius: '12px' }}>
            <AccessTimeIcon sx={{ color: 'var(--color-texto-claro)', fontSize: 16 }} />
            <Typography sx={{ color: 'var(--color-texto-claro)', fontSize: '0.82rem', fontWeight: 700 }}>
              {tiempoFormateado}
            </Typography>
          </Box>
        </Box>

        {tiempoExpirado && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: '6px' }}>
            Tiempo de reserva agotado. Los productos y precios pueden variar. Por favor reinicie la compra.
          </Alert>
        )}

        <Collapse in={Boolean(errorAlerta)}>
          <Alert severity="error" sx={{ mb: 2, borderRadius: '6px', py: 0.2, fontSize: '0.82rem' }}>
            {errorAlerta}
          </Alert>
        </Collapse>

        {/* PASO 1: Método de Pago */}
        {paso === 'metodo' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 1 }}>
            <Box sx={{ border: '1.2px solid var(--color-borde)', borderRadius: '6px', bgcolor: 'var(--color-input-bg)', overflow: 'hidden' }}>
              <Box sx={{ p: 1.2, bgcolor: 'var(--color-fondo)', borderBottom: '1px solid var(--color-borde)', display: 'flex', justifyContent: 'space-between' }}>
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
                  justifyContent: 'space-between',
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
                  justifyContent: 'space-between',
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
                disabled={!metodoPago || tiempoExpirado}
              >
                Siguiente
              </CustomButton>
            </Box>
          </Box>
        )}

        {/* PASO 2: Despacho */}
        {paso === 'despacho' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ border: '1.5px solid var(--color-borde)', borderRadius: '8px', p: 2, bgcolor: tipoEntrega === 'retiro' ? 'var(--color-input-bg)' : 'transparent' }}>
              <FormControlLabel
                value="retiro"
                control={
                  <Radio
                    checked={tipoEntrega === 'retiro'}
                    onChange={() => setTipoEntrega('retiro')}
                    sx={{ color: 'var(--color-texto-oscuro)', '&.Mui-checked': { color: 'var(--color-primario)' } }}
                  />
                }
                label={<Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>Retiro en tienda (Gratis)</Typography>}
              />
              <Typography variant="body2" sx={{ ml: 4, color: 'var(--color-borde)', fontSize: '0.85rem' }}>
                ( {direccionVendedor} )
              </Typography>
            </Box>

            <Box sx={{ border: '1.5px solid var(--color-borde)', borderRadius: '8px', p: 2, bgcolor: tipoEntrega === 'despacho' ? 'var(--color-input-bg)' : 'transparent' }}>
              <FormControlLabel
                value="despacho"
                control={
                  <Radio
                    checked={tipoEntrega === 'despacho'}
                    onChange={() => {
                      setTipoEntrega('despacho');
                      if (!direccionSeleccionada && listaDirecciones.length > 0) {
                        setDireccionSeleccionada(`${listaDirecciones[0].direccion} #${listaDirecciones[0].numero}, ${listaDirecciones[0].comuna}`);
                      }
                    }}
                    sx={{ color: 'var(--color-texto-oscuro)', '&.Mui-checked': { color: 'var(--color-primario)' } }}
                  />
                }
                label={<Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>Despacho a Domicilio</Typography>}
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
                    {listaDirecciones.map((dir, index) => {
                      const strDir = `${dir.direccion} #${dir.numero}, ${dir.comuna}`;
                      return (
                        <Box key={index} sx={{ border: '1px solid var(--color-borde)', p: 0.8, borderRadius: '4px', mb: 0.5, bgcolor: 'var(--color-fondo)' }}>
                          <FormControlLabel
                            value={strDir}
                            control={<Radio size="small" sx={{ '&.Mui-checked': { color: 'var(--color-primario)' } }} />}
                            label={
                              <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontSize: '0.85rem' }}>
                                <strong>Dirección {index + 1}:</strong> {strDir}
                              </Typography>
                            }
                          />
                        </Box>
                      );
                    })}
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
                onClick={() => setPaso('detalle_despacho')}
                disabled={tipoEntrega === 'despacho' && !direccionSeleccionada && listaDirecciones.length > 0}
              >
                Siguiente
              </CustomButton>
            </Box>
          </Box>
        )}

        {/* PASO 3: Detalle de Despacho */}
        {paso === 'detalle_despacho' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'var(--color-input-bg)', border: '1.2px solid var(--color-borde)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Origen (Tienda del Vendedor):
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
                  {vendedorNombre} — {direccionVendedor} ({comunaOrigen})
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Destino de Entrega:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
                  {tipoEntrega === 'retiro' ? `Retiro en Tienda (${direccionVendedor})` : direccionSeleccionada}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'var(--color-borde)' }} />

              <Box>
                <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Modalidad y Ruta de Transporte:
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', mt: 0.3 }}>
                  • {logistica.mensaje}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--color-borde)', display: 'block', mt: 0.2 }}>
                  Plazo estimado: <strong>{logistica.tiempo}</strong>
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'var(--color-borde)' }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)' }}>Subtotal Productos:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${formatCLP(total)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primario)' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Costo de Envío / Despacho:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {logistica.costo === 0 ? 'Gratis ($0)' : `$${formatCLP(logistica.costo)}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid var(--color-borde)' }}>
                  <Typography sx={{ fontWeight: 800, color: 'var(--color-texto-oscuro)', fontSize: '1rem' }}>
                    Total Consolidado a Pagar:
                  </Typography>
                  <Typography sx={{ fontWeight: 800, color: 'var(--color-primario)', fontSize: '1.05rem' }}>
                    ${formatCLP(totalConDespacho)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
              <CustomButton pill outlined onClick={() => setPaso('despacho')}>
                Atrás
              </CustomButton>
              <CustomButton pill onClick={() => setPaso('formulario')} disabled={tiempoExpirado}>
                Continuar al Pago
              </CustomButton>
            </Box>
          </Box>
        )}

        {/* PASO 4A: Débito / Crédito */}
        {paso === 'formulario' && metodoPago === 'debito-credito' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ p: 1, bgcolor: 'var(--color-input-bg)', borderRadius: '6px', mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Monto a Cobrar:</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--color-primario)' }}>${formatCLP(totalConDespacho)}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>Nombre</Typography>
              <TextField
                fullWidth
                size="small"
                value={tarjeta.nombre}
                onChange={(e) => setTarjeta({ ...tarjeta, nombre: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') })}
                sx={inputStyle}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>Número de tarjeta</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="1234 5678 9012 3456"
                value={tarjeta.numero}
                onChange={(e) => {
                  const soloNum = e.target.value.replace(/\D/g, '').slice(0, 16);
                  setTarjeta({ ...tarjeta, numero: soloNum.replace(/(\d{4})(?=\d)/g, '$1 ') });
                }}
                inputProps={{ maxLength: 19 }}
                sx={inputStyle}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>Vencimiento</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="MM/AA"
                value={tarjeta.vencimiento}
                onChange={(e) => {
                  const soloNum = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (soloNum.length <= 2) setTarjeta({ ...tarjeta, vencimiento: soloNum });
                  else setTarjeta({ ...tarjeta, vencimiento: `${soloNum.slice(0, 2)}/${soloNum.slice(2)}` });
                }}
                inputProps={{ maxLength: 5 }}
                sx={inputStyle}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>Código de Seguridad</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="CVV"
                type="password"
                value={tarjeta.cvv}
                onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                inputProps={{ maxLength: 4 }}
                sx={inputStyle}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
              <CustomButton pill outlined onClick={() => setPaso('detalle_despacho')}>
                Atrás
              </CustomButton>
              <CustomButton
                pill
                onClick={handleFinalizar}
                disabled={!tarjeta.nombre || !tarjeta.numero || !tarjeta.cvv || tiempoExpirado}
              >
                Finalizar
              </CustomButton>
            </Box>
          </Box>
        )}

        {/* PASO 4B: Transferencia */}
        {paso === 'formulario' && metodoPago === 'transferencia' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ p: 1, bgcolor: 'var(--color-input-bg)', borderRadius: '6px', mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Total a Transferir:</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--color-primario)' }}>${formatCLP(totalConDespacho)}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>Nombre</Typography>
              <TextField
                fullWidth
                size="small"
                value={transferencia.nombre}
                onChange={(e) => setTransferencia({ ...transferencia, nombre: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') })}
                sx={inputStyle}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>Código de Transferencia</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Ej: 983210"
                value={transferencia.codigoTransferencia}
                onChange={(e) => setTransferencia({ ...transferencia, codigoTransferencia: e.target.value.replace(/\D/g, '') })}
                sx={inputStyle}
              />
            </Box>

            <Box sx={{ border: '1.2px solid var(--color-borde)', borderRadius: '6px', p: 1.5, bgcolor: 'var(--color-input-bg)', mt: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-texto-oscuro)', mb: 0.8 }}>
                Datos de Transferencia:
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'var(--color-texto-oscuro)' }}>
                <strong>Nombre:</strong> MeyerExpress SpA
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
              <CustomButton pill outlined onClick={() => setPaso('detalle_despacho')}>
                Atrás
              </CustomButton>
              <CustomButton
                pill
                onClick={handleFinalizar}
                disabled={!transferencia.nombre || !transferencia.codigoTransferencia || tiempoExpirado}
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