import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const vacio = { nombre: '', valor: '', descripcion: '', stock: '' ,tipo: 'producto'};

export default function ProductFormModal({ open, onClose, onSave, onDelete, producto }) {
  const [form, setForm] = useState(vacio);
  const esEdicion = Boolean(producto);

  useEffect(() => {
    setForm(producto ? { ...producto } : vacio);
  }, [producto, open]);

  const handleChange = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(esEdicion ? 'Producto actualizado:' : 'Producto creado:', form);
    onSave(form);
    onClose();
  };

  const handleDelete = () => {
    console.log('Producto eliminado:', form);
    onDelete(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{esEdicion ? 'Editar Producto' : 'Crear Publicación'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ToggleButtonGroup
            value={form.tipo}
            exclusive
            onChange={(e, val) => val &&setForm({ ...form, tipo: val })}
          >
            <ToggleButton value="producto">Producto</ToggleButton>
            <ToggleButton value="servicio">Servicio</ToggleButton>
          </ToggleButtonGroup>
          <TextField label="Nombre" value={form.nombre} onChange={handleChange('nombre')} required />
          <TextField label="Valor" type="number" value={form.valor} onChange={handleChange('valor')} required />
          <TextField label="Descripción" value={form.descripcion} onChange={handleChange('descripcion')} multiline minRows={2} />
          <TextField label="Stock" type="number" value={form.stock} onChange={handleChange('stock')} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {esEdicion && (
            <Button color="error" onClick={handleDelete} sx={{ mr: 'auto', textTransform: 'none' }}>
              Eliminar
            </Button>
          )}
          <Button onClick={onClose} sx={{ textTransform: 'none' }}>Cancelar</Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--color-primario)', textTransform: 'none' }}>
            {esEdicion ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}