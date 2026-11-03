import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AddIcon from '@mui/icons-material/Add';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import { getComunasDeRegion, todasLasRegiones } from '../../data/chileData';

// Grandes empresas de transporte que SOLO realizan traslado interregional (Terminal a Terminal)
const empresasTroncalesChile = [
  { id: 'starken', nombre: 'Starken', red: 'Troncal Interregional Terminal-a-Terminal' },
  { id: 'chilexpress', nombre: 'Chilexpress', red: 'Troncal Aéreo/Terrestre Terminal-a-Terminal' },
  { id: 'blue', nombre: 'Blue Express', red: 'Troncal Hub Nacional' },
  { id: 'varmontt', nombre: 'Varmontt', red: 'Troncal Carga Pesada Sur/Norte' },
];

export default function TransporteScreen({ zonas = [], onToggleHabilitar, cartProps = {} }) {
  const navigate = useNavigate();

  // Origen (Vendedor)
  const [regionOrigen, setRegionOrigen] = useState('Metropolitana de Santiago');
  const [comunaOrigen, setComunaOrigen] = useState('Santiago');
  const [direccionVendedor, setDireccionVendedor] = useState('Av. Providencia 1240, Bodega 4');
  const [tipoDespachoOrigen, setTipoDespachoOrigen] = useState('retiro_domicilio'); // 'retiro_domicilio' o 'vendedor_lleva'

  // Destino (Comprador)
  const [regionDestino, setRegionDestino] = useState('Valparaíso');
  const [comunaDestino, setComunaDestino] = useState('Viña del Mar');
  const [direccionComprador, setDireccionComprador] = useState('Calle Libertad 750, Casa B');
  const [preferenciaDestino, setPreferenciaDestino] = useState('domicilio'); // 'domicilio' o 'retiro_terminal'

  // Empresa troncal interregional seleccionada
  const [empresaTroncal, setEmpresaTroncal] = useState('starken');

  // Peso del paquete
  const [pesoSimulado, setPesoSimulado] = useState(2.5);

  const formatCLP = (m) => Number(m || 0).toLocaleString('es-CL');

  // Motor logístico con la regla de negocio:
  // - Empresas del sistema hacen retiro y entrega a domicilio
  // - Grandes empresas hacen exclusivamente el traslado interregional de terminal a terminal
  // - Si no hay empresa del sistema en destino, el cliente retira en el terminal del transporte
  const evaluarLogistica = () => {
    const operadorTroncal = empresasTroncalesChile.find((e) => e.id === empresaTroncal) || empresasTroncalesChile[0];

    // Verificar empresas del sistema en ORIGEN y DESTINO
    const empresaSistemaOrigen = zonas.find((z) => z.habilitada && z.comunas.includes(comunaOrigen));
    const empresaSistemaDestino = zonas.find((z) => z.habilitada && z.comunas.includes(comunaDestino));

    // ¿Misma empresa del sistema cubre ambas comunas de forma directa?
    const esRutaDirectaLocal = Boolean(
      empresaSistemaOrigen &&
      empresaSistemaOrigen.comunas.includes(comunaDestino)
    );

    // Costo de retiro en bodega del vendedor (solo por empresa del sistema)
    const costoRetiroVendedor = (tipoDespachoOrigen === 'retiro_domicilio' && empresaSistemaOrigen) ? 1500 : 0;

    // =========================================================================
    // CASO 1: Envío Local Directo (Una empresa del sistema cubre origen y destino)
    // =========================================================================
    if (esRutaDirectaLocal) {
      const extraPeso = Math.max(0, pesoSimulado - empresaSistemaOrigen.kilosIncluidos) * empresaSistemaOrigen.costoKiloExtra;
      const tarifaFlete = empresaSistemaOrigen.tarifaBase + extraPeso;
      const quiereRetiroTienda = preferenciaDestino === 'retiro_terminal';
      const descuentoRetiroTienda = quiereRetiroTienda ? 1000 : 0;
      const total = Math.max(1000, tarifaFlete + costoRetiroVendedor - descuentoRetiroTienda);

      return {
        tipo: 'directo_local',
        mensaje: `Despacho Local Directo: Gestionado 100% por ${empresaSistemaOrigen.nombre}`,
        costoRetiroVendedor,
        costoTramo1: tarifaFlete - descuentoRetiroTienda,
        costoTroncal: 0,
        costoTramoFinal: 0,
        total,
        tiempo: empresaSistemaOrigen.tiempoEntrega,
        empresaOrigen: empresaSistemaOrigen.nombre,
        empresaTroncal: null,
        empresaDestino: empresaSistemaOrigen.nombre,
        hayEmpresaEnDestino: true,
        modalidadFinal: quiereRetiroTienda ? 'retiro_tienda' : 'domicilio',
        puntoEntrega: quiereRetiroTienda
          ? `Punto de Retiro / Sucursal de ${empresaSistemaOrigen.nombre} en ${comunaDestino}`
          : `Puerta del comprador: ${direccionComprador}, ${comunaDestino}`,
      };
    }

    // =========================================================================
    // CASO 2: Envío con Traslado Interregional (Grandes empresas entre terminales)
    // =========================================================================
    const tarifaBaseOrigen = empresaSistemaOrigen ? empresaSistemaOrigen.tarifaBase : 2500;

    // Las grandes empresas cobran solo el flete de terminal a terminal según la distancia
    const esMismaRegion = regionOrigen === regionDestino;
    const baseTrasladoTroncal = esMismaRegion ? 2000 : 3900;
    const extraPesoTroncal = Math.max(0, pesoSimulado - 2) * 650;
    const costoTroncal = baseTrasladoTroncal + extraPesoTroncal;

    // En destino: ¿Hay empresa del sistema para hacer el reparto a domicilio?
    const hayRepartoDomicilioDestino = Boolean(empresaSistemaDestino) && preferenciaDestino === 'domicilio';
    const costoRepartoDomicilioDestino = hayRepartoDomicilioDestino
      ? empresaSistemaDestino.tarifaBase
      : 0; // Si no hay o prefiere retirar en terminal, el costo de última milla es $0

    const total = costoRetiroVendedor + tarifaBaseOrigen + costoTroncal + costoRepartoDomicilioDestino;

    return {
      tipo: 'interregional_traslado',
      mensaje: !empresaSistemaDestino
        ? `Sin empresa local en ${comunaDestino}: Traslado por ${operadorTroncal.nombre} y retiro obligatorio en sucursal`
        : hayRepartoDomicilioDestino
        ? `Traslado Interregional: ${operadorTroncal.nombre} traslada entre regiones y ${empresaSistemaDestino.nombre} entrega a domicilio`
        : `Traslado Interregional por ${operadorTroncal.nombre} y retiro del comprador en sucursal/terminal`,
      costoRetiroVendedor,
      costoTramo1: tarifaBaseOrigen,
      costoTroncal,
      costoTramoFinal: costoRepartoDomicilioDestino,
      total,
      tiempo: esMismaRegion ? '24 - 48 horas' : '48 - 72 horas',
      empresaOrigen: empresaSistemaOrigen ? empresaSistemaOrigen.nombre : 'Transporte Local Origen',
      empresaTroncal: operadorTroncal.nombre,
      empresaDestino: empresaSistemaDestino ? empresaSistemaDestino.nombre : null,
      hayEmpresaEnDestino: Boolean(empresaSistemaDestino),
      modalidadFinal: hayRepartoDomicilioDestino ? 'domicilio' : 'retiro_terminal',
      puntoEntrega: hayRepartoDomicilioDestino
        ? `Despacho a domicilio por ${empresaSistemaDestino.nombre} en ${direccionComprador}`
        : `Retiro presencial en Terminal / Sucursal ${operadorTroncal.nombre} (${comunaDestino})`,
    };
  };

  const resultado = evaluarLogistica();

  return (
    <MainLayout {...cartProps}>
      <Box sx={{ maxWidth: 880, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
        
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          sx={{ textTransform: 'none', color: 'var(--color-texto-oscuro)', mb: 2 }}
        >
          Volver a Administrar
        </Button>

        {/* Cabecera */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShippingOutlinedIcon sx={{ color: 'var(--color-texto-oscuro)', fontSize: 26 }} />
            <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-texto-oscuro)' }}>
              Costos de Envío
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/transporte/agregar')}
            sx={{
              borderRadius: '18px',
              borderColor: 'var(--color-borde)',
              color: 'var(--color-texto-oscuro)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              px: 2,
              py: 0.4,
              bgcolor: 'var(--color-fondo)',
              '&:hover': {
                borderColor: 'var(--color-primario)',
                color: 'var(--color-primario)',
              },
            }}
          >
            Agregar Zona
          </Button>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: 'var(--color-texto-oscuro)',
            fontWeight: 700,
            fontSize: '0.82rem',
            px: 0.5,
            display: 'block',
            mb: 2,
          }}
        >
          Zonas y Empresas de Transporte del Sistema (Únicas con Despacho a Domicilio)
        </Typography>

        {/* Lista de Empresas del Sistema */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, mb: 4 }}>
          {zonas.map((zona) => (
            <Box
              key={zona.id}
              sx={{
                bgcolor: 'var(--color-fondo)',
                border: '1.5px solid var(--color-texto-oscuro)',
                borderRadius: '24px',
                p: { xs: 2, sm: '18px 24px' },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                gap: 2,
                boxShadow: '0 4px 12px rgba(44, 44, 42, 0.08)',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-texto-oscuro)' }}>
                    {zona.nombre}
                  </Typography>
                  <Chip
                    label={zona.habilitada ? 'Habilitado' : 'Deshabilitado'}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      bgcolor: zona.habilitada ? 'rgba(46, 125, 50, 0.12)' : 'rgba(211, 47, 47, 0.12)',
                      color: zona.habilitada ? '#2e7d32' : '#d32f2f',
                      border: '1px solid',
                      borderColor: zona.habilitada ? '#2e7d32' : '#d32f2f',
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: '0.85rem', color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                  <strong>Base:</strong> {zona.ciudad} ({zona.region})
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: 'var(--color-borde)' }}>
                  Cobertura domicilio ({zona.comunas.length} comunas): {zona.comunas.slice(0, 4).join(', ')}{zona.comunas.length > 4 ? '...' : ''} | Entrega: {zona.tiempoEntrega}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  flexWrap: 'wrap',
                  width: { xs: '100%', md: 'auto' },
                  justifyContent: { xs: 'space-between', md: 'flex-end' },
                }}
              >
                <Box sx={{ textAlign: 'center', minWidth: 70 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-texto-oscuro)' }}>
                    ${formatCLP(zona.tarifaBase)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--color-borde)', display: 'block' }}>
                    tarifa base
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => navigate(`/admin/transporte/editar/${zona.id}`)}
                  sx={botonEditarStyle}
                >
                  Editar
                </Button>

                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => onToggleHabilitar && onToggleHabilitar(zona.id)}
                  sx={{
                    ...botonHabilitarStyle,
                    bgcolor: zona.habilitada ? 'var(--color-primario)' : 'var(--color-input-bg)',
                    color: zona.habilitada ? 'var(--color-texto-claro)' : 'var(--color-texto-oscuro)',
                  }}
                >
                  Habilitar o desactivar
                </Button>
              </Box>
            </Box>
          ))}
        </Box>

        {/* ================= SIMULADOR CON LA REGLA DE TRASPASO Y COBERTURA ================= */}
        <Box
          sx={{
            border: '1.5px solid var(--color-texto-oscuro)',
            borderRadius: '20px',
            bgcolor: 'var(--color-fondo)',
            p: { xs: 2.5, sm: 3.5 },
            boxShadow: '0 8px 24px rgba(44, 44, 42, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <SyncAltIcon sx={{ color: 'var(--color-primario)' }} />
            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-texto-oscuro)' }}>
              Simulador de Logística: Traslado Interregional y Última Milla
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'var(--color-borde)', mb: 2.5, fontSize: '0.85rem' }}>
            Las grandes empresas solo realizan el traslado interregional de terminal a terminal. El despacho a domicilio solo es posible si existe una empresa local del sistema en la comuna de destino; de lo contrario, el cliente retira en el terminal.
          </Typography>

          {/* Gran empresa para el traslado interregional */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'var(--color-input-bg)', borderRadius: '12px', border: '1px solid var(--color-borde)' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--color-texto-oscuro)', display: 'block', mb: 0.8 }}>
              Empresa de Transporte para el Traslado Interregional (Terminal a Terminal)
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={empresaTroncal}
              onChange={(e) => setEmpresaTroncal(e.target.value)}
              sx={simInputStyle}
            >
              {empresasTroncalesChile.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.nombre} — ({emp.red})
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5, mb: 2.5 }}>
            {/* ORIGEN (Vendedor) */}
            <Box sx={{ p: 2, border: '1.2px solid var(--color-borde)', borderRadius: '12px', bgcolor: 'var(--color-input-bg)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2 }}>
                <StorefrontIcon sx={{ color: 'var(--color-primario)', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--color-texto-oscuro)' }}>
                  1. Origen: Retiro en Vendedor
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Región del Vendedor"
                  value={regionOrigen}
                  onChange={(e) => {
                    const reg = e.target.value;
                    setRegionOrigen(reg);
                    setComunaOrigen(getComunasDeRegion(reg)[0] || '');
                  }}
                  sx={simInputStyle}
                >
                  {todasLasRegiones.map((r) => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Comuna del Vendedor"
                  value={comunaOrigen}
                  onChange={(e) => setComunaOrigen(e.target.value)}
                  sx={simInputStyle}
                >
                  {getComunasDeRegion(regionOrigen).map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  size="small"
                  label="Dirección del Taller / Bodega"
                  value={direccionVendedor}
                  onChange={(e) => setDireccionVendedor(e.target.value)}
                  sx={simInputStyle}
                />

                <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)', mt: 0.5 }}>
                  Modalidad en Origen:
                </Typography>
                <RadioGroup
                  row
                  value={tipoDespachoOrigen}
                  onChange={(e) => setTipoDespachoOrigen(e.target.value)}
                >
                  <FormControlLabel
                    value="retiro_domicilio"
                    control={<Radio size="small" sx={{ color: 'var(--color-primario)', '&.Mui-checked': { color: 'var(--color-primario)' } }} />}
                    label={<Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)' }}>Empresa local retira en bodega</Typography>}
                  />
                  <FormControlLabel
                    value="vendedor_lleva"
                    control={<Radio size="small" sx={{ color: 'var(--color-primario)', '&.Mui-checked': { color: 'var(--color-primario)' } }} />}
                    label={<Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)' }}>Vendedor entrega en terminal</Typography>}
                  />
                </RadioGroup>
              </Box>
            </Box>

            {/* DESTINO (Comprador) */}
            <Box sx={{ p: 2, border: '1.2px solid var(--color-borde)', borderRadius: '12px', bgcolor: 'var(--color-input-bg)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2 }}>
                <HomeIcon sx={{ color: '#2e7d32', fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--color-texto-oscuro)' }}>
                  2. Destino: Recepción del Comprador
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Región del Comprador"
                  value={regionDestino}
                  onChange={(e) => {
                    const reg = e.target.value;
                    setRegionDestino(reg);
                    setComunaDestino(getComunasDeRegion(reg)[0] || '');
                  }}
                  sx={simInputStyle}
                >
                  {todasLasRegiones.map((r) => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Comuna del Comprador"
                  value={comunaDestino}
                  onChange={(e) => setComunaDestino(e.target.value)}
                  sx={simInputStyle}
                >
                  {getComunasDeRegion(regionDestino).map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  size="small"
                  label="Dirección del Comprador"
                  value={direccionComprador}
                  onChange={(e) => setDireccionComprador(e.target.value)}
                  disabled={!resultado.hayEmpresaEnDestino || preferenciaDestino === 'retiro_terminal'}
                  sx={simInputStyle}
                />

                <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)', mt: 0.5 }}>
                  Modalidad de Entrega al Cliente:
                </Typography>
                <RadioGroup
                  row
                  value={resultado.modalidadFinal === 'domicilio' ? 'domicilio' : 'retiro_terminal'}
                  onChange={(e) => setPreferenciaDestino(e.target.value)}
                >
                  <FormControlLabel
                    value="domicilio"
                    disabled={!resultado.hayEmpresaEnDestino}
                    control={<Radio size="small" sx={{ color: 'var(--color-primario)', '&.Mui-checked': { color: 'var(--color-primario)' } }} />}
                    label={
                      <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)' }}>
                        Despacho a Domicilio {resultado.hayEmpresaEnDestino ? `(por ${resultado.empresaDestino})` : '(No disponible)'}
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="retiro_terminal"
                    control={<Radio size="small" sx={{ color: 'var(--color-primario)', '&.Mui-checked': { color: 'var(--color-primario)' } }} />}
                    label={<Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)' }}>Retiro en Terminal / Sucursal</Typography>}
                  />
                </RadioGroup>
              </Box>
            </Box>
          </Box>

          {/* Peso del paquete */}
          <Box sx={{ maxWidth: 260, mb: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)', mb: 0.5, display: 'block' }}>
              Peso Estimado del Paquete (kg)
            </Typography>
            <TextField
              type="number"
              fullWidth
              size="small"
              value={pesoSimulado}
              onChange={(e) => setPesoSimulado(Math.max(0.1, Number(e.target.value)))}
              inputProps={{ min: 0.1, step: 0.5 }}
              sx={simInputStyle}
            />
          </Box>

          {/* Alerta explicativa si en destino no hay empresa creada en el sistema */}
          {!resultado.hayEmpresaEnDestino && resultado.tipo !== 'directo_local' && (
            <Alert severity="info" sx={{ mb: 2, borderRadius: '8px', fontSize: '0.85rem' }}>
              <strong>Sin empresa local en {comunaDestino}:</strong> Como en esta comuna no existe una empresa de transporte creada en el sistema, no es posible despachar a domicilio. El paquete será trasladado por <strong>{resultado.empresaTroncal}</strong> y el cliente deberá <strong>retirarlo en el terminal / sucursal</strong> de dicha empresa.
            </Alert>
          )}

          {/* Hoja de Ruta Consolidada */}
          <Box
            sx={{
              p: 2.2,
              borderRadius: '12px',
              bgcolor: 'var(--color-fondo)',
              border: '1.5px solid var(--color-texto-oscuro)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
              <CheckCircleIcon sx={{ color: resultado.modalidadFinal === 'domicilio' ? '#2e7d32' : 'var(--color-primario)' }} />
              <Typography sx={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--color-texto-oscuro)' }}>
                {resultado.mensaje}
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: 'var(--color-borde)', display: 'block', mb: 1.5 }}>
              <strong>Destino final del envío:</strong> {resultado.puntoEntrega}
            </Typography>

            <Divider sx={{ my: 1, borderColor: 'var(--color-borde)' }} />

            {/* Desglose Económico de Tramos */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: '0.88rem', color: 'var(--color-texto-oscuro)' }}>
              {/* Retiro en bodega */}
              {resultado.costoRetiroVendedor > 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>• Retiro a domicilio en bodega ({comunaOrigen}): {resultado.empresaOrigen}</span>
                  <strong>${formatCLP(resultado.costoRetiroVendedor)}</strong>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#2e7d32' }}>
                  <span>• Origen: Vendedor entrega directo en terminal</span>
                  <strong>$0 (Sin costo de retiro)</strong>
                </Box>
              )}

              {/* Tramo 1 Local (Primera milla al hub/terminal) */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Tramo 1 Local ({comunaOrigen}): Empresa del sistema ({resultado.empresaOrigen})</span>
                <strong>${formatCLP(resultado.costoTramo1)}</strong>
              </Box>

              {/* Tramo Troncal Interregional (Solo si va a otra zona) */}
              {resultado.costoTroncal > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primario)' }}>
                  <span>• Tramo Interregional (Terminal {regionOrigen} ➔ Terminal {regionDestino}): {resultado.empresaTroncal}</span>
                  <strong>${formatCLP(resultado.costoTroncal)}</strong>
                </Box>
              )}

              {/* Tramo Final: Entrega a Domicilio por empresa del sistema en destino */}
              {resultado.modalidadFinal === 'domicilio' && resultado.costoTramoFinal > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#2e7d32' }}>
                  <span>• Despacho a Domicilio final en {comunaDestino}: Empresa del sistema ({resultado.empresaDestino})</span>
                  <strong>${formatCLP(resultado.costoTramoFinal)}</strong>
                </Box>
              )}

              {/* Tramo Final: Retiro en Terminal */}
              {resultado.modalidadFinal === 'retiro_tienda' && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-borde)' }}>
                  <span>• Entrega final: Retiro presencial del comprador en sucursal / terminal</span>
                  <strong>$0 (Sin costo de última milla)</strong>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.2, mt: 0.5, borderTop: '1.5px dashed var(--color-borde)' }}>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-borde)' }}>
                    Plazo estimado: <strong>{resultado.tiempo}</strong>
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-texto-oscuro)' }}>
                    Modalidad: <strong>{resultado.modalidadFinal === 'domicilio' ? 'Entrega en la puerta del comprador' : 'Retiro en agencia/terminal'}</strong>
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: 'var(--color-borde)', display: 'block' }}>
                    Total a Cobrar
                  </Typography>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primario)' }}>
                    ${formatCLP(resultado.total)}
                  </span>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

      </Box>
    </MainLayout>
  );
}

const botonEditarStyle = {
  width: 90,
  height: 34,
  borderRadius: '18px',
  bgcolor: 'var(--color-primario)',
  color: 'var(--color-texto-claro)',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.88rem',
  border: '1.2px solid var(--color-texto-oscuro)',
  boxShadow: '0 2px 4px rgba(44, 44, 42, 0.25)',
  '&:hover': { bgcolor: 'var(--color-primario-hover, var(--color-primario))' },
};

const botonHabilitarStyle = {
  height: 34,
  borderRadius: '18px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.82rem',
  px: 1.8,
  border: '1.2px solid var(--color-texto-oscuro)',
  boxShadow: '0 2px 4px rgba(44, 44, 42, 0.25)',
  '&:hover': { opacity: 0.9 },
};

const simInputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: 'var(--color-fondo)',
    '& fieldset': { borderColor: 'var(--color-borde)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-primario)' },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.88rem',
    color: 'var(--color-texto-oscuro)',
    py: 0.8,
  },
};