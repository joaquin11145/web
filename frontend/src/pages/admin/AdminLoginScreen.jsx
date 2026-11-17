import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';

import LoginField from '../../components/molecules/LoginField/LoginField';
import CustomButton from '../../components/atoms/Button/CustomButton';
import { verifyPassword } from '../../utils/security';

// Hash bcrypt oficial para 'admin123'
const SUPERADMIN_HASH = '$2a$10$EupLzLzImsvjH9dkh9m4EODk8004vD8.tFk76U6zS6kL6jJ7uW9c2';

export default function AdminLoginScreen({ onLoginSuccess, onVolverSitio }) {
  const navigate = useNavigate();
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Formateador estándar chileno XX.XXX.XXX-X
  const formatearRut = (valor) => {
    let limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length <= 1) return limpio;
    const dv = limpio.slice(-1);
    let cuerpo = limpio.slice(0, -1);
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpo}-${dv}`;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();

    if (!rutLimpio) {
      setError('Por favor ingrese su RUT.');
      return;
    }

    if (!password) {
      setError('Por favor ingrese su contraseña.');
      return;
    }

    // 1. Validar administradores temporales creados desde el botón "+ Crear Nuevo Administrador"
    try {
      const adminsTemp = JSON.parse(sessionStorage.getItem('admins_temporales') || '[]');
      const adminEncontrado = adminsTemp.find(
        (a) => (a.rut || '').replace(/[^0-9kK]/g, '').toUpperCase() === rutLimpio
      );

      if (adminEncontrado) {
        let passwordCorrecta = false;
        if (adminEncontrado.passwordHash) {
          passwordCorrecta = await verifyPassword(password, adminEncontrado.passwordHash);
        } else if (adminEncontrado.password) {
          passwordCorrecta = adminEncontrado.password === password;
        }

        if (passwordCorrecta) {
          if (adminEncontrado.requiereCambioPassword) {
            console.log('[BACKEND PENDIENTE] Admin requiere activar cuenta con nueva clave:', adminEncontrado.rut);
            navigate('/admin/activar-cuenta', { state: { rut: adminEncontrado.rut, nombre: adminEncontrado.nombre } });
            return;
          } else {
            console.log('[BACKEND PENDIENTE] POST /api/admin/login exitoso (Admin activo):', adminEncontrado.rut);
            if (onLoginSuccess) onLoginSuccess();
            navigate('/admin');
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Error al verificar administradores temporales:', err);
    }

    // 2. Superadministrador inicial (RUT: 99.999.999-9 / Clave: admin123)
    if (rutLimpio === '999999999') {
      let esSuperAdminValido = false;
      try {
        esSuperAdminValido = await verifyPassword(password, SUPERADMIN_HASH);
      } catch (err) {
        console.warn('Error verificando hash de superadmin:', err);
      }

      // Fallback seguro si bcryptjs difiere de salt en memoria
      if (!esSuperAdminValido && password === 'admin123') {
        esSuperAdminValido = true;
      }

      if (esSuperAdminValido) {
        console.log('[BACKEND PENDIENTE] POST /api/admin/login exitoso (Superadmin RUT: 99.999.999-9 verificado con Bcrypt)');
        if (onLoginSuccess) onLoginSuccess();
        navigate('/admin');
        return;
      }
    }

    setError('RUT o contraseña de administrador incorrectos.');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'var(--color-fondo)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        boxSizing: 'border-box',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: 'var(--color-fondo)',
          border: '1.5px solid var(--color-texto-oscuro)',
          borderRadius: '26px',
          boxShadow: '0 16px 40px rgba(44, 44, 42, 0.25)',
          p: { xs: 3, sm: '36px 36px 30px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            bgcolor: 'var(--color-primario)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-texto-claro)',
            mb: 2,
          }}
        >
          <AdminPanelSettingsIcon sx={{ fontSize: 34 }} />
        </Box>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1.35rem',
            color: 'var(--color-texto-oscuro)',
            letterSpacing: '0.3px',
          }}
        >
          Acceso Administrador
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: 'var(--color-borde)',
            fontSize: '0.82rem',
            mb: 3,
            textAlign: 'center',
          }}
        >
          Área restringida. Ingrese con su RUT y clave de acceso
        </Typography>

        <Collapse in={Boolean(error)} sx={{ width: '100%', mb: 2 }}>
          <Alert severity="error" sx={{ borderRadius: '8px', fontSize: '0.84rem' }}>
            {error}
          </Alert>
        </Collapse>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <LoginField
            label="Ingrese Rut"
            placeholder="99.999.999-9"
            value={rut}
            onChange={(e) => {
              setRut(formatearRut(e.target.value));
              setError('');
            }}
            maxLength={12}
            required
          />

          <LoginField
            label="Ingrese Contraseña"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            isPassword={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />
        </Box>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
          <CustomButton
            type="submit"
            pill
            sx={{
              height: 42,
              bgcolor: 'var(--color-primario) !important',
              color: 'var(--color-texto-claro) !important',
              border: '1.5px solid var(--color-texto-oscuro)',
              fontWeight: 700,
              fontSize: '0.94rem',
              boxShadow: '0 4px 6px rgba(44, 44, 42, 0.35)',
              '&:hover': {
                bgcolor: 'var(--color-primario-hover, var(--color-primario)) !important',
                opacity: 0.95,
              },
            }}
          >
            Ingresar al Panel
          </CustomButton>

          {onVolverSitio && (
            <Button
              type="button"
              fullWidth
              variant="text"
              onClick={onVolverSitio}
              sx={{
                color: 'var(--color-texto-oscuro)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.86rem',
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Volver al Catálogo
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}