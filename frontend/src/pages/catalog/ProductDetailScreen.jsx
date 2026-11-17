import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TextField from '@mui/material/TextField';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Rating from '@mui/material/Rating';
import Alert from '@mui/material/Alert';

import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CustomButton from '../../components/atoms/Button/CustomButton';
import QuotationModal from '../../components/organisms/QuotationModal/QuotationModal';

export default function ProductDetailScreen({
  productos = [],
  favoritos = [],
  onToggleFavorito,
  onAddToCart,
  onCotizarDirecto,
  cartProps = {},
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados locales del producto seleccionado
  const [talla, setTalla] = useState(null);
  const [color, setColor] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [errorSeleccion, setErrorSeleccion] = useState('');

  // Modal de cotización de respaldo
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [itemsParaCotizar, setItemsParaCotizar] = useState([]);

  // Pestaña activa: 'producto' o 'vendedor'
  const [tabEvaluacion, setTabEvaluacion] = useState('producto');

  // Calificación personal para el comentario a publicar
  const [calificacionPersonal, setCalificacionPersonal] = useState(5);
  const [nuevoComentario, setNuevoComentario] = useState('');

  // Colecciones de comentarios con puntuaciones personales individuales
  const [comentariosProducto, setComentariosProducto] = useState([
    { id: 1, usuario: 'Cliente 1', fecha: 'hace 2 días', puntuacion: 4, texto: 'Excelente material y calidad.' },
    { id: 2, usuario: 'Comprador 3', fecha: 'hace 4 días', puntuacion: 5, texto: 'Muy conforme con la confección y la talla.' },
  ]);

  const [comentariosVendedor, setComentariosVendedor] = useState([
    { id: 1, usuario: 'Comprador 2', fecha: 'hace 1 semana', puntuacion: 4, texto: 'Envío rápido y muy buena atención.' },
    { id: 2, usuario: 'Cliente 4', fecha: 'hace 2 semanas', puntuacion: 3, texto: 'El pedido tardó un poco más de lo esperado pero llegó en orden.' },
  ]);

  // Búsqueda del producto en la lista en memoria
  const item = productos.find((p) => String(p.id) === String(id));
  const nombreVendedor = item?.vendedor || 'Tienda Oficial';

  const esFavorito = (prodId) => favoritos.some((f) => f.id === prodId);

  const listaTamanos = item?.tamanos || [];
  const listaColores = item?.colores || [];

  // Cálculos matemáticos sincrónicos de promedio de puntuación
  const calcularPromedio = (lista) => {
    if (!lista || lista.length === 0) return 0;
    const suma = lista.reduce((acc, curr) => acc + (Number(curr.puntuacion) || 0), 0);
    return Number((suma / lista.length).toFixed(1));
  };

  const promedioProducto = calcularPromedio(comentariosProducto);
  const promedioVendedor = calcularPromedio(comentariosVendedor);

  // Validación estricta antes de agregar o cotizar
  const validarOpciones = () => {
    if (listaTamanos.length > 0 && !talla) {
      setErrorSeleccion('Debe seleccionar una Talla antes de continuar.');
      return false;
    }
    if (listaColores.length > 0 && !color) {
      setErrorSeleccion('Debe seleccionar un Color antes de continuar.');
      return false;
    }
    setErrorSeleccion('');
    return true;
  };

  const handleAgregarAlCarrito = () => {
    if (!item) return;
    if (!validarOpciones()) return;

    if (onAddToCart) {
      onAddToCart({
        ...item,
        cantidad: Number(cantidad) || 1,
        tallaSeleccionada: talla,
        colorSeleccionado: color,
      });
    }
  };

  const handleCotizar = () => {
    if (!item) return;
    if (!validarOpciones()) return;

    const productoCotizado = {
      ...item,
      cantidad: Number(cantidad) || 1,
      tallaSeleccionada: talla,
      colorSeleccionado: color,
    };

    if (onCotizarDirecto) {
      onCotizarDirecto(productoCotizado);
    } else {
      setItemsParaCotizar([productoCotizado]);
      setIsQuotationOpen(true);
    }
  };

  const handlePublicarComentario = (e) => {
    if (e) e.preventDefault();
    if (!nuevoComentario.trim()) return;

    const nuevaEvaluacion = {
      id: Date.now(),
      usuario: 'Usuario actual',
      fecha: 'Recién',
      puntuacion: Number(calificacionPersonal) || 5,
      texto: nuevoComentario.trim(),
    };

    if (tabEvaluacion === 'producto') {
      setComentariosProducto((prev) => [nuevaEvaluacion, ...prev]);
    } else {
      setComentariosVendedor((prev) => [nuevaEvaluacion, ...prev]);
    }

    setNuevoComentario('');
    setCalificacionPersonal(5);
  };

  if (!item) {
    return (
      <MainLayout {...cartProps}>
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: 'var(--color-texto-oscuro)', mb: 2 }}>
            Producto no encontrado
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/catalog')}
            sx={{
              bgcolor: 'var(--color-primario)',
              color: 'var(--color-texto-claro)',
              borderRadius: '20px',
              textTransform: 'none',
              '&:hover': { bgcolor: 'var(--color-primario-hover)' },
            }}
          >
            Volver al Catálogo
          </Button>
        </Box>
      </MainLayout>
    );
  }

  const listaComentariosActual = tabEvaluacion === 'producto' ? comentariosProducto : comentariosVendedor;

  return (
    <MainLayout {...cartProps}>
      <Box sx={{ maxWidth: 900, mx: 'auto', pb: 4 }}>
        <Button
          onClick={() => navigate('/catalog')}
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 1.5,
            textTransform: 'none',
            color: 'var(--color-texto-oscuro)',
            fontWeight: 600,
          }}
        >
          Volver al catálogo
        </Button>

        {/* 1. SECCIÓN PRINCIPAL DE DETALLE DEL PRODUCTO */}
        <Paper
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1.5px solid var(--color-borde)',
            boxShadow: 'none',
            bgcolor: 'var(--color-fondo)',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 700 }}>
              {item.nombre}
            </Typography>
            <IconButton size="small" onClick={() => onToggleFavorito?.(item)}>
              {esFavorito(item.id) ? (
                <StarIcon sx={{ color: 'var(--color-primario)' }} />
              ) : (
                <StarBorderIcon sx={{ color: 'var(--color-texto-oscuro)' }} />
              )}
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
            <Box
              sx={{
                width: 220,
                height: 220,
                bgcolor: 'var(--color-input-bg)',
                border: '1px solid var(--color-borde)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                fontSize: '1.4rem',
                color: 'var(--color-texto-oscuro)',
                flexShrink: 0,
              }}
            >
              foto
            </Box>

            <Box sx={{ flex: 1, minWidth: 240 }}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--color-borde)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                {[
                  { label: 'Tamaño', valor: item.tamanos ? item.tamanos.join(', ') : '' },
                  { label: 'Color(es)', valor: item.colores ? item.colores.join(', ') : '' },
                  { label: 'Peso', valor: item.peso || '' },
                  { label: 'Material', valor: item.material || '' },
                ].map((campo, index) => (
                  <Box
                    key={campo.label}
                    sx={{
                      display: 'flex',
                      borderBottom: index < 3 ? '1px solid var(--color-borde)' : 'none',
                    }}
                  >
                    <Box
                      sx={{
                        width: '35%',
                        p: 0.8,
                        fontWeight: 600,
                        borderRight: '1px solid var(--color-borde)',
                        bgcolor: 'var(--color-input-bg)',
                        color: 'var(--color-texto-oscuro)',
                        fontSize: '0.88rem',
                      }}
                    >
                      {campo.label}
                    </Box>
                    <Box
                      sx={{
                        width: '65%',
                        p: 0.8,
                        color: 'var(--color-texto-oscuro)',
                        fontSize: '0.88rem',
                      }}
                    >
                      {campo.valor}
                    </Box>
                  </Box>
                ))}
              </Box>

              <Typography variant="body2" sx={{ mt: 2, color: 'var(--color-texto-oscuro)', lineHeight: 1.4 }}>
                {item.descripcion || 'Acá se incluirá una descripción del producto incluyendo los datos entregados arriba.'}
              </Typography>
            </Box>
          </Box>

          {/* Selector de Tallas */}
          {listaTamanos.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.8, color: 'var(--color-texto-oscuro)' }}>
                Talla: {talla && <strong>({talla})</strong>}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {listaTamanos.map((t) => (
                  <Button
                    key={t}
                    size="small"
                    variant={talla === t ? 'contained' : 'outlined'}
                    onClick={() => {
                      setTalla(t);
                      setErrorSeleccion('');
                    }}
                    sx={{
                      minWidth: 38,
                      height: 38,
                      borderRadius: '50%',
                      bgcolor: talla === t ? 'var(--color-primario)' : 'transparent',
                      borderColor: 'var(--color-borde)',
                      color: talla === t ? 'var(--color-texto-claro)' : 'var(--color-texto-oscuro)',
                      '&:hover': {
                        bgcolor: talla === t ? 'var(--color-primario-hover)' : 'transparent',
                        borderColor: 'var(--color-texto-oscuro)',
                      },
                    }}
                  >
                    {t}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* Selector de Colores */}
          {listaColores.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.8, color: 'var(--color-texto-oscuro)' }}>
                Color: {color && <strong>({color})</strong>}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {listaColores.map((c) => (
                  <Button
                    key={c}
                    size="small"
                    variant={color === c ? 'contained' : 'outlined'}
                    onClick={() => {
                      setColor(c);
                      setErrorSeleccion('');
                    }}
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      bgcolor: color === c ? 'var(--color-primario)' : 'transparent',
                      borderColor: 'var(--color-borde)',
                      color: color === c ? 'var(--color-texto-claro)' : 'var(--color-texto-oscuro)',
                      '&:hover': {
                        bgcolor: color === c ? 'var(--color-primario-hover)' : 'transparent',
                        borderColor: 'var(--color-texto-oscuro)',
                      },
                    }}
                  >
                    {c}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* Alerta si falta seleccionar opciones */}
          {errorSeleccion && (
            <Alert severity="warning" sx={{ mt: 2, borderRadius: '8px' }}>
              {errorSeleccion}
            </Alert>
          )}

          {/* Stepper de Cantidad y Acciones de compra */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)' }}>
              Cantidad:
            </Typography>
            <IconButton
              size="small"
              onClick={() => setCantidad((c) => Math.max(1, c - 1))}
              sx={{ color: 'var(--color-texto-oscuro)' }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <TextField
              size="small"
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, Number(e.target.value) || 1))}
              sx={{
                width: 55,
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                  color: 'var(--color-texto-oscuro)',
                  py: 0.5,
                },
              }}
            />
            <IconButton
              size="small"
              onClick={() => setCantidad((c) => c + 1)}
              sx={{ color: 'var(--color-texto-oscuro)' }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" sx={{ color: 'var(--color-borde)' }}>
              Quedan ({item.stock ?? 0}) en Stock
            </Typography>

            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CustomButton
                pill
                outlined
                fullWidth={false}
                onClick={handleCotizar}
                sx={{
                  px: 2.5,
                  height: 38,
                  fontSize: '0.9rem',
                  borderColor: 'var(--color-primario)',
                  color: 'var(--color-primario)',
                  '&:hover': {
                    borderColor: 'var(--color-primario-hover)',
                    bgcolor: 'rgba(195, 85, 43, 0.08)',
                  },
                }}
              >
                Cotizar
              </CustomButton>

              <Button
                variant="contained"
                disableElevation
                startIcon={<ShoppingCartIcon />}
                onClick={handleAgregarAlCarrito}
                sx={{
                  bgcolor: 'var(--color-primario)',
                  color: 'var(--color-texto-claro)',
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2.8,
                  height: 38,
                  '&:hover': {
                    bgcolor: 'var(--color-primario-hover)',
                  },
                }}
              >
                Agregar
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* 2. CONTENEDOR DE EVALUACIONES Y COMENTARIOS */}
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: '16px',
            border: '1.5px solid var(--color-borde)',
            bgcolor: 'var(--color-fondo)',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              border: '1px solid var(--color-borde)',
              borderRadius: '12px',
              overflow: 'hidden',
              bgcolor: 'var(--color-fondo)',
            }}
          >
            {/* Lado Vendedor */}
            <Box
              onClick={() => setTabEvaluacion('vendedor')}
              sx={{
                flex: 1,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.8,
                cursor: 'pointer',
                bgcolor: tabEvaluacion === 'vendedor' ? 'rgba(195, 85, 43, 0.12)' : 'transparent',
                borderRight: { xs: 'none', md: '1px solid var(--color-borde)' },
                borderBottom: { xs: '1px solid var(--color-borde)', md: 'none' },
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(195, 85, 43, 0.08)',
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: tabEvaluacion === 'vendedor' ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                  textAlign: 'center',
                }}
              >
                Vendedor: ({nombreVendedor})
              </Typography>
              <Rating
                value={promedioVendedor}
                precision={0.1}
                readOnly
                sx={{
                  color: 'var(--color-primario)',
                  '& .MuiRating-iconEmpty': { color: 'var(--color-borde)' },
                }}
              />
              <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>
                Promedio: {promedioVendedor} ({comentariosVendedor.length} {comentariosVendedor.length === 1 ? 'opinión' : 'opiniones'})
              </Typography>
            </Box>

            {/* Lado Producto/Servicio */}
            <Box
              onClick={() => setTabEvaluacion('producto')}
              sx={{
                flex: 1,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.8,
                cursor: 'pointer',
                bgcolor: tabEvaluacion === 'producto' ? 'rgba(195, 85, 43, 0.12)' : 'transparent',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(195, 85, 43, 0.08)',
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: tabEvaluacion === 'producto' ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                  textAlign: 'center',
                }}
              >
                Nombre: ({item.nombre})
              </Typography>
              <Rating
                value={promedioProducto}
                precision={0.1}
                readOnly
                sx={{
                  color: 'var(--color-primario)',
                  '& .MuiRating-iconEmpty': { color: 'var(--color-borde)' },
                }}
              />
              <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>
                Promedio: {promedioProducto} ({comentariosProducto.length} {comentariosProducto.length === 1 ? 'opinión' : 'opiniones'})
              </Typography>
            </Box>
          </Box>

          {/* Formulario de Comentario */}
          <Box
            component="form"
            onSubmit={handlePublicarComentario}
            sx={{
              p: 2.5,
              border: '1px solid var(--color-borde)',
              borderRadius: '12px',
              bgcolor: 'var(--color-fondo)',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: 'var(--color-texto-oscuro)' }}>
              {tabEvaluacion === 'producto'
                ? 'Ingrese sus Comentarios del (Producto/Servicio):'
                : `Ingrese sus Comentarios del Vendedor (${nombreVendedor}):`}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-texto-oscuro)', fontSize: '0.88rem' }}>
                Tu puntuación:
              </Typography>
              <Rating
                value={calificacionPersonal}
                onChange={(_, val) => setCalificacionPersonal(val || 1)}
                sx={{
                  color: 'var(--color-primario)',
                  '& .MuiRating-iconEmpty': { color: 'var(--color-borde)' },
                }}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Escriba acá ..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
              <Button
                type="submit"
                sx={{
                  bgcolor: 'var(--color-primario)',
                  color: 'var(--color-texto-claro)',
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3.5,
                  height: 36,
                  '&:hover': {
                    bgcolor: 'var(--color-primario-hover)',
                  },
                }}
              >
                Publicar
              </Button>
            </Box>
          </Box>

          {/* Listado de Comentarios */}
          <Box
            sx={{
              p: 2.5,
              border: '1px solid var(--color-borde)',
              borderRadius: '12px',
              bgcolor: 'var(--color-fondo)',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: 'var(--color-texto-oscuro)' }}>
              {tabEvaluacion === 'producto'
                ? 'Comentarios del (Producto/Servicio):'
                : `Comentarios del Vendedor (${nombreVendedor}):`}
            </Typography>

            <Box
              sx={{
                width: '100%',
                minHeight: 140,
                maxHeight: 280,
                border: '1px solid var(--color-borde)',
                borderRadius: '4px',
                bgcolor: 'var(--color-input-bg)',
                p: 2,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                boxSizing: 'border-box',
              }}
            >
              {listaComentariosActual.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'var(--color-borde)', fontStyle: 'italic', m: 'auto' }}>
                  No hay comentarios aún. ¡Sé el primero en opinar!
                </Typography>
              ) : (
                listaComentariosActual.map((c) => (
                  <Box
                    key={c.id}
                    sx={{
                      p: 1.5,
                      bgcolor: 'var(--color-fondo)',
                      borderRadius: '8px',
                      border: '1px solid var(--color-borde)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.6,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primario)' }}>
                          {c.usuario}
                        </Typography>
                        <Rating
                          value={c.puntuacion || 5}
                          readOnly
                          size="small"
                          sx={{
                            color: 'var(--color-primario)',
                            '& .MuiRating-iconEmpty': { color: 'var(--color-borde)' },
                          }}
                        />
                      </Box>
                      <Typography sx={{ fontSize: '0.75rem', color: 'var(--color-borde)' }}>
                        {c.fecha}
                      </Typography>
                    </Box>

                    <Typography sx={{ fontSize: '0.88rem', color: 'var(--color-texto-oscuro)' }}>
                      {c.texto}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Paper>

        <QuotationModal
          open={isQuotationOpen}
          onClose={() => setIsQuotationOpen(false)}
          itemsCotizados={itemsParaCotizar}
          totalCotizado={itemsParaCotizar.reduce(
            (acc, prod) => acc + (Number(prod.valor) || 0) * (Number(prod.cantidad) || 1),
            0
          )}
        />
      </Box>
    </MainLayout>
  );
}