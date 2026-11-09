import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import { chileData, getComunasDeRegion, todasLasRegiones } from '../../data/chileData';

export default function ZonaFormScreen({ zonas = [], onGuardarZona, cartProps = {} }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState({
    nombre: '',
    region: 'Metropolitana de Santiago',
    comunas: ['Santiago', 'Providencia', 'Las Condes'],
    tiempoEntrega: '24 horas',
    tarifaBase: 2900,
    costoKiloExtra: 500,
    kilosIncluidos: 2,
    habilitada: true,
  });

  const [simulador, setSimulador] = useState({
    largo: 30,
    ancho: 20,
    alto: 15,
    peso: 3,
  });

  useEffect(() => {
    if (esEdicion) {
      const encontrada = zonas.find((z) => String(z.id) === String(id));
      if (encontrada) {
        setForm({ ...encontrada });
      }
    }
  }, [id, esEdicion, zonas]);

  const formatCLP = (m) => Number(m || 0).toLocaleString('es-CL');

  const calcularEnvio = () => {
    const base = Number(form.tarifaBase) || 0;
    const extra = Math.max(0, (Number(simulador.peso) || 0) - (Number(form.kilosIncluidos) || 0)) * (Number(form.costoKiloExtra) || 0);
    return base + extra;
  };

  const handleCambioRegion = (nuevaRegion) => {
    const comunasDisponibles = getComunasDeRegion(nuevaRegion);
    setForm({
      ...form,
      region: nuevaRegion,
      // Al cambiar de región, selecciona las primeras 3 por defecto
      comunas: comunasDisponibles.slice(0, 3),
    });
  };

  const handleToggleComuna = (comuna) => {
    setForm((prev) => {
      const existe = prev.comunas.includes(comuna);
      if (existe) {
        return { ...prev, comunas: prev.comunas.filter((c) => c !== comuna) };
      }
      return { ...prev, comunas: [...prev.comunas, comuna] };
    });
  };

  const handleSeleccionarTodasComunas = () => {
    const todas = getComunasDeRegion(form.region);
    setForm((prev) => ({ ...prev, comunas: todas }));
  };

  const handleLimpiarComunas = () => {
    setForm((prev) => ({ ...prev, comunas: [] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onGuardarZona) {
      onGuardarZona({
        ...form,
        id: esEdicion ? Number(id) : Date.now(),
        ciudad: form.comunas[0] || 'Zona',
      });
    }
    navigate('/admin/transporte');
  };

  const comunasDeLaRegionActual = getComunasDeRegion(form.region);

  return (
    <MainLayout {...cartProps}>
      <Box sx={{ maxWidth: 880, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/transporte')}
          sx={{ textTransform: 'none', color: 'var(--color-texto-oscuro)', mb: 2 }}
        >
          Volver a Costos de Envío
        </Button>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.2,
            bgcolor: 'var(--color-fondo)',
            p: { xs: 2, sm: 3.5 },
            border: '1.5px solid var(--color-borde)',
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(44, 44, 42, 0.08)',
          }}
        >
          <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-texto-oscuro)' }}>
            {esEdicion ? 'Editar Zona' : 'Agregar Zona'}
          </Typography>

          <Box>
            <Typography sx={labelFormStyle}>Nombre de la zona</Typography>
            <TextField
              fullWidth
              size="small"
              required
              placeholder="Ej: Santiago Centro y Oriente"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              sx={inputRectStyle}
            />
          </Box>

          {/* Selector de Región con todas las 16 regiones de Chile */}
          <Box>
            <Typography sx={labelFormStyle}>Región de Chile</Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={form.region}
              onChange={(e) => handleCambioRegion(e.target.value)}
              sx={inputRectStyle}
            >
              {todasLasRegiones.map((reg) => (
                <MenuItem key={reg} value={reg}>
                  {reg}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Comunas accesibles de la región seleccionada */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8, flexWrap: 'wrap', gap: 1 }}>
              <Typography sx={labelFormStyle}>
                Comunas accesibles ({form.comunas.length} de {comunasDeLaRegionActual.length} seleccionadas)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  type="button"
                  onClick={handleSeleccionarTodasComunas}
                  sx={{ textTransform: 'none', fontSize: '0.78rem', color: 'var(--color-primario)', py: 0 }}
                >
                  Seleccionar todas
                </Button>
                <Button
                  size="small"
                  type="button"
                  onClick={handleLimpiarComunas}
                  sx={{ textTransform: 'none', fontSize: '0.78rem', color: 'var(--color-borde)', py: 0 }}
                >
                  Limpiar
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                border: '1.2px solid var(--color-texto-oscuro)',
                borderRadius: '4px',
                minHeight: 180,
                maxHeight: 250,
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                alignContent: 'flex-start',
                bgcolor: 'var(--color-input-bg)',
              }}
            >
              {comunasDeLaRegionActual.map((com) => {
                const seleccionada = form.comunas.includes(com);
                return (
                  <Chip
                    key={com}
                    label={com}
                    clickable
                    onClick={() => handleToggleComuna(com)}
                    sx={{
                      borderRadius: '16px',
                      border: '1px solid var(--color-texto-oscuro)',
                      bgcolor: seleccionada ? 'var(--color-primario)' : 'var(--color-fondo)',
                      color: seleccionada ? 'var(--color-texto-claro)' : 'var(--color-texto-oscuro)',
                      fontWeight: seleccionada ? 700 : 500,
                      boxShadow: seleccionada ? '0 1px 3px rgba(44, 44, 42, 0.2)' : 'none',
                      '&:hover': {
                        bgcolor: seleccionada ? 'var(--color-primario-hover, var(--color-primario))' : 'rgba(195, 85, 43, 0.1)',
                      },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography sx={labelPillStyle}>Tarifa base ($)</Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={form.tarifaBase}
                onChange={(e) => setForm({ ...form, tarifaBase: Number(e.target.value) })}
                sx={inputPillStyle}
              />
            </Box>

            <Box>
              <Typography sx={labelPillStyle}>Costo por kilo extra ($)</Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={form.costoKiloExtra}
                onChange={(e) => setForm({ ...form, costoKiloExtra: Number(e.target.value) })}
                sx={inputPillStyle}
              />
            </Box>

            <Box>
              <Typography sx={labelPillStyle}>Kilos incluidos en base</Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={form.kilosIncluidos}
                onChange={(e) => setForm({ ...form, kilosIncluidos: Number(e.target.value) })}
                sx={inputPillStyle}
              />
            </Box>

            <Box>
              <Typography sx={labelPillStyle}>Tiempo de entrega estimado</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="24 horas"
                value={form.tiempoEntrega}
                onChange={(e) => setForm({ ...form, tiempoEntrega: e.target.value })}
                sx={inputPillStyle}
              />
            </Box>
          </Box>

          <Box
            sx={{
              border: '1.2px solid var(--color-texto-oscuro)',
              borderRadius: '4px',
              p: '12px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: 'var(--color-fondo)',
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
              Zona habilitada: {form.habilitada ? 'Sí' : 'No'}
            </Typography>
            <Button
              type="button"
              variant="contained"
              disableElevation
              onClick={() => setForm({ ...form, habilitada: !form.habilitada })}
              sx={{
                borderRadius: '18px',
                bgcolor: form.habilitada ? 'var(--color-primario)' : 'var(--color-input-bg)',
                color: form.habilitada ? 'var(--color-texto-claro)' : 'var(--color-texto-oscuro)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                px: 2,
                border: '1px solid var(--color-texto-oscuro)',
                boxShadow: '0 2px 4px rgba(44, 44, 42, 0.25)',
              }}
            >
              Habilitar o desactivar
            </Button>
          </Box>

          {/* Simulador de dimensiones */}
          <Box
            sx={{
              border: '1.2px solid var(--color-texto-oscuro)',
              borderRadius: '4px',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              bgcolor: 'var(--color-fondo)',
            }}
          >
            <Typography sx={{ fontSize: '0.82rem', color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>
              Dimensión del paquete
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                type="number"
                value={simulador.largo}
                onChange={(e) => setSimulador({ ...simulador, largo: e.target.value })}
                sx={inputMiniPillStyle}
              />
              <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>Largo</Typography>

              <TextField
                size="small"
                type="number"
                value={simulador.ancho}
                onChange={(e) => setSimulador({ ...simulador, ancho: e.target.value })}
                sx={inputMiniPillStyle}
              />
              <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>Ancho</Typography>

              <TextField
                size="small"
                type="number"
                value={simulador.alto}
                onChange={(e) => setSimulador({ ...simulador, alto: e.target.value })}
                sx={inputMiniPillStyle}
              />
              <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>Alto</Typography>

              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TextField
                  size="small"
                  type="number"
                  value={simulador.peso}
                  onChange={(e) => setSimulador({ ...simulador, peso: e.target.value })}
                  sx={inputMiniPillStyle}
                />
                <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>kg</Typography>
              </Box>
            </Box>

            <Typography sx={{ fontSize: '0.88rem', color: 'var(--color-texto-oscuro)', mt: 0.5 }}>
              El cliente pagaría <strong>${formatCLP(calcularEnvio())}</strong> de envío
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              sx={{
                flex: 1,
                height: 40,
                borderRadius: '20px',
                bgcolor: 'var(--color-primario)',
                color: 'var(--color-texto-claro)',
                border: '1.2px solid var(--color-texto-oscuro)',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 3px 6px rgba(44, 44, 42, 0.3)',
                '&:hover': { bgcolor: 'var(--color-primario-hover, var(--color-primario))' },
              }}
            >
              Guardar Zona
            </Button>

            <Button
              type="button"
              variant="contained"
              disableElevation
              onClick={() => navigate('/admin/transporte')}
              sx={{
                flex: 1,
                height: 40,
                borderRadius: '20px',
                bgcolor: 'var(--color-input-bg)',
                color: 'var(--color-texto-oscuro)',
                border: '1.2px solid var(--color-texto-oscuro)',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' },
              }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}

const labelFormStyle = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--color-texto-oscuro)',
  mb: 0.5,
};

const labelPillStyle = {
  fontSize: '0.78rem',
  color: 'var(--color-borde)',
  fontWeight: 600,
  mb: 0.3,
  pl: 0.5,
};

const inputRectStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '2px',
    bgcolor: 'var(--color-fondo)',
    '& fieldset': { borderColor: 'var(--color-texto-oscuro)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-primario)' },
  },
  '& .MuiInputBase-input': {
    color: 'var(--color-texto-oscuro)',
    fontSize: '0.88rem',
    py: 0.8,
  },
};

const inputPillStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    bgcolor: 'var(--color-input-bg)',
    '& fieldset': { borderColor: 'var(--color-texto-oscuro)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-primario)' },
  },
  '& .MuiInputBase-input': {
    color: 'var(--color-texto-oscuro)',
    fontSize: '0.86rem',
    py: 0.5,
    px: 1.5,
  },
};

const inputMiniPillStyle = {
  width: 58,
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    bgcolor: 'var(--color-input-bg)',
    '& fieldset': { borderColor: 'var(--color-texto-oscuro)' },
  },
  '& .MuiInputBase-input': {
    py: 0.3,
    px: 0.8,
    fontSize: '0.82rem',
    textAlign: 'center',
  },
};