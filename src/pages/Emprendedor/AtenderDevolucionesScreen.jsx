import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

const devolucionesIniciales = [
  {
    id: 1,
    cliente: 'Camila Rojas',
    pedidoId: '2567',
    producto: 'Polera',
    fechaSolicitud: '24 de Octubre',
    estado: 'Pendiente',
    motivo: 'Talla incorrecta',
    comentarioCliente: 'La talla M me quedó muy pequeña, solicito el cambio o la devolución del dinero.',
    montoReembolso: 7000,
  },
  {
    id: 2,
    cliente: 'Andrés Morales',
    pedidoId: '2550',
    producto: 'Producto 2',
    fechaSolicitud: '22 de Octubre',
    estado: 'Pendiente',
    motivo: 'Falla de fábrica',
    comentarioCliente: 'Llegó con una costura rota en el borde inferior.',
    montoReembolso: 12000,
  },
  {
    id: 3,
    cliente: 'Beatriz Fuentes',
    pedidoId: '2512',
    producto: 'Producto 3',
    fechaSolicitud: '19 de Octubre',
    estado: 'Aprobada',
    motivo: 'No cumple expectativas',
    comentarioCliente: 'El color real difiere del mostrado en la foto.',
    montoReembolso: 16000,
  },
];

export default function AtenderDevolucionesScreen({ cartProps = {} }) {
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));

  const [devoluciones, setDevoluciones] = useState(devolucionesIniciales);
  const [devolucionActiva, setDevolucionActiva] = useState(devolucionesIniciales[0]);
  const [mensajeRespuesta, setMensajeRespuesta] = useState('');
  const [vistaMovil, setVistaMovil] = useState('lista');

  const handleSeleccionarDevolucion = (item) => {
    setDevolucionActiva(item);
    setMensajeRespuesta('');
    if (esMovil) {
      setVistaMovil('detalle');
    }
  };

  const handleAprobar = () => {
    const actualizadas = devoluciones.map((d) =>
      d.id === devolucionActiva.id ? { ...d, estado: 'Aprobada' } : d
    );
    setDevoluciones(actualizadas);
    setDevolucionActiva((prev) => ({ ...prev, estado: 'Aprobada' }));
    setMensajeRespuesta('');
  };

  const handleRechazar = () => {
    const actualizadas = devoluciones.map((d) =>
      d.id === devolucionActiva.id ? { ...d, estado: 'Rechazada' } : d
    );
    setDevoluciones(actualizadas);
    setDevolucionActiva((prev) => ({ ...prev, estado: 'Rechazada' }));
    setMensajeRespuesta('');
  };

  const formatCLP = (monto) => Number(monto || 0).toLocaleString('es-CL');

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
        {/* Columna Izquierda: Clientes / Lista de Devoluciones */}
        <Box
          sx={{
            width: { xs: '100%', md: 260 },
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
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--color-texto-oscuro)',
              mb: 1,
            }}
          >
            Clientes
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
            {devoluciones.map((d) => {
              const seleccionada = devolucionActiva.id === d.id;
              return (
                <Box
                  key={d.id}
                  onClick={() => handleSeleccionarDevolucion(d)}
                  sx={{
                    bgcolor: seleccionada ? 'rgba(195, 85, 43, 0.18)' : 'var(--color-input-bg)',
                    border: '1px solid',
                    borderColor: seleccionada ? 'var(--color-primario)' : 'var(--color-borde)',
                    borderRadius: '4px',
                    p: 1.6,
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: seleccionada ? 'rgba(195, 85, 43, 0.18)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: seleccionada ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                      lineHeight: 1.2,
                    }}
                  >
                    {d.cliente}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.82rem',
                      color: 'var(--color-texto-oscuro)',
                      mt: 0.3,
                    }}
                  >
                    {d.producto}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color:
                        d.estado === 'Aprobada'
                          ? '#2e7d32'
                          : d.estado === 'Rechazada'
                          ? '#d32f2f'
                          : 'var(--color-primario)',
                      mt: 0.3,
                    }}
                  >
                    Estado: {d.estado}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Columna Derecha: Detalle de Devolución */}
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
          {esMovil && (
            <IconButton
              size="small"
              onClick={() => setVistaMovil('lista')}
              sx={{ color: 'var(--color-primario)', width: 'fit-content', mb: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          {/* Encabezado */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'var(--color-texto-oscuro)',
              lineHeight: 1.2,
            }}
          >
            Devolucion-{devolucionActiva.cliente}
          </Typography>

          <Typography
            sx={{
              fontSize: '0.88rem',
              color: 'var(--color-borde)',
              mt: 0.4,
              mb: 2,
            }}
          >
            Pedido #{devolucionActiva.pedidoId} - {devolucionActiva.producto} - Solicitado {devolucionActiva.fechaSolicitud}
          </Typography>

          {/* Imagen Foto */}
          <Box
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'var(--color-input-bg)',
              border: '1px solid var(--color-borde)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              color: 'var(--color-texto-oscuro)',
              mb: 2.5,
            }}
          >
            foto
          </Box>

          {/* Cuadro de Motivo y Comentario del Cliente */}
          <Box
            sx={{
              width: '100%',
              border: '1.2px solid var(--color-texto-oscuro)',
              borderRadius: '2px',
              bgcolor: 'var(--color-fondo)',
              p: 1.5,
              minHeight: 85,
              mb: 2.5,
              boxSizing: 'border-box',
            }}
          >
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
              Motivo: {devolucionActiva.motivo}
            </Typography>
            <Typography sx={{ fontSize: '0.84rem', color: 'var(--color-texto-oscuro)', mt: 0.5, fontStyle: 'italic' }}>
              "{devolucionActiva.comentarioCliente}"
            </Typography>
          </Box>

          {/* Enviar mensaje al cliente */}
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-texto-oscuro)', mb: 0.8 }}>
            Enviar mensaje al cliente
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Escriba acá ..."
            value={mensajeRespuesta}
            onChange={(e) => setMensajeRespuesta(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '2px',
                bgcolor: 'var(--color-fondo)',
                '& fieldset': { borderColor: 'var(--color-texto-oscuro)' },
                '&:hover fieldset': { borderColor: 'var(--color-texto-oscuro)' },
                '&.Mui-focused fieldset': { borderColor: 'var(--color-primario)' },
              },
              '& .MuiInputBase-input': {
                color: 'var(--color-texto-oscuro)',
                fontSize: '0.88rem',
                py: 1,
              },
            }}
          />

          <Box sx={{ width: '100%', height: '1px', bgcolor: 'var(--color-borde)', mb: 2 }} />

          {/* Monto a reembolsar */}
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-texto-oscuro)', mb: 2.5 }}>
            Monto a reembolsar: {formatCLP(devolucionActiva.montoReembolso)}
          </Typography>

          {/* Botones Rechazar y Aprobar de Figma */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              disableElevation
              onClick={handleRechazar}
              disabled={devolucionActiva.estado !== 'Pendiente'}
              sx={{
                width: 170,
                height: 38,
                borderRadius: '20px',
                bgcolor: 'var(--color-input-bg)',
                color: 'var(--color-texto-oscuro)',
                border: '1px solid var(--color-texto-oscuro)',
                boxShadow: '0 2px 4px rgba(44, 44, 42, 0.25)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.08)',
                },
                '&.Mui-disabled': {
                  bgcolor: 'var(--color-input-bg)',
                  opacity: 0.6,
                },
              }}
            >
              Rechazar
            </Button>

            <Button
              variant="contained"
              disableElevation
              onClick={handleAprobar}
              disabled={devolucionActiva.estado !== 'Pendiente'}
              sx={{
                width: 170,
                height: 38,
                borderRadius: '20px',
                bgcolor: 'var(--color-primario)',
                color: 'var(--color-texto-claro)',
                border: '1px solid var(--color-texto-oscuro)',
                boxShadow: '0 2px 4px rgba(44, 44, 42, 0.25)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                '&:hover': {
                  bgcolor: 'var(--color-primario-hover, var(--color-primario))',
                },
                '&.Mui-disabled': {
                  bgcolor: 'var(--color-borde)',
                  color: 'var(--color-texto-claro)',
                },
              }}
            >
              {devolucionActiva.estado === 'Aprobada' ? 'Aprobada ✓' : 'Aprobar'}
            </Button>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}