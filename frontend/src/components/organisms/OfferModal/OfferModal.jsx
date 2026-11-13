import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

const vacio = { porcentaje: '', desde: '', hasta: '' };

export default function OfferModal({ open, onClose, producto }) {
  const [form, setForm] = useState(vacio);
  const [mensaje, setMensaje] = useState(false);

  const handleChange = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  const handleOfertar = () => {
    console.log('Oferta creada para', producto?.nombre, ':', form);
    setMensaje(true);
    setForm(vacio);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Oferta:</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              size="small"
              value={form.porcentaje}
              onChange={handleChange('porcentaje')}
              sx={{ width: 60 }}
            />
            <Typography>%</Typography>

            <Typography sx={{ ml: 1 }}>Desde:</Typography>
            <TextField
              size="small"
              type="date"
              value={form.desde}
              onChange={handleChange('desde')}
            />

            <Typography sx={{ ml: 1 }}>Hasta:</Typography>
            <TextField
              size="small"
              type="date"
              value={form.hasta}
              onChange={handleChange('hasta')}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleOfertar}
            sx={{ bgcolor: 'var(--color-primario)', textTransform: 'none', borderRadius: 3 }}
          >
            Ofertar
          </Button>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={mensaje}
        autoHideDuration={2000}
        onClose={() => setMensaje(false)}
        message="Oferta creada"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}