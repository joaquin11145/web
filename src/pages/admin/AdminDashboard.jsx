import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';

import CloseIcon from '@mui/icons-material/Close';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import LoginField from '../../components/molecules/LoginField/LoginField';
import CustomButton from '../../components/atoms/Button/CustomButton';
import { hashPassword } from '../../utils/security';

export default function AdminDashboard({ cartProps = {} }) {
  const navigate = useNavigate();

  const [openCrearAdmin, setOpenCrearAdmin] = useState(false);
  const [formAdmin, setFormAdmin] = useState({
    rut: '',
    nombre: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [errorAlerta, setErrorAlerta] = useState('');

  const formatearRut = (valor) => {
    let limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length <= 1) return limpio;
    const dv = limpio.slice(-1);
    let cuerpo = limpio.slice(0, -1);
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpo}-${dv}`;
  };

  const handleAbrirModal = () => {
    setFormAdmin({ rut: '', nombre: '', email: '', password: '' });
    setErrorAlerta('');
    setMensajeExito(false);
    setOpenCrearAdmin(true);
  };

  const handleCerrarModal = () => {
    setOpenCrearAdmin(false);
  };

  // Creación con Bcrypt asíncrono
  const handleGuardarNuevoAdmin = async (e) => {
    if (e) e.preventDefault();

    if (!formAdmin.rut.trim() || !formAdmin.nombre.trim() || !formAdmin.email.trim() || !formAdmin.password.trim()) {
      setErrorAlerta('Todos los campos con asterisco naranja son obligatorios.');
      return;
    }

    if (formAdmin.password.length < 4) {
      setErrorAlerta('La contraseña temporal debe tener al menos 4 caracteres.');
      return;
    }

    // Hasheo con salt de la contraseña temporal
    const passwordHashTemporal = await hashPassword(formAdmin.password);

    const payloadNuevoAdmin = {
      id: Date.now(),
      rut: formAdmin.rut,
      nombre: formAdmin.nombre,
      email: formAdmin.email,
      passwordHash: passwordHashTemporal, // Se guarda el hash seguro, nunca texto plano
      rol: 'admin',
      requiereCambioPassword: true, // Forzará el flujo de activación en el login
      fechaCreacion: new Date().toISOString(),
    };

    console.log('[BACKEND PENDIENTE] POST /api/admin/crear-administrador (Hash Bcrypt temporal):', {
      rut: payloadNuevoAdmin.rut,
      nombre: payloadNuevoAdmin.nombre,
      email: payloadNuevoAdmin.email,
      passwordHash: payloadNuevoAdmin.passwordHash,
    });

    try {
      const adminsExistentes = JSON.parse(sessionStorage.getItem('admins_temporales') || '[]');
      sessionStorage.setItem('admins_temporales', JSON.stringify([...adminsExistentes, payloadNuevoAdmin]));
    } catch (err) {
      console.warn('No se pudo guardar en sessionStorage', err);
    }

    setMensajeExito(true);
    setErrorAlerta('');

    setTimeout(() => {
      setOpenCrearAdmin(false);
      setMensajeExito(false);
    }, 1300);
  };

  return (
    <MainLayout {...cartProps}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '68vh',
          p: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.85rem' },
            fontWeight: 800,
            color: 'var(--color-texto-oscuro)',
            mb: { xs: 3, sm: 4 },
            letterSpacing: '0.4px',
          }}
        >
          Administrar
        </Typography>

        {/* 4 Módulos principales */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: { xs: 2.5, sm: 3.5 },
            width: '100%',
            maxWidth: 580,
            mb: 3,
          }}
        >
          <Button
            variant="contained"
            disableElevation
            onClick={() => navigate('/admin/emprendedores')}
            sx={menuBotonStyle}
          >
            Emprendedores
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={() => navigate('/admin/transporte')}
            sx={menuBotonStyle}
          >
            Transporte
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={() => navigate('/admin/comentarios')}
            sx={menuBotonStyle}
          >
            Comentarios de Usuarios
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={() => navigate('/admin/devoluciones')}
            sx={menuBotonStyle}
          >
            Devoluciones
          </Button>
        </Box>

        {/* Botón en Naranja Terracota Oficial de Figma */}
        <Box sx={{ width: '100%', maxWidth: 580 }}>
          <Button
            fullWidth
            variant="contained"
            disableElevation
            startIcon={<PersonAddAlt1OutlinedIcon />}
            onClick={handleAbrirModal}
            sx={{
              height: 50,
              borderRadius: '20px',
              bgcolor: 'var(--color-primario) !important',
              color: 'var(--color-texto-claro) !important',
              border: '1.5px solid var(--color-texto-oscuro)',
              boxShadow: '0 4px 6px rgba(44, 44, 42, 0.35)',
              fontWeight: 700,
              fontSize: '0.96rem',
              textTransform: 'none',
              letterSpacing: '0.2px',
              '&:hover': {
                bgcolor: 'var(--color-primario-hover, var(--color-primario)) !important',
                opacity: 0.95,
              },
            }}
          >
            + Crear Nuevo Administrador
          </Button>
        </Box>

        {/* Modal de Creación */}
        <Dialog
          open={openCrearAdmin}
          onClose={handleCerrarModal}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              border: '1.5px solid var(--color-texto-oscuro)',
              p: 2,
              bgcolor: 'var(--color-fondo)',
              boxShadow: '0 16px 40px rgba(44, 44, 42, 0.3)',
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 800,
              color: 'var(--color-primario)',
              fontSize: '1.15rem',
              pb: 1,
            }}
          >
            Nuevo Administrador
            <IconButton onClick={handleCerrarModal} size="small" sx={{ color: 'var(--color-texto-oscuro)' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Divider sx={{ borderColor: 'var(--color-borde)', mb: 2 }} />

          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 0 }}>
            <Collapse in={Boolean(errorAlerta)}>
              <Alert severity="error" sx={{ mb: 1.5, borderRadius: '8px', fontSize: '0.84rem' }}>
                {errorAlerta}
              </Alert>
            </Collapse>

            <Collapse in={mensajeExito}>
              <Alert severity="success" sx={{ mb: 1.5, borderRadius: '8px', fontSize: '0.84rem' }}>
                ¡Administrador creado con contraseña hasheada! Deberá activar su cuenta en el primer ingreso.
              </Alert>
            </Collapse>

            <LoginField
              label="RUT del Administrador"
              placeholder="11.111.111-1"
              value={formAdmin.rut}
              onChange={(e) => setFormAdmin({ ...formAdmin, rut: formatearRut(e.target.value) })}
              maxLength={12}
              required
            />

            <LoginField
              label="Nombre Completo"
              placeholder="Ej: Laura Martínez"
              value={formAdmin.nombre}
              onChange={(e) => setFormAdmin({ ...formAdmin, nombre: e.target.value })}
              required
            />

            <LoginField
              label="Correo Electrónico"
              type="email"
              placeholder="admin@meyerexpress.cl"
              value={formAdmin.email}
              onChange={(e) => setFormAdmin({ ...formAdmin, email: e.target.value })}
              required
            />

            <LoginField
              label="Contraseña Temporal"
              placeholder="Clave inicial provisoria"
              value={formAdmin.password}
              onChange={(e) => setFormAdmin({ ...formAdmin, password: e.target.value })}
              isPassword={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              required
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 1.5, display: 'flex', gap: 1.5 }}>
            <CustomButton pill outlined onClick={handleCerrarModal}>
              Cancelar
            </CustomButton>

            <CustomButton pill onClick={handleGuardarNuevoAdmin}>
              Crear Cuenta
            </CustomButton>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}

const menuBotonStyle = {
  height: 52,
  borderRadius: '20px',
  bgcolor: 'var(--color-primario)',
  color: 'var(--color-texto-claro)',
  border: '1.5px solid var(--color-texto-oscuro)',
  boxShadow: '0 4px 6px rgba(44, 44, 42, 0.35)',
  fontWeight: 600,
  fontSize: '0.98rem',
  textTransform: 'none',
  letterSpacing: '0.2px',
  '&:hover': {
    bgcolor: 'var(--color-primario-hover, var(--color-primario))',
  },
};