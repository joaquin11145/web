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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const MAX_DIRECCIONES = 2;
const vacio = {
  region: '', provincia: '', comuna: '', codigoPostal: '', direccion: '', numero: '',
  tipoLugar: '',
};

export default function AddressModal({ open, onClose, onAgregar, esEmpresa = false }) {
  const [form, setForm] = useState(vacio);
  const [listaTemporal, setListaTemporal] = useState([]);

  const alcanzoMaximo = listaTemporal.length >= MAX_DIRECCIONES;

  const handleChange = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  const handleAgregar = () => {
    if (!form.direccion.trim() || alcanzoMaximo) return;
    console.log('Dirección agregada:', { ...form, esEmpresa });
    onAgregar && onAgregar(form);
    setListaTemporal((prev) => [...prev, form]);
    setForm(vacio);
  };

  const handleQuitar = (index) => {
    setListaTemporal((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSalir = () => {
    setListaTemporal([]);
    setForm(vacio);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleSalir} fullWidth maxWidth="xs">
      <DialogTitle>{esEmpresa ? 'Ingresa Dirección (soy empresa)' : 'Ingresa Dirección'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.tipoLugar === (esEmpresa ? 'Tienda Física' : 'Oficina')}
                onChange={() => setForm({ ...form, tipoLugar: esEmpresa ? 'Tienda Física' : 'Oficina' })}
                disabled={alcanzoMaximo}
              />
            }
            label={esEmpresa ? 'Tienda Física' : 'Oficina'}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.tipoLugar === 'Casa/Depto'}
                onChange={() => setForm({ ...form, tipoLugar: 'Casa/Depto' })}
                disabled={alcanzoMaximo}
              />
            }
            label="Casa/Depto"
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <TextField label="Ingrese Región" value={form.region} onChange={handleChange('region')} fullWidth disabled={alcanzoMaximo} />
          <TextField label="Ingrese Provincia" value={form.provincia} onChange={handleChange('provincia')} fullWidth disabled={alcanzoMaximo} />
          <TextField label="Ingrese Comuna" value={form.comuna} onChange={handleChange('comuna')} fullWidth disabled={alcanzoMaximo} />
          <TextField label="Ingrese Código Postal" value={form.codigoPostal} onChange={handleChange('codigoPostal')} fullWidth disabled={alcanzoMaximo} />
          <TextField label="Ingrese Dirección" value={form.direccion} onChange={handleChange('direccion')} fullWidth disabled={alcanzoMaximo} />
          <TextField label="Ingrese Número de Dirección" value={form.numero} onChange={handleChange('numero')} fullWidth disabled={alcanzoMaximo} />
        </Box>

        {alcanzoMaximo && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
            Máximo {MAX_DIRECCIONES} direcciones permitidas.
          </Typography>
        )}

        {listaTemporal.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {listaTemporal.map((dir, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  {dir.direccion} {dir.numero}, {dir.comuna}
                </Typography>
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
          Agregar Dirección
        </Button>
        <Button fullWidth onClick={handleSalir} sx={{ textTransform: 'none' }}>
          Salir
        </Button>
      </DialogActions>
    </Dialog>
  );
}