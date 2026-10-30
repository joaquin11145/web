import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

const emprendedoresData = [
  {
    id: 1,
    nombre: 'Confecciones Silva SPA',
    rut: '76.432.109-8',
    direcciones: 'Av. Providencia 1240, Of. 402, Santiago',
    datosPersonales: 'Contacto: María Silva / Fono: +56 9 8765 4321 / Email: contacto@confecciones.cl',
  },
  {
    id: 2,
    nombre: 'Textiles del Sur Ltda.',
    rut: '77.890.321-K',
    direcciones: 'Calle Prat 560, Concepción',
    datosPersonales: 'Contacto: Rodrigo Soto / Fono: +56 9 7654 3210 / Email: r.soto@textilesdelsur.cl',
  },
  {
    id: 3,
    nombre: 'Artesanías Andinas',
    rut: '15.678.901-2',
    direcciones: 'Pasaje Los Alerces 89, Temuco',
    datosPersonales: 'Contacto: Carmen Gloria / Fono: +56 9 6543 2109 / Email: carmen@artesanias.cl',
  },
];

const devolucionesData = [
  {
    id: 1,
    nombre: 'Devolución 1',
    emprendedor: 'Confecciones Silva SPA',
    motivo: 'Talla incorrecta',
    estado: 'Pendiente',
    tipo: 'Producto (Polera Deportiva)',
    metodoPago: 'Débito / Crédito',
    detallePago: 'Visa terminada en 3456',
    total: 24000,
  },
  {
    id: 2,
    nombre: 'Devolución 2',
    emprendedor: 'Textiles del Sur Ltda.',
    motivo: 'Costura defectuosa',
    estado: 'Aprobada',
    tipo: 'Producto (Producto 2)',
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'TRX-983210',
    total: 7000,
  },
  {
    id: 3,
    nombre: 'Devolución 3',
    emprendedor: 'Artesanías Andinas',
    motivo: 'No corresponde a la imagen',
    estado: 'Rechazada',
    tipo: 'Producto (Producto 3)',
    metodoPago: 'Débito / Crédito',
    detallePago: 'MasterCard terminada en 1209',
    total: 16000,
  },
  {
    id: 4,
    nombre: 'Devolución 4',
    emprendedor: 'Confecciones Silva SPA',
    motivo: 'Demora excesiva en entrega',
    estado: 'Aprobada',
    tipo: 'Servicio (Confección)',
    metodoPago: 'Transferencia Bancaria',
    detallePago: 'TRX-541209',
    total: 10000,
  },
];

const comentariosData = [
  { id: 1, usuario: 'Juan Pérez', texto: 'Muy buena confección y entrega a tiempo.', tipo: 'producto', rating: 5 },
  { id: 2, usuario: 'María López', texto: 'La tela es suave pero demoró dos días más del compromiso.', tipo: 'producto', rating: 4 },
  { id: 3, usuario: 'Carlos Rojas', texto: 'Excelente atención y resolución rápida de dudas.', tipo: 'vendedor', rating: 5 },
  { id: 4, usuario: 'Ana Morales', texto: 'Comprobante y despacho correctos.', tipo: 'vendedor', rating: 4 },
];

export default function AdminDashboard({ onLogoutAdmin, cartProps = {} }) {
  const navigate = useNavigate();

  const [vista, setVista] = useState('menu');
  const [devolucionActiva, setDevolucionActiva] = useState(devolucionesData[0]);
  const [tabComentario, setTabComentario] = useState('producto');
  const [formTransporte, setFormTransporte] = useState({
    nombre: '',
    cobertura: '',
    tamanoMax: '',
    pesoMax: '',
    vehiculos: '',
  });

  const handleCrearTransporte = (e) => {
    e.preventDefault();
    alert(`Transporte "${formTransporte.nombre || 'Nuevo Transporte'}" registrado exitosamente.`);
    setFormTransporte({
      nombre: '',
      cobertura: '',
      tamanoMax: '',
      pesoMax: '',
      vehiculos: '',
    });
    setVista('menu');
  };

  const formatCLP = (m) => Number(m || 0).toLocaleString('es-CL');

  return (
    <MainLayout {...cartProps}>
      <Box sx={{ maxWidth: 960, mx: 'auto', p: { xs: 1, sm: 2 }, pb: 5 }}>
        
        {/* Barra superior de control del Administrador */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primario)' }}>
            PANEL ADMINISTRADOR (SESIÓN ACTIVA)
          </Typography>
          <Button
            size="small"
            startIcon={<LogoutIcon />}
            onClick={onLogoutAdmin}
            sx={{
              color: 'var(--color-texto-oscuro)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.82rem',
              '&:hover': { color: 'var(--color-primario)' },
            }}
          >
            Cerrar Sesión Admin
          </Button>
        </Box>

        {/* ================= VISTA 1: MENÚ PRINCIPAL ================= */}
        {vista === 'menu' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <Typography
              sx={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: 'var(--color-texto-oscuro)',
                mb: 4,
              }}
            >
              Administrar
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3,
                width: '100%',
                maxWidth: 620,
              }}
            >
              <Button
                variant="contained"
                onClick={() => setVista('emprendedores')}
                sx={menuBotonStyle}
              >
                Emprendedores
              </Button>

              <Button
                variant="contained"
                onClick={() => setVista('transporte')}
                sx={menuBotonStyle}
              >
                Transporte
              </Button>

              <Button
                variant="contained"
                onClick={() => setVista('comentarios')}
                sx={menuBotonStyle}
              >
                Comentarios de Usuarios
              </Button>

              <Button
                variant="contained"
                onClick={() => setVista('devoluciones')}
                sx={menuBotonStyle}
              >
                Devoluciones
              </Button>
            </Box>
          </Box>
        )}

        {/* ================= VISTA 2: EMPRENDEDORES ================= */}
        {vista === 'emprendedores' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setVista('menu')}
              sx={botonAtrasPillStyle}
            >
              Atras
            </Button>

            <Box
              sx={{
                border: '1.5px solid var(--color-borde)',
                borderRadius: '16px',
                p: { xs: 2, sm: 3 },
                bgcolor: 'var(--color-fondo)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
              }}
            >
              {emprendedoresData.map((emp) => (
                <Box
                  key={emp.id}
                  sx={{
                    border: '1.5px solid var(--color-borde)',
                    borderRadius: '12px',
                    p: 2.5,
                    bgcolor: 'var(--color-input-bg)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                    <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                      <strong>Nombre:</strong> {emp.nombre} ({emp.rut})
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: 'var(--color-texto-oscuro)' }}>
                      <strong>Direcciones:</strong> {emp.direcciones}
                    </Typography>
                    <Typography sx={{ fontSize: '0.88rem', color: 'var(--color-texto-oscuro)' }}>
                      <strong>Datos Personales:</strong> {emp.datosPersonales}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => navigate('/mensajes')}
                    sx={{
                      minWidth: 120,
                      height: 36,
                      borderRadius: '20px',
                      bgcolor: 'var(--color-primario)',
                      color: 'var(--color-texto-claro)',
                      textTransform: 'none',
                      fontWeight: 600,
                      alignSelf: { xs: 'flex-end', sm: 'center' },
                      '&:hover': { bgcolor: 'var(--color-primario-hover, var(--color-primario))' },
                    }}
                  >
                    Mensaje
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* ================= VISTA 3: COMENTARIOS ================= */}
        {vista === 'comentarios' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setVista('menu')}
              sx={{ textTransform: 'none', color: 'var(--color-texto-oscuro)', alignSelf: 'flex-start' }}
            >
              Volver a Administrar
            </Button>

            <Box
              sx={{
                border: '1.5px solid var(--color-borde)',
                borderRadius: '16px',
                p: { xs: 2, sm: 3 },
                bgcolor: 'var(--color-fondo)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  border: '1px solid var(--color-borde)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  bgcolor: 'var(--color-fondo)',
                }}
              >
                <Box
                  onClick={() => setTabComentario('vendedor')}
                  sx={{
                    flex: 1,
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    bgcolor: tabComentario === 'vendedor' ? 'rgba(195, 85, 43, 0.12)' : 'transparent',
                    borderRight: { xs: 'none', md: '1px solid var(--color-borde)' },
                    borderBottom: { xs: '1px solid var(--color-borde)', md: 'none' },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                    Vendedor: (Nombre del Vendedor)
                  </Typography>
                  <Rating value={4.5} precision={0.5} readOnly sx={{ color: 'var(--color-primario)' }} />
                </Box>

                <Box
                  onClick={() => setTabComentario('producto')}
                  sx={{
                    flex: 1,
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    bgcolor: tabComentario === 'producto' ? 'rgba(195, 85, 43, 0.12)' : 'transparent',
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                    Nombre: (Producto/Servicio)
                  </Typography>
                  <Rating value={4.2} precision={0.5} readOnly sx={{ color: 'var(--color-primario)' }} />
                </Box>
              </Box>

              <Box
                sx={{
                  border: '1.2px solid var(--color-borde)',
                  borderRadius: '12px',
                  p: 2.5,
                  bgcolor: 'var(--color-fondo)',
                }}
              >
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-texto-oscuro)', mb: 2 }}>
                  {tabComentario === 'producto'
                    ? 'Comentarios del (Producto/Servicio):'
                    : 'Comentarios del Vendedor:'}
                </Typography>

                <Box
                  sx={{
                    width: '100%',
                    minHeight: 220,
                    maxHeight: 350,
                    overflowY: 'auto',
                    border: '1px solid var(--color-borde)',
                    borderRadius: '6px',
                    p: 2,
                    bgcolor: 'var(--color-input-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    boxSizing: 'border-box',
                  }}
                >
                  {comentariosData
                    .filter((c) => c.tipo === tabComentario)
                    .map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          p: 1.5,
                          bgcolor: 'var(--color-fondo)',
                          borderRadius: '8px',
                          border: '1px solid var(--color-borde)',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primario)' }}>
                            {item.usuario}
                          </Typography>
                          <Rating value={item.rating} size="small" readOnly sx={{ color: 'var(--color-primario)' }} />
                        </Box>
                        <Typography sx={{ fontSize: '0.88rem', color: 'var(--color-texto-oscuro)' }}>
                          {item.texto}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* ================= VISTA 4: VER DEVOLUCIONES ================= */}
        {vista === 'devoluciones' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setVista('menu')}
              sx={{ textTransform: 'none', color: 'var(--color-texto-oscuro)', alignSelf: 'flex-start' }}
            >
              Volver a Administrar
            </Button>

            <Box
              sx={{
                width: '100%',
                border: '1.5px solid var(--color-borde)',
                borderRadius: '12px',
                bgcolor: 'var(--color-fondo)',
                display: 'flex',
                overflow: 'hidden',
                minHeight: 460,
                boxShadow: '0 8px 24px rgba(44, 44, 42, 0.08)',
              }}
            >
              <Box
                sx={{
                  width: { xs: 150, sm: 220 },
                  borderRight: '1.5px solid var(--color-borde)',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.2,
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-texto-oscuro)', mb: 0.5 }}>
                  Devoluciones
                </Typography>
                {devolucionesData.map((d) => {
                  const sel = devolucionActiva.id === d.id;
                  return (
                    <Box
                      key={d.id}
                      onClick={() => setDevolucionActiva(d)}
                      sx={{
                        p: 1.4,
                        bgcolor: sel ? 'rgba(195, 85, 43, 0.18)' : 'var(--color-input-bg)',
                        border: '1px solid',
                        borderColor: sel ? 'var(--color-primario)' : 'var(--color-borde)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: sel ? 700 : 500,
                        color: sel ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                        '&:hover': { bgcolor: 'rgba(195, 85, 43, 0.12)' },
                      }}
                    >
                      {d.nombre}
                    </Box>
                  );
                })}
              </Box>

              <Box sx={{ flex: 1, p: { xs: 2.5, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: 'var(--color-texto-oscuro)' }}>
                  Devolución
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                  <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                    <strong>Emprendedor:</strong> {devolucionActiva.emprendedor}
                  </Typography>

                  <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                    <strong>Motivo:</strong> {devolucionActiva.motivo}
                  </Typography>

                  <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                    <strong>Estado:</strong> {devolucionActiva.estado}
                  </Typography>

                  <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                    <strong>Tipo:</strong> {devolucionActiva.tipo}
                  </Typography>

                  <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                    <strong>Método de pago:</strong> {devolucionActiva.metodoPago}
                  </Typography>

                  <Typography sx={{ fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                    <strong>Detalle del Pago:</strong> {devolucionActiva.detallePago}
                  </Typography>

                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primario)', mt: 1 }}>
                    Total: ${formatCLP(devolucionActiva.total)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* ================= VISTA 5: CREAR TRANSPORTE ================= */}
        {vista === 'transporte' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 680, mx: 'auto' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setVista('menu')}
              sx={{ textTransform: 'none', color: 'var(--color-texto-oscuro)', alignSelf: 'flex-start' }}
            >
              Volver a Administrar
            </Button>

            <Box
              component="form"
              onSubmit={handleCrearTransporte}
              sx={{
                border: '1.5px solid var(--color-borde)',
                borderRadius: '16px',
                p: { xs: 2.5, sm: 4 },
                bgcolor: 'var(--color-fondo)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box>
                <Typography sx={labelFormStyle}>Nombre:</Typography>
                <TextField
                  fullWidth
                  size="small"
                  required
                  value={formTransporte.nombre}
                  onChange={(e) => setFormTransporte({ ...formTransporte, nombre: e.target.value })}
                  sx={inputWireframeStyle}
                />
              </Box>

              <Box>
                <Typography sx={labelFormStyle}>Área de cobertura:</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ej: Región Metropolitana, Valparaíso..."
                  required
                  value={formTransporte.cobertura}
                  onChange={(e) => setFormTransporte({ ...formTransporte, cobertura: e.target.value })}
                  sx={inputWireframeStyle}
                />
              </Box>

              <Box>
                <Typography sx={labelFormStyle}>Tamaño Máximo de la Carga:</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ej: 120 x 80 x 100 cm"
                  value={formTransporte.tamanoMax}
                  onChange={(e) => setFormTransporte({ ...formTransporte, tamanoMax: e.target.value })}
                  sx={inputWireframeStyle}
                />
              </Box>

              <Box>
                <Typography sx={labelFormStyle}>Peso Máximo de la Carga:</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ej: 500 kg"
                  value={formTransporte.pesoMax}
                  onChange={(e) => setFormTransporte({ ...formTransporte, pesoMax: e.target.value })}
                  sx={inputWireframeStyle}
                />
              </Box>

              <Box>
                <Typography sx={labelFormStyle}>Cantidad de vehículos disponibles:</Typography>
                <TextField
                  fullWidth
                  type="number"
                  size="small"
                  placeholder="Ej: 8"
                  value={formTransporte.vehiculos}
                  onChange={(e) => setFormTransporte({ ...formTransporte, vehiculos: e.target.value })}
                  sx={inputWireframeStyle}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mt: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={botonAccionFormStyle}
                >
                  Crear Transporte
                </Button>

                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  onClick={() => setVista('menu')}
                  sx={{
                    ...botonAccionFormStyle,
                    bgcolor: 'var(--color-primario)',
                    opacity: 0.9,
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Box>
        )}

      </Box>
    </MainLayout>
  );
}

const menuBotonStyle = {
  height: 58,
  borderRadius: '16px',
  bgcolor: 'var(--color-primario)',
  color: 'var(--color-texto-claro)',
  border: '1.5px solid var(--color-texto-oscuro)',
  boxShadow: '0 4px 10px rgba(44, 44, 42, 0.3)',
  fontWeight: 700,
  fontSize: '1rem',
  textTransform: 'none',
  '&:hover': {
    bgcolor: 'var(--color-primario-hover, var(--color-primario))',
  },
};

const botonAtrasPillStyle = {
  height: 38,
  borderRadius: '20px',
  bgcolor: 'var(--color-primario)',
  color: 'var(--color-texto-claro)',
  border: '1.2px solid var(--color-texto-oscuro)',
  boxShadow: '0 2px 6px rgba(44, 44, 42, 0.25)',
  fontWeight: 600,
  fontSize: '0.92rem',
  textTransform: 'none',
  '&:hover': {
    bgcolor: 'var(--color-primario-hover, var(--color-primario))',
  },
};

const labelFormStyle = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--color-texto-oscuro)',
  mb: 0.5,
};

const inputWireframeStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    bgcolor: 'var(--color-fondo)',
    '& fieldset': { borderColor: 'var(--color-borde)' },
    '&:hover fieldset': { borderColor: 'var(--color-texto-oscuro)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-primario)' },
  },
  '& .MuiInputBase-input': {
    color: 'var(--color-texto-oscuro)',
    fontSize: '0.9rem',
    py: 0.8,
  },
};

const botonAccionFormStyle = {
  height: 40,
  borderRadius: '20px',
  bgcolor: 'var(--color-primario)',
  color: 'var(--color-texto-claro)',
  border: '1.2px solid var(--color-texto-oscuro)',
  boxShadow: '0 3px 6px rgba(44, 44, 42, 0.3)',
  fontWeight: 600,
  fontSize: '0.92rem',
  textTransform: 'none',
  '&:hover': {
    bgcolor: 'var(--color-primario-hover, var(--color-primario))',
  },
};