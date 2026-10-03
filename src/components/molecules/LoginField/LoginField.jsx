import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

export default function LoginField({
  label,
  value,
  onChange,
  type = 'text',
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  maxLength,
  required = false,
  disabled = false,
  placeholder = '',
}) {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {label && (
        <Typography
          variant="body2"
          sx={{
            display: 'block',
            mb: 0.6,
            fontWeight: 500,
            color: 'var(--color-texto-oscuro)',
            fontSize: '0.9rem',
          }}
        >
          {label}
        </Typography>
      )}
      <TextField
        fullWidth
        size="small"
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        inputProps={{
          maxLength,
          autoComplete: isPassword ? 'new-password' : 'off', // Bloquea sugerencias y autocompletado
        }}
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            height: 38,
            backgroundColor: disabled ? 'var(--color-fondo)' : 'var(--color-input-bg)',
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
          '& .MuiInputBase-input': {
            py: 0.8,
            px: 1.5,
            fontSize: '0.95rem',
            color: 'var(--color-texto-oscuro)',
            backgroundColor: 'transparent',
            '&:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 1000px var(--color-blanco) inset !important',
              WebkitTextFillColor: 'var(--color-texto-oscuro) !important',
            },
          },
        }}
        InputProps={{
          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                type="button"
                onClick={onTogglePassword}
                edge="end"
                size="small"
                sx={{
                  color: 'var(--color-texto-oscuro)',
                  p: 0.5,
                  mr: 0.5,
                }}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? (
                  /* Ojo Abierto */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  /* Ojo Tachado */
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
}