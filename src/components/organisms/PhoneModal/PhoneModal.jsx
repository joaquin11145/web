import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const MAX_TELEFONOS = 2;

export default function PhoneModal({ open, onClose, onAgregar }) {
  const [telefono, setTelefono] = useState('');
  const [listaTemporal, setListaTemporal] = useState([]);

  const alcanzoMaximo = listaTemporal.length >= MAX_TELEFONOS;

  const handleAgregar = () => {
    if (!telefono.trim() || alcanzoMaximo) return;
    console.log('Número de teléfono agregado:', telefono);
    onAgregar && onAgregar(telefono);
    setListaTemporal((prev) => [...prev, telefono]);
    setTelefono('');
  };

  const handleQuitar = (index) => {
    setListaTemporal((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSalir = () => {
    setListaTemporal([]);
    setTelefono('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleSalir} fullWidth maxWidth="xs">
      <DialogTitle>Ingresa Teléfono</DialogTitle>
      <DialogContent>
        <TextField
          label="Ingrese Número de Teléfono"
          fullWidth
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          disabled={alcanzoMaximo}
          sx={{ mb: 1 }}
        />

        {alcanzoMaximo && (
          <Typography variant="caption" color="error">
            Máximo {MAX_TELEFONOS} números permitidos.
          </Typography>
        )}

        {listaTemporal.length > 0 && (
          <Box sx={{ mt: 2, mb: 2 }}>
            {listaTemporal.map((tel, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">{tel}</Typography>
                <IconButton size="small" onClick={() => handleQuitar(i)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', px: 3, pb: 2, gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleAgregar}
          disabled={alcanzoMaximo}
          sx={{ bgcolor: 'var(--color-primario)', textTransform: 'none' }}
        >
          Agregar Número
        </Button>
        <Button fullWidth onClick={handleSalir} sx={{ textTransform: 'none' }}>
          Salir
        </Button>
      </DialogActions>
    </Dialog>
  );
}