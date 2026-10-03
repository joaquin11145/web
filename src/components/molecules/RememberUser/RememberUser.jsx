import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

export default function RememberUser({ checked, onChange }) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          size="small"
          sx={{
            color: 'text.primary',
            '&.Mui-checked': {
              color: 'primary.main',
            },
          }}
        />
      }
      label={
        <Typography variant="body2" sx={{ color: 'text.primary', userSelect: 'none' }}>
          Recuérdame
        </Typography>
      }
      sx={{ mb: 2, ml: 0 }}
    />
  );
}