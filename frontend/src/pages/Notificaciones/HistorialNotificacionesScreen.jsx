import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import MainLayout from '../../components/templates/MainLayout/MainLayout';

const alertasData = [
  // Comprador
  { id: 1, rol: 'comprador', tipo: 'pedido', titulo: 'Pedido #1042 en camino', mensaje: 'El transporte asignado ha recogido tu paquete desde la tienda oficial y se encuentra en ruta a Viña del Mar.', fecha: 'Hoy, 10:45 AM', leida: false },
  { id: 2, rol: 'comprador', tipo: 'cotizacion', titulo: 'Cotización validada', mensaje: 'Tu cotización #COT-891 ha sido aprobada con un 5% de descuento por volumen.', fecha: 'Hoy, 09:15 AM', leida: false },
  { id: 3, rol: 'comprador', tipo: 'sistema', titulo: 'Seguridad de la cuenta', mensaje: 'Se inició sesión correctamente en tu cuenta desde un dispositivo nuevo.', fecha: 'Ayer, 18:30 PM', leida: true },

  // Emprendedor
  { id: 101, rol: 'emprendedor', tipo: 'pedido', titulo: 'Nueva Venta Recibida', mensaje: 'El cliente Camila Rojas ha efectuado la compra de 2 unidades de Polera Roja (S). Prepara el paquete para retiro.', fecha: 'Hoy, 11:20 AM', leida: false },
  { id: 102, rol: 'emprendedor', tipo: 'devolucion', titulo: 'Solicitud de Devolución', mensaje: 'El cliente Andrés Morales abrió una solicitud de devolución por falla en el producto #983.', fecha: 'Hoy, 08:50 AM', leida: false },
  { id: 103, rol: 'emprendedor', tipo: 'stock', titulo: 'Aviso de Stock Bajo', mensaje: 'Tu producto "Producto 2 (Talla 36)" ha alcanzado las últimas 2 unidades en bodega.', fecha: 'Ayer, 16:00 PM', leida: true },

  // Admin
  { id: 201, rol: 'admin', tipo: 'usuario', titulo: 'Empresa Pendiente de Aprobación', mensaje: 'Calzados Chile SpA ha subido su documentación para registrarse como vendedor oficial.', fecha: 'Hoy, 10:00 AM', leida: false },
  { id: 202, rol: 'admin', tipo: 'transporte', titulo: 'Alerta de Logística', mensaje: 'La zona Valparaíso Costa reporta demoras de 24 horas por congestión troncal.', fecha: 'Ayer, 14:15 PM', leida: false },
];

export default function HistorialNotificacionesScreen({ cartProps = {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  const esAdmin = location.pathname.startsWith('/admin');
  const esEmprendedor = location.pathname.startsWith('/emprendedor');
  const rolActual = esAdmin ? 'admin' : esEmprendedor ? 'emprendedor' : 'comprador';

  const [tabFiltro, setTabFiltro] = useState('todas');
  const [lista, setLista] = useState(alertasData.filter((a) => a.rol === rolActual));

  const handleMarcarLeida = (id) => {
    console.log('[BACKEND PENDIENTE] PATCH /api/notificaciones/' + id + '/leer');
    setLista((prev) => prev.map((a) => (a.id === id ? { ...a, leida: true } : a)));
  };

  const handleEliminar = (id) => {
    console.log('[BACKEND PENDIENTE] DELETE /api/notificaciones/' + id);
    setLista((prev) => prev.filter((a) => a.id !== id));
  };

  const handleMarcarTodasLeidas = () => {
    console.log('[BACKEND PENDIENTE] PATCH /api/notificaciones/marcar-todas-leidas', { rol: rolActual });
    setLista((prev) => prev.map((a) => ({ ...a, leida: true })));
  };

  const alertasFiltradas = lista.filter((a) => {
    if (tabFiltro === 'no_leidas') return !a.leida;
    return true;
  });

  return (
    <MainLayout {...cartProps}>
      <Box
        sx={{
          maxWidth: 860,
          mx: 'auto',
          bgcolor: 'var(--color-fondo)',
          border: '1.5px solid var(--color-texto-oscuro)',
          borderRadius: '24px',
          p: { xs: 2.5, md: 3.5 },
          boxShadow: '0 8px 24px rgba(44, 44, 42, 0.12)',
        }}
      >
        {/* Cabecera */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: 'var(--color-primario)' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primario)' }}>
              Centro de Notificaciones y Alertas
            </Typography>
          </Box>
          {lista.some((a) => !a.leida) && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleMarcarTodasLeidas}
              sx={{
                borderRadius: '16px',
                borderColor: 'var(--color-primario)',
                color: 'var(--color-primario)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                '&:hover': { bgcolor: 'rgba(195, 85, 43, 0.08)', borderColor: 'var(--color-primario)' },
              }}
            >
              Marcar todo como leído
            </Button>
          )}
        </Box>

        {/* Pestañas de filtrado */}
        <Tabs
          value={tabFiltro}
          onChange={(e, val) => setTabFiltro(val)}
          sx={{
            mb: 2,
            '& .MuiTabs-indicator': { bgcolor: 'var(--color-primario)', height: 3 },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--color-texto-oscuro)',
              '&.Mui-selected': { color: 'var(--color-primario)', fontWeight: 800 },
            },
          }}
        >
          <Tab value="todas" label={`Todas (${lista.length})`} />
          <Tab value="no_leidas" label={`No leídas (${lista.filter((a) => !a.leida).length})`} />
        </Tabs>

        <Divider sx={{ borderColor: 'var(--color-borde)', mb: 2.5 }} />

        {/* Lista de Notificaciones */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {alertasFiltradas.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: 'var(--color-borde)', py: 6, fontStyle: 'italic' }}>
              No hay alertas en esta categoría.
            </Typography>
          ) : (
            alertasFiltradas.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 2,
                  borderRadius: '14px',
                  border: '1.2px solid',
                  borderColor: item.leida ? 'var(--color-borde)' : 'var(--color-primario)',
                  bgcolor: item.leida ? 'var(--color-input-bg)' : 'rgba(195, 85, 43, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 2,
                  transition: 'all 0.2s',
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    {!item.leida && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--color-primario)' }} />
                    )}
                    <Typography sx={{ fontWeight: item.leida ? 600 : 800, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                      {item.titulo}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--color-borde)', ml: 'auto' }}>
                      {item.fecha}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', lineHeight: 1.4, fontSize: '0.88rem' }}>
                    {item.mensaje}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {!item.leida && (
                    <IconButton
                      size="small"
                      title="Marcar como leída"
                      onClick={() => handleMarcarLeida(item.id)}
                      sx={{ color: 'var(--color-primario)' }}
                    >
                      <CheckCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    title="Eliminar"
                    onClick={() => handleEliminar(item.id)}
                    sx={{ color: 'var(--color-texto-oscuro)', '&:hover': { color: '#d32f2f' } }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </MainLayout>
  );
}