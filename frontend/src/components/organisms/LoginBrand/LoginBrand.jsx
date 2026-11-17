import React from 'react';
import Box from '@mui/material/Box';

export default function LoginBrand() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 280,
      }}
    >
      <Box
        component="img"
        src="/logo.png"
        alt="MeyerExpress Logo"
        sx={{
          width: '100%',
          maxWidth: 260,
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </Box>
  );
}