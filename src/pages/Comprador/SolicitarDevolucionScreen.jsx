import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CustomButton from '../../components/atoms/Button/CustomButton';

export default function SolicitarDevolucionScreen({ cartProps = {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  const pedido = location.state?.pedido || {
    id: 1,
    nombre: 'Pedido 1',
    producto: 'Polera Deportiva Roja',
    cantidad: 1,
    total: 24000,
  };

  const [motivo, setMotivo] = useState('');
  const [comentario, setComentario] = useState('');
  const [fotosAdjuntas, setFotosAdjuntas] = useState(['foto_miniatura_1']);

  const handleAgregarFotoSimulada = () => {
    setFotosAdjuntas((prev) => [...prev, `foto_miniatura_${prev.length + 1}`]);
  };

  const handleQuitarFoto = (index) => {
    setFotosAdjuntas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEnviar = (e) => {
    if (e) e.preventDefault();
    if (!motivo) {
      alert('Por favor seleccione un motivo de devolución.');
      return;
    }
    console.log('Solicitud enviada:', {
      pedidoId: pedido.id,
      producto: pedido.producto,
      motivo,
      comentario,
      fotosAdjuntas,
    });
    alert('Solicitud de devolución enviada correctamente.');
    navigate('/pedidos');
  };

  const handleCancelar = () => {
    navigate('/pedidos');
  };

  const formatCLP = (monto) => Number(monto || 0).toLocaleString('es-CL');

  return (
    <MainLayout {...cartProps}>
      <Box
        sx={{
          maxWidth: 900,
          mx: 'auto',
          border: '1.5px solid var(--color-borde)',
          borderRadius: '16px',
          bgcolor: 'var(--color-fondo)',
          boxShadow: '0 8px 24px rgba(44, 44, 42, 0.08)',
          overflow: 'hidden',
          p: { xs: 2.5, sm: 4 },
          boxSizing: 'border-box',
        }}
      >
        <Box
          component="form"
          onSubmit={handleEnviar}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', md: 240 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 170,
                height: 170,
                bgcolor: 'var(--color-input-bg)',
                border: '1px solid var(--color-borde)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                color: 'var(--color-texto-oscuro)',
                mb: 2,
              }}
            >
              foto
            </Box>

            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-texto-oscuro)' }}>
              {pedido.producto || 'Nombre producto'}
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', color: 'var(--color-texto-oscuro)' }}>
              Cant: {pedido.cantidad || 1}
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', color: 'var(--color-texto-oscuro)' }}>
              Precio: ${formatCLP(pedido.total || 0)}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: 'var(--color-texto-oscuro)',
                  mb: 0.8,
                }}
              >
                Motivo de devolucion
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={motivo}
                  displayEmpty
                  onChange={(e) => setMotivo(e.target.value)}
                  sx={{
                    bgcolor: 'var(--color-input-bg)',
                    borderRadius: '4px',
                    color: 'var(--color-texto-oscuro)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--color-borde)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--color-texto-oscuro)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--color-primario)',
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Selecciona un motivo...</em>
                  </MenuItem>
                  <MenuItem value="defectuoso">Producto defectuoso o dañado</MenuItem>
                  <MenuItem value="talla-incorrecta">Talla o medida equivocada</MenuItem>
                  <MenuItem value="no-corresponde">No coincide con la descripción</MenuItem>
                  <MenuItem value="retraso">Llegó fuera del plazo acordado</MenuItem>
                  <MenuItem value="otro">Otro motivo</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: 'var(--color-texto-oscuro)',
                  mb: 0.8,
                }}
              >
                Comentario adicional
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Escriba acá ..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                sx={{
                  bgcolor: 'var(--color-input-bg)',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    '& fieldset': { borderColor: 'var(--color-borde)' },
                    '&:hover fieldset': { borderColor: 'var(--color-texto-oscuro)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primario)' },
                  },
                  '& .MuiInputBase-input': {
                    color: 'var(--color-texto-oscuro)',
                    fontSize: '0.9rem',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: 'var(--color-texto-oscuro)',
                  mb: 0.8,
                }}
              >
                Foto del producto (opcional)
              </Typography>

              <Box
                onClick={handleAgregarFotoSimulada}
                sx={{
                  border: '1.5px dashed var(--color-primario)',
                  borderRadius: '4px',
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  bgcolor: 'var(--color-fondo)',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(195, 85, 43, 0.05)',
                  },
                }}
              >
                <AddIcon sx={{ color: 'var(--color-texto-oscuro)', fontSize: '2rem' }} />
              </Box>

              {fotosAdjuntas.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, flexWrap: 'wrap' }}>
                  {fotosAdjuntas.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 55,
                        height: 55,
                        bgcolor: 'var(--color-input-bg)',
                        border: '1px solid var(--color-borde)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        color: 'var(--color-texto-oscuro)',
                      }}
                    >
                      foto
                      <IconButton
                        size="small"
                        onClick={() => handleQuitarFoto(index)}
                        sx={{
                          position: 'absolute',
                          top: -7,
                          right: -7,
                          bgcolor: 'var(--color-texto-oscuro)',
                          color: 'var(--color-texto-claro)',
                          width: 18,
                          height: 18,
                          p: 0,
                          '&:hover': {
                            bgcolor: 'var(--color-primario)',
                          },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: '0.75rem' }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <CustomButton
                  pill
                  type="submit"
                  sx={{ height: 42, fontSize: '0.95rem' }}
                >
                  Enviar solicitud
                </CustomButton>
              </Box>

              <Box sx={{ flex: 1 }}>
                <CustomButton
                  pill
                  outlined
                  onClick={handleCancelar}
                  sx={{
                    height: 42,
                    fontSize: '0.95rem',
                    bgcolor: 'var(--color-input-bg)',
                    borderColor: 'var(--color-texto-oscuro)',
                  }}
                >
                  Cancelar
                </CustomButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}