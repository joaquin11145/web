import React from 'react';
import Button from '@mui/material/Button';

export default function CustomButton({
  children,
  onClick,
  type = 'button',
  variant = 'contained',
  fullWidth = true,
  pill = false,
  outlined = false,
  sx = {},
  ...props
}) {
  return (
    <Button
      type={type}
      onClick={onClick}
      variant={variant}
      disableElevation
      fullWidth={fullWidth}
      sx={{
        bgcolor: outlined ? 'transparent' : 'var(--color-primario)',
        color: outlined ? 'var(--color-texto-oscuro)' : 'var(--color-texto-claro)',
        borderRadius: pill ? '19px' : 0,
        textTransform: 'none',
        fontWeight: 600,
        height: 38,
        border: outlined ? '1.5px solid var(--color-borde)' : '1.5px solid var(--color-texto-oscuro)',
        boxShadow: pill ? '0 3px 6px rgba(44, 44, 42, 0.25)' : 'none',
        '&:hover': {
          bgcolor: outlined ? 'transparent' : 'var(--color-primario-hover)',
          borderColor: 'var(--color-texto-oscuro)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}