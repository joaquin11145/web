import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoginField from '../../molecules/LoginField/LoginField.jsx';
import RememberUser from '../../molecules/RememberUser/RememberUser.jsx';
import CustomButton from '../../atoms/Button/CustomButton.jsx';

export default function LoginForm({
  rut,
  setRut,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  recuerdame,
  setRecuerdame,
  onSubmit,
  onCrearCuenta,
}) {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      autoComplete="off"
      sx={{ width: '100%', maxWidth: 360 }}
    >
      <LoginField
        label="Rut"
        value={rut}
        onChange={(e) => setRut(e.target.value)}
        maxLength={12}
        required
      />

      <LoginField
        label="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isPassword={true}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        required
      />

      <RememberUser
        checked={recuerdame}
        onChange={(e) => setRecuerdame(e.target.checked)}
      />

      {/* Botones Continuar y Crear Cuenta */}
      <Stack spacing={1.5} sx={{ width: '100%' }}>
        <CustomButton type="submit">Continuar</CustomButton>
        <CustomButton type="button" onClick={onCrearCuenta}>
          Crear Cuenta
        </CustomButton>
      </Stack>

      {/* Divisor con punto central */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mt: 3, width: '100%' }}>
        <Box sx={{ flex: 1, height: '1.2px', bgcolor: 'var(--color-texto-oscuro)' }} />
        <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'var(--color-texto-oscuro)' }} />
        <Box sx={{ flex: 1, height: '1.2px', bgcolor: 'var(--color-texto-oscuro)' }} />
      </Box>
    </Box>
  );
}