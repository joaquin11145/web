import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LoginField from '../../molecules/LoginField/LoginField.jsx';
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
      noValidate
      sx={{
        width: '100%',
        maxWidth: 380,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <LoginField
        label="Ingrese Rut"
        value={rut}
        onChange={(e) => setRut(e.target.value)}
        maxLength={12}
        required
      />

      <LoginField
        label="Ingrese Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isPassword={true}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        required
      />

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={recuerdame}
              onChange={(e) => setRecuerdame(e.target.checked)}
              size="small"
              sx={{
                color: 'var(--color-texto-oscuro)',
                '&.Mui-checked': { color: 'var(--color-primario)' },
                p: 0.5,
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', userSelect: 'none' }}>
              Recuérdame
            </Typography>
          }
          sx={{ ml: 0 }}
        />
      </Box>

      {/* Botones de acción en Naranja Oficial Figma */}
      <Stack spacing={1.8} sx={{ width: '100%', mt: 1 }}>
        <CustomButton
          type="submit"
          pill
          sx={botonNaranjaFigma}
        >
          Continuar
        </CustomButton>

        <CustomButton
          type="button"
          pill
          onClick={onCrearCuenta}
          sx={botonNaranjaFigma}
        >
          Crear Cuenta
        </CustomButton>
      </Stack>

      {/* Separador decorativo inferior de Figma */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          mt: 4,
          width: '100%',
        }}
      >
        <Box sx={{ flex: 1, height: '1.2px', bgcolor: 'var(--color-texto-oscuro)' }} />
        <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'var(--color-texto-oscuro)' }} />
        <Box sx={{ flex: 1, height: '1.2px', bgcolor: 'var(--color-texto-oscuro)' }} />
      </Box>
    </Box>
  );
}

const botonNaranjaFigma = {
  bgcolor: 'var(--color-primario) !important',
  color: 'var(--color-texto-claro) !important',
  border: '1.5px solid var(--color-texto-oscuro)',
  boxShadow: '0 4px 6px rgba(44, 44, 42, 0.35)',
  fontWeight: 600,
  fontSize: '0.95rem',
  textTransform: 'none',
  height: 40,
  borderRadius: '20px',
  '&:hover': {
    bgcolor: 'var(--color-primario-hover, var(--color-primario)) !important',
    opacity: 0.95,
  },
};