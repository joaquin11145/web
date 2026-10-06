import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

const estadoInicial = {
  tipo: '', // '' (Selecciona), 'producto' o 'servicio'
  nombre: '',
  categoria: '',
  valor: '',
  stock: '',
  stockDetalle: [],
  // Campos específicos de Producto
  peso: '',
  materialPrincipal: '',
  // Campos específicos de Servicio
  restriccionEdad: '',
  tiempo: '',
  detallesServicio: '',
};

export default function ProductFormModal({ open, onClose, onSave, onDelete, producto }) {
  const [form, setForm] = useState(estadoInicial);
  const esEdicion = Boolean(producto);

  // Estados para variantes de stock (solo usados al crear)
  const [variantes, setVariantes] = useState([]);
  const [nuevaTalla, setNuevaTalla] = useState('');
  const [nuevoColor, setNuevoColor] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');

  useEffect(() => {
    if (producto) {
      setForm({
        ...estadoInicial,
        ...producto,
        valor: producto.valor !== undefined ? producto.valor : '',
      });
      if (Array.isArray(producto.stockDetalle)) {
        setVariantes(producto.stockDetalle);
      } else {
        setVariantes([]);
      }
    } else {
      setForm(estadoInicial);
      setVariantes([]);
    }
    setNuevaTalla('');
    setNuevoColor('');
    setNuevaCantidad('');
  }, [producto, open]);

  if (!open) return null;

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleAgregarVariante = (e) => {
    e.preventDefault();
    const cantNum = parseInt(nuevaCantidad, 10);
    if (isNaN(cantNum) || cantNum < 0) return;

    const nueva = {
      id: Date.now(),
      talla: nuevaTalla.trim() || 'Única',
      color: nuevoColor.trim() || 'Estándar',
      cantidad: cantNum,
    };

    const actualizadas = [...variantes, nueva];
    setVariantes(actualizadas);

    const total = actualizadas.reduce((acc, curr) => acc + (Number(curr.cantidad) || 0), 0);
    setForm((prev) => ({
      ...prev,
      stock: total,
      stockDetalle: actualizadas,
    }));

    setNuevaTalla('');
    setNuevoColor('');
    setNuevaCantidad('');
  };

  const handleEliminarVariante = (id) => {
    const actualizadas = variantes.filter((item) => item.id !== id);
    setVariantes(actualizadas);
    const total = actualizadas.reduce((acc, curr) => acc + (Number(curr.cantidad) || 0), 0);
    setForm((prev) => ({
      ...prev,
      stock: total,
      stockDetalle: actualizadas,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      if (esEdicion) {
        // En edición no tocamos stock ni variantes existentes
        onSave({
          ...producto,
          ...form,
          valor: form.valor ? Number(form.valor) : 0,
        });
      } else {
        // En creación guardamos todo junto
        onSave({
          ...form,
          valor: form.valor ? Number(form.valor) : 0,
          stock: form.stock !== '' ? Number(form.stock) : 0,
          stockDetalle: variantes,
          tamanos: variantes.length > 0 ? [...new Set(variantes.map((v) => v.talla))] : [],
          colores: variantes.length > 0 ? [...new Set(variantes.map((v) => v.color))] : [],
        });
      }
    }
    onClose();
  };

  const handleCancelar = () => {
    setForm(estadoInicial);
    setVariantes([]);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && form) {
      onDelete(form);
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
      onClick={handleCancelar}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '94vh',
          bgcolor: 'var(--color-fondo)',
          border: '1.5px solid var(--color-texto-oscuro)',
          borderRadius: '32px',
          boxShadow: '0 18px 45px rgba(44, 44, 42, 0.38)',
          p: { xs: 2.5, sm: '32px 42px 28px 42px' },
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {/* 1. Selector Superior de Tipo de Publicación */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            value={form.tipo || 'selecciona'}
            onChange={(e) => {
              const val = e.target.value;
              setForm((prev) => ({ ...prev, tipo: val === 'selecciona' ? '' : val }));
            }}
            SelectProps={{
              displayEmpty: true,
            }}
            disabled={esEdicion}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                height: 38,
                backgroundColor: 'var(--color-blanco)',
                '& fieldset': {
                  borderColor: 'var(--color-texto-oscuro)',
                  borderWidth: '1.2px',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--color-texto-oscuro)',
                },
              },
              '& .MuiSelect-select': {
                py: 0.8,
                px: 1.5,
                fontSize: '0.92rem',
                color: 'var(--color-texto-oscuro)',
              },
            }}
          >
            <MenuItem value="selecciona" disabled sx={{ color: 'var(--color-texto-oscuro)' }}>
              Selecciona
            </MenuItem>
            <MenuItem value="producto">Producto</MenuItem>
            <MenuItem value="servicio">Servicio</MenuItem>
          </TextField>
        </Box>

        {/* 2. Formulario Dinámico según Selección */}
        {form.tipo === 'producto' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 3 }}>
            {/* Nombre */}
            <Box>
              <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                Nombre *
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={form.nombre}
                onChange={handleChange('nombre')}
                required
                inputProps={{ autoComplete: 'off' }}
                sx={inputStyles}
              />
            </Box>

            {/* Categoría */}
            <Box>
              <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                Categoría *
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={form.categoria}
                onChange={handleChange('categoria')}
                required
                sx={inputStyles}
              >
                <MenuItem value="Electrónica">Electrónica</MenuItem>
                <MenuItem value="Hogar">Hogar</MenuItem>
                <MenuItem value="Herramientas">Herramientas</MenuItem>
                <MenuItem value="Ropa">Ropa</MenuItem>
                <MenuItem value="Otros">Otros</MenuItem>
              </TextField>
            </Box>

            {/* Valor y Peso */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                  Valor ($) *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="Ej: 12000"
                  value={form.valor}
                  onChange={handleChange('valor')}
                  required
                  inputProps={{ min: 0 }}
                  sx={inputStyles}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                  Peso (kg / gr)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={form.peso}
                  onChange={handleChange('peso')}
                  inputProps={{ autoComplete: 'off' }}
                  sx={inputStyles}
                />
              </Box>
            </Box>

            {/* Material Principal */}
            <Box>
              <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                Material Principal
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={form.materialPrincipal}
                onChange={handleChange('materialPrincipal')}
                inputProps={{ autoComplete: 'off' }}
                sx={inputStyles}
              />
            </Box>

            {/* SECCIÓN INVENTARIO: Solo se muestra al CREAR un producto */}
            {!esEdicion && (
              <Box
                sx={{
                  mt: 0.5,
                  p: 1.5,
                  border: '1.2px solid var(--color-texto-oscuro)',
                  borderRadius: '8px',
                  bgcolor: 'var(--color-blanco)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>
                    Inventario inicial (Talla, Color y Cantidad)
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-primario)' }}>
                    Stock Total: {form.stock !== '' ? form.stock : 0}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  <TextField
                    size="small"
                    placeholder="Talla (Ej: S, M)"
                    value={nuevaTalla}
                    onChange={(e) => setNuevaTalla(e.target.value)}
                    sx={{ flex: 1, minWidth: 90, ...miniInputStyles }}
                  />
                  <TextField
                    size="small"
                    placeholder="Color (Ej: Rojo)"
                    value={nuevoColor}
                    onChange={(e) => setNuevoColor(e.target.value)}
                    sx={{ flex: 1, minWidth: 90, ...miniInputStyles }}
                  />
                  <TextField
                    size="small"
                    type="number"
                    placeholder="Cant."
                    value={nuevaCantidad}
                    onChange={(e) => setNuevaCantidad(e.target.value)}
                    inputProps={{ min: 0 }}
                    sx={{ width: 80, ...miniInputStyles }}
                  />
                  <Button
                    type="button"
                    variant="contained"
                    disableElevation
                    onClick={handleAgregarVariante}
                    sx={{
                      height: 32,
                      bgcolor: 'var(--color-primario)',
                      color: 'var(--color-fondo)',
                      fontSize: '0.78rem',
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'var(--color-primario)' },
                    }}
                  >
                    + Agregar
                  </Button>
                </Box>

                {variantes.length > 0 && (
                  <Box
                    sx={{
                      maxHeight: 110,
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.6,
                      mt: 0.5,
                    }}
                  >
                    {variantes.map((v) => (
                      <Box
                        key={v.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          px: 1.2,
                          py: 0.3,
                          bgcolor: 'var(--color-fondo)',
                          border: '1px solid var(--color-texto-oscuro)',
                          borderRadius: '4px',
                        }}
                      >
                        <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)' }}>
                          <strong>Talla:</strong> {v.talla} | <strong>Color:</strong> {v.color} |{' '}
                          <strong>Cant:</strong> {v.cantidad}
                        </Typography>
                        <IconButton size="small" onClick={() => handleEliminarVariante(v.id)} sx={{ p: 0.2 }}>
                          ×
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}

        {form.tipo === 'servicio' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                Nombre *
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={form.nombre}
                onChange={handleChange('nombre')}
                required
                inputProps={{ autoComplete: 'off' }}
                sx={inputStyles}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                Categoría *
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={form.categoria}
                onChange={handleChange('categoria')}
                required
                sx={inputStyles}
              >
                <MenuItem value="Transporte">Transporte</MenuItem>
                <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                <MenuItem value="Consultoría">Consultoría</MenuItem>
                <MenuItem value="Otros">Otros</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                  Valor ($) *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="Ej: 15000"
                  value={form.valor}
                  onChange={handleChange('valor')}
                  required
                  inputProps={{ min: 0 }}
                  sx={inputStyles}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                  Tiempo / Duración
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={form.tiempo}
                  onChange={handleChange('tiempo')}
                  inputProps={{ autoComplete: 'off' }}
                  sx={inputStyles}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                Restricción de Edad
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={form.restriccionEdad}
                onChange={handleChange('restriccionEdad')}
                inputProps={{ autoComplete: 'off' }}
                sx={inputStyles}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                Detalles del Servicio
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={form.detallesServicio}
                onChange={handleChange('detallesServicio')}
                inputProps={{ autoComplete: 'off' }}
                sx={{
                  ...inputStyles,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    backgroundColor: 'var(--color-blanco)',
                    '& fieldset': {
                      borderColor: 'var(--color-texto-oscuro)',
                      borderWidth: '1.2px',
                    },
                  },
                }}
              />
            </Box>
          </Box>
        )}

        {form.tipo === '' && <Box sx={{ minHeight: 220 }} />}

        {/* 3. Botones inferiores estilo Figma */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, width: '100%' }}>
          {form.tipo && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              sx={botonCrearStyle}
            >
              {esEdicion
                ? 'Guardar Cambios'
                : form.tipo === 'producto'
                ? 'Crear Producto'
                : 'Crear Servicio'}
            </Button>
          )}

          {esEdicion && (
            <Button
              type="button"
              fullWidth
              variant="text"
              onClick={handleDelete}
              sx={{
                color: 'var(--color-primario)',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Eliminar Publicación
            </Button>
          )}

          <Button
            type="button"
            fullWidth
            variant="text"
            disableRipple
            onClick={handleCancelar}
            sx={botonCancelarStyle}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

const inputStyles = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    height: 34,
    backgroundColor: 'var(--color-input-blanco)',
    '& fieldset': {
      borderColor: 'var(--color-texto-oscuro)',
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
    py: 0.6,
    px: 1.2,
    fontSize: '0.88rem',
    color: 'var(--color-texto-oscuro)',
  },
};

const miniInputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    height: 32,
    backgroundColor: 'var(--color-blanco)',
    '& fieldset': {
      borderColor: 'var(--color-texto-oscuro)',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-texto-oscuro)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-primario)',
    },
  },
  '& .MuiInputBase-input': {
    py: 0.4,
    px: 1,
    fontSize: '0.82rem',
    color: 'var(--color-texto-oscuro)',
  },
};

const botonCrearStyle = {
  height: 40,
  borderRadius: '20px',
  bgcolor: 'var(--color-primario)',
  color: 'var(--color-fondo)',
  border: '1.5px solid var(--color-texto-oscuro)',
  boxShadow: '0 4px 6px rgba(44, 44, 42, 0.4)',
  fontWeight: 600,
  fontSize: '0.92rem',
  textTransform: 'none',
  '&:hover': {
    bgcolor: 'var(--color-primario)',
  },
};

const botonCancelarStyle = {
  height: 36,
  bgcolor: 'transparent',
  color: 'var(--color-primario)',
  border: 'none',
  boxShadow: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  textTransform: 'none',
  '&:hover': {
    bgcolor: 'transparent',
    color: 'var(--color-primario-hover)',
    textDecoration: 'underline',
    boxShadow: 'none',
  },
};