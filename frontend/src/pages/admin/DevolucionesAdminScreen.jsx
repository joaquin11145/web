import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

const devolucionesIniciales = [
  {
    id: 1,
    codigo: 'DEV-101',
    nombre: 'Devolución 1',
    cliente: 'Juan Pérez',
    emprendedor: 'Confecciones Silva SPA',
    motivo: 'Talla incorrecta',
    estado: 'Pendiente',
    tipo: 'Producto (Polera Deportiva)',
    metodoPago: 'Débito / Crédito',
    detallePago: 'Visa terminada en 3456',
    total: 24000,
    fecha: '2026-11-02',
  },
  {
    id: 2,
    codigo: 'DEV-102',
    nombre: 'Devolución 2',
    cliente: 'María López',
    emprendedor: 'Textiles del Sur Ltda.',
    motivo: 'Costura defectuosa',
    estado: 'Aprobada',
    tipo: 'Producto (Producto 2)',
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'TRX-983210',
    total: 7000,
    fecha: '2026-10-31',
  },
  {
    id: 3,
    codigo: 'DEV-103',
    nombre: 'Devolución 3',
    cliente: 'Carlos Rojas',
    emprendedor: 'Artesanías Andinas',
    motivo: 'No corresponde a la imagen',
    estado: 'Rechazada',
    tipo: 'Producto (Producto 3)',
    metodoPago: 'Débito / Crédito',
    detallePago: 'MasterCard terminada en 1209',
    total: 16000,
    fecha: '2026-10-29',
  },
  {
    id: 4,
    codigo: 'DEV-104',
    nombre: 'Devolución 4',
    cliente: 'Ana Morales',
    emprendedor: 'Confecciones Silva SPA',
    motivo: 'Demora excesiva en entrega',
    estado: 'Aprobada',
    tipo: 'Servicio (Confección)',
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'TRX-541209',
    total: 10000,
    fecha: '2026-10-27',
  },
  {
    id: 5,
    codigo: 'DEV-105',
    nombre: 'Devolución 5',
    cliente: 'Pedro Soto',
    emprendedor: 'Textiles del Sur Ltda.',
    motivo: 'Envase roto al llegar',
    estado: 'Pendiente',
    tipo: 'Producto (Manta)',
    metodoPago: 'Débito / Crédito',
    detallePago: 'Visa terminada en 8901',
    total: 12000,
    fecha: '2026-10-25',
  },
  {
    id: 6,
    codigo: 'DEV-106',
    nombre: 'Devolución 6',
    cliente: 'Camila Rojas',
    emprendedor: 'Artesanías Andinas',
    motivo: 'Color equivocado recibido',
    estado: 'Pendiente',
    tipo: 'Producto (Artesanía)',
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'TRX-112233',
    total: 18500,
    fecha: '2026-10-23',
  },
  {
    id: 7,
    codigo: 'DEV-107',
    nombre: 'Devolución 7',
    cliente: 'Diego Fuentes',
    emprendedor: 'Tienda Oficial',
    motivo: 'Producto llegó incompleto',
    estado: 'Rechazada',
    tipo: 'Producto (Calzado)',
    metodoPago: 'Débito / Crédito',
    detallePago: 'Visa terminada en 4411',
    total: 14000,
    fecha: '2026-10-20',
  },
];

const ITEMS_POR_PAGINA = 5;

export default function DevolucionesAdminScreen({ cartProps = {} }) {
  const navigate = useNavigate();

  const [devoluciones, setDevoluciones] = useState(devolucionesIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroEmprendedor, setFiltroEmprendedor] = useState('todos');
  const [paginaActual, setPaginaActual] = useState(1);
  const [devolucionActiva, setDevolucionActiva] = useState(devolucionesIniciales[0]);

  const listaEmprendedores = useMemo(() => {
    return ['todos', ...new Set(devoluciones.map((d) => d.emprendedor))];
  }, [devoluciones]);

  // Filtrado reactivo en memoria
  const devolucionesFiltradas = useMemo(() => {
    return devoluciones.filter((d) => {
      const matchBusqueda =
        d.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        d.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
        d.emprendedor.toLowerCase().includes(busqueda.toLowerCase()) ||
        d.motivo.toLowerCase().includes(busqueda.toLowerCase());

      const matchEstado = filtroEstado === 'todos' || d.estado === filtroEstado;
      const matchEmprendedor = filtroEmprendedor === 'todos' || d.emprendedor === filtroEmprendedor;

      return matchBusqueda && matchEstado && matchEmprendedor;
    });
  }, [devoluciones, busqueda, filtroEstado, filtroEmprendedor]);

  // Paginación en bloques
  const totalPaginas = Math.ceil(devolucionesFiltradas.length / ITEMS_POR_PAGINA) || 1;
  const devolucionesPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    return devolucionesFiltradas.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [devolucionesFiltradas, paginaActual]);

  const handleCambioPagina = (event, valor) => {
    setPaginaActual(valor);
    console.log('[BACKEND PENDIENTE] GET /api/admin/devoluciones', {
      page: valor,
      limit: ITEMS_POR_PAGINA,
      search: busqueda,
      estado: filtroEstado,
      emprendedor: filtroEmprendedor,
    });
  };

  const handleCambiarEstado = (nuevoEstado) => {
    if (!devolucionActiva) return;
    console.log(`[BACKEND PENDIENTE] PATCH /api/admin/devoluciones/${devolucionActiva.id}/estado`, {
      estado: nuevoEstado,
    });
    setDevoluciones((prev) =>
      prev.map((d) => (d.id === devolucionActiva.id ? { ...d, estado: nuevoEstado } : d))
    );
    setDevolucionActiva((prev) => ({ ...prev, estado: nuevoEstado }));
  };

  const formatCLP = (m) => Number(m || 0).toLocaleString('es-CL');

  const getColorEstado = (estado) => {
    switch (estado) {
      case 'Aprobada':
        return { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' };
      case 'Rechazada':
        return { bg: '#ffebee', color: '#c62828', border: '#ef9a9a' };
      default:
        return { bg: 'rgba(195, 85, 43, 0.12)', color: 'var(--color-primario)', border: 'var(--color-primario)' };
    }
  };

  return (
    <MainLayout {...cartProps}>
      <Box sx={{ maxWidth: 1060, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
        {/* Cabecera */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          sx={{
            textTransform: 'none',
            color: 'var(--color-texto-oscuro)',
            fontWeight: 600,
            fontSize: '0.95rem',
            mb: 2.5,
            borderRadius: '12px',
            px: 1.5,
            py: 0.6,
            '&:hover': {
              bgcolor: 'rgba(195, 85, 43, 0.08)',
              color: 'var(--color-primario)',
            },
          }}
        >
          Volver a Administrar
        </Button>

        {/* Tarjeta Contenedora Principal */}
        <Box
          sx={{
            border: '1.5px solid var(--color-texto-oscuro)',
            borderRadius: '24px',
            p: { xs: 2, md: 3 },
            bgcolor: 'var(--color-fondo)',
            boxShadow: '0 8px 24px rgba(44, 44, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          {/* Título y Métricas */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primario)' }}>
                Auditoría Global de Devoluciones
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontSize: '0.82rem' }}>
                Control centralizado de reclamos y reembolsos para todos los emprendedores
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={`Pendientes: ${devoluciones.filter((d) => d.estado === 'Pendiente').length}`}
                size="small"
                sx={{ bgcolor: 'rgba(195, 85, 43, 0.12)', color: 'var(--color-primario)', fontWeight: 700 }}
              />
              <Chip
                label={`Total: ${devoluciones.length}`}
                size="small"
                sx={{ bgcolor: 'var(--color-input-bg)', color: 'var(--color-texto-oscuro)', fontWeight: 700 }}
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'var(--color-borde)' }} />

          {/* BUSCADOR Y FILTROS RÁPIDOS */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' }, gap: 1.5 }}>
            <TextField
              size="small"
              placeholder="Buscar por código, cliente, motivo..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'var(--color-borde)' }} />
                  </InputAdornment>
                ),
              }}
              sx={filtroInputStyle}
            />

            <TextField
              select
              size="small"
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setPaginaActual(1);
              }}
              sx={filtroInputStyle}
            >
              <MenuItem value="todos">Todos los Estados</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Aprobada">Aprobada</MenuItem>
              <MenuItem value="Rechazada">Rechazada</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              value={filtroEmprendedor}
              onChange={(e) => {
                setFiltroEmprendedor(e.target.value);
                setPaginaActual(1);
              }}
              sx={filtroInputStyle}
            >
              {listaEmprendedores.map((emp) => (
                <MenuItem key={emp} value={emp}>
                  {emp === 'todos' ? 'Todos los Emprendedores' : emp}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* ESTRUCTURA SPLIT CON LISTADO PAGINADO + DETALLE */}
          <Box
            sx={{
              width: '100%',
              border: '1.2px solid var(--color-texto-oscuro)',
              borderRadius: '16px',
              bgcolor: 'var(--color-fondo)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              overflow: 'hidden',
              minHeight: 460,
            }}
          >
            {/* PANEL IZQUIERDO: LISTA PAGINADA */}
            <Box
              sx={{
                width: { xs: '100%', md: 320 },
                borderRight: { xs: 'none', md: '1.2px solid var(--color-borde)' },
                borderBottom: { xs: '1.2px solid var(--color-borde)', md: 'none' },
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                bgcolor: 'var(--color-input-bg)',
                flexShrink: 0,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-borde)', mb: 0.5, textTransform: 'uppercase' }}>
                  Listado ({devolucionesFiltradas.length})
                </Typography>

                {devolucionesPaginadas.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'var(--color-borde)', fontStyle: 'italic', textAlign: 'center', py: 4 }}>
                    Sin resultados
                  </Typography>
                ) : (
                  devolucionesPaginadas.map((d) => {
                    const sel = devolucionActiva?.id === d.id;
                    const estiloChip = getColorEstado(d.estado);

                    return (
                      <Box
                        key={d.id}
                        onClick={() => setDevolucionActiva(d)}
                        sx={{
                          p: 1.4,
                          bgcolor: sel ? 'var(--color-fondo)' : 'transparent',
                          border: '1.2px solid',
                          borderColor: sel ? 'var(--color-primario)' : 'var(--color-borde)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          boxShadow: sel ? '0 2px 8px rgba(44, 44, 42, 0.12)' : 'none',
                          transition: 'all 0.2s',
                          '&:hover': { bgcolor: 'var(--color-fondo)' },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-texto-oscuro)' }}>
                            {d.codigo} — {d.nombre}
                          </Typography>
                          <Chip
                            label={d.estado}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              bgcolor: estiloChip.bg,
                              color: estiloChip.color,
                              border: `1px solid ${estiloChip.border}`,
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontSize: '0.78rem' }}>
                          {d.emprendedor}
                        </Typography>
                      </Box>
                    );
                  })
                )}
              </Box>

              {/* Paginador dentro de la lista */}
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, borderTop: '1px solid var(--color-borde)', mt: 2 }}>
                <Pagination
                  size="small"
                  count={totalPaginas}
                  page={paginaActual}
                  onChange={handleCambioPagina}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '0.75rem',
                      '&.Mui-selected': {
                        bgcolor: 'var(--color-primario) !important',
                        color: 'var(--color-texto-claro)',
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* PANEL DERECHO: DETALLE DE LA DEVOLUCIÓN SELECCIONADA */}
            <Box sx={{ flex: 1, p: { xs: 2.5, sm: 3.5 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2 }}>
              {devolucionActiva ? (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-texto-oscuro)' }}>
                          Auditoría de {devolucionActiva.codigo}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontSize: '0.85rem' }}>
                          Ingresada el: <strong>{devolucionActiva.fecha}</strong> | Solicitante: <strong>{devolucionActiva.cliente}</strong>
                        </Typography>
                      </Box>

                      <Chip
                        label={devolucionActiva.estado}
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          px: 1,
                          ...getColorEstado(devolucionActiva.estado),
                        }}
                      />
                    </Box>

                    <Divider sx={{ borderColor: 'var(--color-borde)' }} />

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <Box sx={{ p: 1.8, bgcolor: 'var(--color-input-bg)', borderRadius: '12px', border: '1px solid var(--color-borde)' }}>
                        <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontWeight: 700 }}>
                          EMPRENDEDOR ASOCIADO
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-texto-oscuro)', mt: 0.3 }}>
                          {devolucionActiva.emprendedor}
                        </Typography>
                      </Box>

                      <Box sx={{ p: 1.8, bgcolor: 'var(--color-input-bg)', borderRadius: '12px', border: '1px solid var(--color-borde)' }}>
                        <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontWeight: 700 }}>
                          ÍTEM OBJETO DE DEVOLUCIÓN
                        </Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-texto-oscuro)', mt: 0.3 }}>
                          {devolucionActiva.tipo}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ p: 1.8, bgcolor: 'var(--color-input-bg)', borderRadius: '12px', border: '1px solid var(--color-borde)' }}>
                      <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontWeight: 700 }}>
                        MOTIVO DECLARADO POR EL CLIENTE
                      </Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)', mt: 0.4 }}>
                        "{devolucionActiva.motivo}"
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontWeight: 700 }}>
                          MÉTODO DE PAGO ORIGINAL
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>
                          {devolucionActiva.metodoPago}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--color-borde)' }}>
                          Ref: {devolucionActiva.detallePago}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { sm: 'flex-end' }, gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontWeight: 700 }}>
                          MONTO TOTAL A REEMBOLSAR
                        </Typography>
                        <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primario)' }}>
                          ${formatCLP(devolucionActiva.total)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* ACCIONES DE RESOLUCIÓN ADMINISTRATIVA */}
                  <Box sx={{ display: 'flex', gap: 1.5, pt: 2, borderTop: '1px solid var(--color-borde)', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<HighlightOffIcon />}
                      onClick={() => handleCambiarEstado('Rechazada')}
                      disabled={devolucionActiva.estado === 'Rechazada'}
                      sx={{
                        borderRadius: '16px',
                        borderColor: '#d32f2f',
                        color: '#d32f2f',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#ffebee', borderColor: '#c62828' },
                      }}
                    >
                      Rechazar Devolución
                    </Button>

                    <Button
                      variant="contained"
                      disableElevation
                      startIcon={<CheckCircleOutlineIcon />}
                      onClick={() => handleCambiarEstado('Aprobada')}
                      disabled={devolucionActiva.estado === 'Aprobada'}
                      sx={{
                        borderRadius: '16px',
                        bgcolor: 'var(--color-primario)',
                        color: 'var(--color-texto-claro)',
                        textTransform: 'none',
                        fontWeight: 600,
                        border: '1.2px solid var(--color-texto-oscuro)',
                        '&:hover': { bgcolor: 'var(--color-primario-hover, var(--color-primario))' },
                      }}
                    >
                      Aprobar y Liberar Reembolso
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography sx={{ color: 'var(--color-borde)', textAlign: 'center', py: 8 }}>
                  Selecciona una devolución para ver su auditoría
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}

const filtroInputStyle = {
  bgcolor: 'var(--color-blanco, #fff)',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    height: 38,
    '& fieldset': { borderColor: 'var(--color-borde)', borderWidth: '1.2px' },
    '&:hover fieldset': { borderColor: 'var(--color-texto-oscuro)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-primario)' },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.88rem',
    color: 'var(--color-texto-oscuro)',
  },
};