import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';

import LoginField from '../../components/molecules/LoginField/LoginField';
import CustomButton from '../../components/atoms/Button/CustomButton';
import { hashPassword } from '../../utils/security';

export default function ActivarCuentaAdminScreen({ onActivacionExitosa }) {
  const navigate = useNavigate();
  const location = useLocation();

  const rutInicial = location.state?.rut || '';
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorAlerta, setErrorAlerta] = useState('');
  const [mensajeExito, setMensajeExito] = useState(false);

  const handleActivar = async (e) => {
    if (e) e.preventDefault();

    if (!nuevaPassword.trim() || !confirmPassword.trim()) {
      setErrorAlerta('Todos los campos son obligatorios.');
      return;
    }

    if (nuevaPassword.length < 6) {
      setErrorAlerta('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (nuevaPassword !== confirmPassword) {
      setErrorAlerta('Las contraseñas no coinciden.');
      return;
    }

    // Hasheo con bcrypt de la contraseña definitiva
    const nuevoHash = await hashPassword(nuevaPassword);

    const payloadActivacion = {
      rut: rutInicial,
      passwordHash: nuevoHash,
      fechaActivacion: new Date().toISOString(),
    };

    console.log('[BACKEND PENDIENTE] POST /api/admin/activar-cuenta (Hash Bcrypt generado):', payloadActivacion);

    try {
      const admins = JSON.parse(sessionStorage.getItem('admins_temporales') || '[]');
      const actualizados = admins.map((a) =>
        a.rut === rutInicial
          ? { ...a, passwordHash: nuevoHash, password: '', requiereCambioPassword: false }
          : a
      );
      sessionStorage.setItem('admins_temporales', JSON.stringify(actualizados));
    } catch (err) {
      console.warn(err);
    }

    setMensajeExito(true);
    setErrorAlerta('');

    setTimeout(() => {
      if (onActivacionExitosa) onActivacionExitosa();
      navigate('/admin');
    }, 1500);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'var(--color-fondo)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box
        component="img"
        src="/logo.png"
        alt="MeyerExpress"
        sx={{ height: 42, mb: 3 }}
      />

      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: 'var(--color-fondo)',
          border: '1.5px solid var(--color-texto-oscuro)',
          borderRadius: '24px',
          p: { xs: 3, sm: 4 },
          boxShadow: '0 12px 36px rgba(44, 44, 42, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1.3rem',
            color: 'var(--color-primario)',
            mb: 0.5,
            textAlign: 'center',
          }}
        >
          Activación de Administrador
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'var(--color-borde)',
            fontSize: '0.86rem',
            textAlign: 'center',
            mb: 2.5,
          }}
        >
          Has ingresado con una <strong>contraseña temporal</strong>. Por seguridad, define tu clave definitiva para acceder al panel.
        </Typography>

        <Collapse in={Boolean(errorAlerta)} sx={{ width: '100%' }}>
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px', fontSize: '0.84rem' }}>
            {errorAlerta}
          </Alert>
        </Collapse>

        <Collapse in={mensajeExito} sx={{ width: '100%' }}>
          <Alert severity="success" sx={{ mb: 2, borderRadius: '8px', fontSize: '0.84rem' }}>
            ¡Cuenta activada con éxito! Redirigiendo al panel...
          </Alert>
        </Collapse>

        <Box component="form" onSubmit={handleActivar} sx={{ width: '100%' }}>
          {rutInicial && (
            <LoginField
              label="RUT"
              value={rutInicial}
              disabled={true}
            />
          )}

          <LoginField
            label="Nueva Contraseña Definitiva"
            placeholder="Mínimo 6 caracteres"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            isPassword={true}
            showPassword={showPass}
            onTogglePassword={() => setShowPass(!showPass)}
            required
          />

          <LoginField
            label="Confirmar Nueva Contraseña"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isPassword={true}
            showPassword={showConfirm}
            onTogglePassword={() => setShowConfirm(!showConfirm)}
            required
          />

          <Stack spacing={1.5} sx={{ mt: 3, width: '100%' }}>
            <CustomButton
              type="submit"
              pill
              sx={{
                bgcolor: 'var(--color-primario) !important',
                color: 'var(--color-texto-claro) !important',
                border: '1.5px solid var(--color-texto-oscuro)',
                boxShadow: '0 4px 6px rgba(44, 44, 42, 0.35)',
                fontWeight: 700,
                height: 42,
              }}
            >
              Guardar y Activar Cuenta
            </CustomButton>

            <CustomButton
              type="button"
              pill
              outlined
              onClick={() => navigate('/admin')}
            >
              Cancelar
            </CustomButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}