import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

export default function StockModal({ open, onClose, producto, onGuardarStock }) {
  const [variantes, setVariantes] = useState([]);
  const [nuevaTalla, setNuevaTalla] = useState('');
  const [nuevoColor, setNuevoColor] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  // Función declarada arriba para evitar el ReferenceError de inicialización
  function limpiarFormulario() {
    setNuevaTalla('');
    setNuevoColor('');
    setNuevaCantidad('');
    setEditandoId(null);
  }

  useEffect(() => {
    if (producto) {
      if (Array.isArray(producto.stockDetalle) && producto.stockDetalle.length > 0) {
        setVariantes(producto.stockDetalle);
      } else if (producto.stock !== undefined && producto.stock !== null && producto.stock !== '') {
        setVariantes([
          {
            id: Date.now(),
            talla: Array.isArray(producto.tamanos) && producto.tamanos.length > 0 ? producto.tamanos[0] : 'Única',
            color: Array.isArray(producto.colores) && producto.colores.length > 0 ? producto.colores[0] : 'Estándar',
            cantidad: Number(producto.stock) || 0,
          },
        ]);
      } else {
        setVariantes([]);
      }
    } else {
      setVariantes([]);
    }
    limpiarFormulario();
  }, [producto, open]);

  if (!open || !producto) return null;

  const handleGuardarVariante = (e) => {
    e.preventDefault();
    const cantNum = parseInt(nuevaCantidad, 10);
    if (isNaN(cantNum) || cantNum < 0) return;

    if (editandoId) {
      setVariantes((prev) =>
        prev.map((item) =>
          item.id === editandoId
            ? {
                ...item,
                talla: nuevaTalla.trim() || 'Única',
                color: nuevoColor.trim() || 'Estándar',
                cantidad: cantNum,
              }
            : item
        )
      );
    } else {
      setVariantes((prev) => [
        ...prev,
        {
          id: Date.now(),
          talla: nuevaTalla.trim() || 'Única',
          color: nuevoColor.trim() || 'Estándar',
          cantidad: cantNum,
        },
      ]);
    }
    limpiarFormulario();
  };

  const handleEliminarVariante = (id) => {
    setVariantes((prev) => prev.filter((item) => item.id !== id));
    if (editandoId === id) limpiarFormulario();
  };

  const handleConfirmarTodo = () => {
    const totalStock = variantes.reduce((acc, curr) => acc + (Number(curr.cantidad) || 0), 0);
    if (onGuardarStock && producto) {
      onGuardarStock(producto.id, {
        stockDetalle: variantes,
        stock: totalStock,
      });
    }
    onClose();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(44, 44, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        p: 2,
        boxSizing: 'border-box',
      }}
      onClick={onClose}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: '100%',
          maxWidth: 600,
          maxHeight: '94vh',
          bgcolor: 'var(--color-fondo)',
          border: '1.5px solid var(--color-texto-oscuro)',
          borderRadius: '32px',
          boxShadow: '0 18px 45px rgba(44, 44, 42, 0.38)',
          p: { xs: 2.5, sm: '28px 36px' },
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 700, mb: 0.5, fontSize: '1.15rem' }}
        >
          Administrar Stock: {producto?.nombre || 'Producto'}
        </Typography>

        <Typography variant="caption" sx={{ color: 'var(--color-borde)', mb: 2, display: 'block' }}>
          Agrega o actualiza combinaciones por talla, color y cantidad disponible.
        </Typography>

        {/* 1. VISOR READ */}
        <Box
          sx={{
            width: '100%',
            maxHeight: 160,
            minHeight: 80,
            border: '1.2px solid var(--color-texto-oscuro)',
            bgcolor: 'var(--color-blanco)',
            overflowY: 'auto',
            p: 1.2,
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.8,
            boxSizing: 'border-box',
          }}
        >
          {variantes.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'var(--color-borde)', fontStyle: 'italic', m: 'auto' }}>
              No hay registros de stock aún. Agrega el primero abajo.
            </Typography>
          ) : (
            variantes.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: editandoId === item.id ? 'var(--color-fondo)' : 'var(--color-blanco)',
                  border: '1px solid var(--color-texto-oscuro)',
                  px: 1.5,
                  py: 0.5,
                }}
              >
                <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontSize: '0.86rem' }}>
                  <strong>Talla:</strong> {item.talla} | <strong>Color:</strong> {item.color} | <strong>Cant:</strong> {item.cantidad}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button
                    size="small"
                    onClick={() => {
                      setEditandoId(item.id);
                      setNuevaTalla(item.talla === 'Única' ? '' : item.talla);
                      setNuevoColor(item.color === 'Estándar' ? '' : item.color);
                      setNuevaCantidad(item.cantidad?.toString() || '');
                    }}
                    sx={{ color: 'var(--color-primario)', fontSize: '0.78rem', p: 0.2, minWidth: 'auto', textTransform: 'none' }}
                  >
                    Editar
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => handleEliminarVariante(item.id)}
                    sx={{ color: 'var(--color-texto-oscuro)', p: 0.2 }}
                  >
                    ×
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* 2. FORMULARIO CREATE / UPDATE */}
        <Box
          component="form"
          onSubmit={handleGuardarVariante}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.2,
            mb: 2.5,
            p: 1.5,
            border: '1px dashed var(--color-borde)',
            bgcolor: 'var(--color-fondo)',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)', fontSize: '0.9rem' }}>
            {editandoId ? 'Modificar elemento seleccionado' : 'Añadir nueva opción de stock'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Talla (opcional)"
              value={nuevaTalla}
              onChange={(e) => setNuevaTalla(e.target.value)}
              sx={{ flex: 1, minWidth: 100, ...inputSmallStyle }}
            />
            <TextField
              size="small"
              placeholder="Color (opcional)"
              value={nuevoColor}
              onChange={(e) => setNuevoColor(e.target.value)}
              sx={{ flex: 1, minWidth: 100, ...inputSmallStyle }}
            />
            <TextField
              size="small"
              type="number"
              required
              placeholder="Cantidad *"
              value={nuevaCantidad}
              onChange={(e) => setNuevaCantidad(e.target.value)}
              inputProps={{ min: 0 }}
              sx={{ width: 110, ...inputSmallStyle }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 0.5 }}>
            {editandoId && (
              <Button
                size="small"
                onClick={limpiarFormulario}
                sx={{ color: 'var(--color-texto-oscuro)', textTransform: 'none', fontSize: '0.8rem' }}
              >
                Cancelar edición
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              disableElevation
              size="small"
              sx={{
                bgcolor: 'var(--color-primario)',
                color: 'var(--color-fondo)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                borderRadius: '12px',
                border: '1px solid var(--color-texto-oscuro)',
                '&:hover': { bgcolor: 'var(--color-primario)' },
              }}
            >
              {editandoId ? 'Guardar Cambios' : '+ Agregar a la lista'}
            </Button>
          </Box>
        </Box>

        {/* 3. BOTONES DE ACCIÓN */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
          <Button
            type="button"
            fullWidth
            variant="contained"
            disableElevation
            onClick={handleConfirmarTodo}
            sx={{
              height: 38,
              borderRadius: '20px',
              bgcolor: 'var(--color-primario)',
              color: 'var(--color-fondo)',
              border: '1.5px solid var(--color-texto-oscuro)',
              boxShadow: '0 4px 6px rgba(44, 44, 42, 0.4)',
              fontWeight: 600,
              fontSize: '0.92rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'var(--color-primario)' },
            }}
          >
            Confirmar y Guardar Stock
          </Button>

          <Button
            type="button"
            fullWidth
            variant="text"
            disableRipple
            onClick={onClose}
            sx={{
              height: 34,
              bgcolor: 'transparent',
              color: 'var(--color-primario)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'transparent',
                color: 'var(--color-primario)',
                textDecoration: 'underline',
              },
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

const inputSmallStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    height: 32,
    backgroundColor: 'var(--color-blanco)',
    '& fieldset': {
      borderColor: 'var(--color-texto-oscuro)',
      borderWidth: '1.1px',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-texto-oscuro)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-primario)',
    },
  },
  '& .MuiInputBase-input': {
    py: 0.5,
    px: 1,
    fontSize: '0.85rem',
    color: 'var(--color-texto-oscuro)',
  },
};