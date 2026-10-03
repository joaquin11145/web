import React from 'react';
import Button from '@mui/material/Button';

export default function CustomButton({ children, onClick, type = 'button', ...props }) {
  return (
    <Button
      type={type}
      onClick={onClick}
      variant="contained"
      disableElevation
      fullWidth
      sx={{
        bgcolor: 'primary.main',
        color: 'text.secondary',
        borderRadius: 0,
        textTransform: 'none',
        fontWeight: 600,
        height: 38,
        '&:hover': {
          bgcolor: 'primary.dark',
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
}