import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import LoginField from '../../molecules/LoginField/LoginField.jsx';
import CustomButton from '../../atoms/Button/CustomButton.jsx';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function SignUpForm({
  formData,
  setFormData,
  onSubmit,
  onAbrirTelefono,
  onAbrirDireccion,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const formatearRut = (valor) => {
    let limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length <= 1) return limpio;
    const dv = limpio.slice(-1);
    let cuerpo = limpio.slice(0, -1);
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpo}-${dv}`;
  };

  const formatearFecha = (valor) => {
    const soloNumeros = valor.replace(/\D/g, '').slice(0, 8);
    if (soloNumeros.length <= 2) return soloNumeros;
    if (soloNumeros.length <= 4) return `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2)}`;
    return `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2, 4)}/${soloNumeros.slice(4)}`;
  };

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      autoComplete="off"
      noValidate
      sx={{ width: '100%' }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 2, md: 6 },
          alignItems: 'start',
        }}
      >
        {/* COLUMNA IZQUIERDA */}
        <Box sx={{ width: '100%' }}>
          <LoginField
            label="Ingrese Rut"
            value={formData.rut}
            onChange={(e) => handleChange('rut', formatearRut(e.target.value))}
            maxLength={12}
            required
          />
          <LoginField
            label="Ingrese E-mail"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          <LoginField
            label="Ingrese Nombres"
            value={formData.nombres}
            onChange={(e) => handleChange('nombres', e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
            required
          />
          <LoginField
            label="Ingrese Apellidos"
            value={formData.apellidos}
            onChange={(e) => handleChange('apellidos', e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
            required
          />

          {/* Ingrese Género */}
          <Box sx={{ width: '100%', mb: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                display: 'block',
                mb: 0.6,
                fontWeight: 500,
                color: 'var(--color-texto-oscuro)',
                fontSize: '0.88rem',
              }}
            >
              Ingrese Género
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={formData.genero || ''}
              onChange={(e) => handleChange('genero', e.target.value)}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  height: 36,
                  backgroundColor: 'var(--color-blanco)',
                  '& fieldset': {
                    borderColor: 'var(--color-borde)',
                    borderWidth: '1.2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--color-texto-oscuro)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--color-primario)',
                  },
                },
                '& .MuiSelect-select': {
                  py: 0.8,
                  px: 1.5,
                  fontSize: '0.92rem',
                  color: 'var(--color-texto-oscuro)',
                },
              }}
            >
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Femenino">Femenino</MenuItem>
              <MenuItem value="Otros">Otros</MenuItem>
              <MenuItem value="Prefiero no decirlo">Prefiero no decirlo</MenuItem>
            </TextField>
          </Box>

          <LoginField
            label="Ingrese Fecha de Nacimiento"
            value={formData.fechaNacimiento}
            placeholder="DD/MM/AAAA"
            onChange={(e) => handleChange('fechaNacimiento', formatearFecha(e.target.value))}
            endIcon={<CalendarMonthIcon fontSize="small" />}
            maxLength={10}
          />
        </Box>

        {/* COLUMNA DERECHA */}
        <Box sx={{ width: '100%' }}>
          <LoginField
            label="Ingrese Contraseña"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            isPassword={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            required
          />
          <LoginField
            label="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            isPassword={true}
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.soyEmpresa}
                onChange={(e) => handleChange('soyEmpresa', e.target.checked)}
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
                Soy Empresa
              </Typography>
            }
            sx={{ mb: 0.5, ml: 0 }}
          />

          <LoginField
            label="Ingrese Nombre Empresa"
            value={formData.nombreEmpresa}
            onChange={(e) => handleChange('nombreEmpresa', e.target.value)}
            disabled={!formData.soyEmpresa}
            required={formData.soyEmpresa}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.tieneWeb}
                onChange={(e) => handleChange('tieneWeb', e.target.checked)}
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
                Ingrese página Web
              </Typography>
            }
            sx={{ mb: 0.5, ml: 0 }}
          />

          <LoginField
            label=""
            value={formData.paginaWeb}
            onChange={(e) => handleChange('paginaWeb', e.target.value)}
            disabled={!formData.tieneWeb}
          />

          <Stack spacing={1.5} sx={{ mt: 2, width: '100%' }}>
            <CustomButton type="button" onClick={onAbrirTelefono}>
              {formData.telefonos && formData.telefonos.length > 0
                ? `Teléfonos (${formData.telefonos.length})`
                : 'Ingrese Teléfono'}
            </CustomButton>
            <CustomButton type="button" onClick={onAbrirDireccion}>
              {formData.direcciones && formData.direcciones.length > 0
                ? `Direcciones (${formData.direcciones.length})`
                : 'Ingrese Dirección'}
            </CustomButton>
            <CustomButton type="submit">
              Crear Cuenta
            </CustomButton>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              mt: 3,
              width: '100%',
            }}
          >
            <Box sx={{ flex: 1, height: '1.2px', bgcolor: 'var(--color-texto-oscuro)' }} />
            <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'var(--color-texto-oscuro)' }} />
            <Box sx={{ flex: 1, height: '1.2px', bgcolor: 'var(--color-texto-oscuro)' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}