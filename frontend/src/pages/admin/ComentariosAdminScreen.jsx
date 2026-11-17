import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import CloseIcon from '@mui/icons-material/Close';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

const catalogoAdminMock = {
  1: {
    id: 1,
    nombre: 'Polera Deportiva',
    tipo: 'producto',
    valor: 12000,
    stock: 5,
    tamanos: ['S', 'M', 'L'],
    colores: ['Rojo', 'Amarillo', 'Verde', 'Naranjo'],
    vendedor: 'Tienda Oficial',
    descripcion: 'Polera deportiva de algodón peinado de alta densidad con costuras reforzadas.',
    peso: '0.35 kg',
    materialPrincipal: 'Algodón 100%',
  },
  2: {
    id: 2,
    nombre: 'Producto 2 (Calzado Urbano)',
    tipo: 'producto',
    valor: 7000,
    stock: 3,
    tamanos: ['36', '37', '38'],
    colores: ['Rojo'],
    vendedor: 'Tienda Oficial',
    descripcion: 'Zapatillas casuales urbanas con suela antideslizante y forro transpirable.',
    peso: '0.8 kg',
    materialPrincipal: 'Lona reforzada',
  },
  3: {
    id: 3,
    nombre: 'Producto 3 (Manta Artesanal)',
    tipo: 'producto',
    valor: 12000,
    stock: 8,
    tamanos: ['40', '41'],
    colores: ['Verde'],
    vendedor: 'Textiles del Sur',
    descripcion: 'Manta tejida en lana natural con teñido orgánico de la zona sur.',
    peso: '1.2 kg',
    materialPrincipal: 'Lana de oveja',
  },
};

const comentariosIniciales = [
  {
    id: 1,
    usuario: 'Juan Pérez',
    texto: 'Excelente confección de la polera y despacho dentro del plazo prometido.',
    tipo: 'producto',
    itemNombre: 'Polera Deportiva',
    productId: 1,
    vendedor: 'Tienda Oficial',
    rating: 5,
    fecha: '2026-11-01',
  },
  {
    id: 2,
    usuario: 'María López',
    texto: 'La tela es de muy buena calidad pero el enlace de transporte tardó dos días más.',
    tipo: 'producto',
    itemNombre: 'Producto 2 (Calzado Urbano)',
    productId: 2,
    vendedor: 'Tienda Oficial',
    rating: 4,
    fecha: '2026-10-30',
  },
  {
    id: 3,
    usuario: 'Carlos Rojas',
    texto: 'Muy buena disposición del vendedor para responder dudas de stock.',
    tipo: 'vendedor',
    itemNombre: 'Atención Comercial',
    productId: null,
    vendedor: 'Textiles del Sur',
    rating: 5,
    fecha: '2026-10-28',
  },
  {
    id: 4,
    usuario: 'Ana Morales',
    texto: 'El comprobante y embalaje llegaron en perfecto estado.',
    tipo: 'vendedor',
    itemNombre: 'Servicio de Embalaje',
    productId: null,
    vendedor: 'Textiles del Sur',
    rating: 4,
    fecha: '2026-10-25',
  },
  {
    id: 5,
    usuario: 'Pedro Soto',
    texto: 'Hubo retraso en la entrega en sucursal y la caja venía algo doblada.',
    tipo: 'producto',
    itemNombre: 'Producto 3 (Manta Artesanal)',
    productId: 3,
    vendedor: 'Textiles del Sur',
    rating: 2,
    fecha: '2026-10-22',
  },
  {
    id: 6,
    usuario: 'Camila Rojas',
    texto: 'La polera quedó perfecta, muy cómoda y fresca.',
    tipo: 'producto',
    itemNombre: 'Polera Deportiva',
    productId: 1,
    vendedor: 'Tienda Oficial',
    rating: 5,
    fecha: '2026-10-20',
  },
  {
    id: 7,
    usuario: 'Diego Fuentes',
    texto: 'Demoraron en contestar los mensajes durante el fin de semana.',
    tipo: 'vendedor',
    itemNombre: 'Canal de Soporte',
    productId: null,
    vendedor: 'Artesanías Andinas',
    rating: 3,
    fecha: '2026-10-18',
  },
  {
    id: 8,
    usuario: 'Beatriz Castro',
    texto: 'El producto llegó con una costura suelta. Solicité cambio.',
    tipo: 'producto',
    itemNombre: 'Polera Deportiva',
    productId: 1,
    vendedor: 'Tienda Oficial',
    rating: 1,
    fecha: '2026-10-15',
  },
];

const ITEMS_POR_PAGINA = 4;

export default function ComentariosAdminScreen({ cartProps = {} }) {
  const navigate = useNavigate();

  const [comentarios, setComentarios] = useState(comentariosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroVendedor, setFiltroVendedor] = useState('todos');
  const [filtroEstrellas, setFiltroEstrellas] = useState('todas');
  const [paginaActual, setPaginaActual] = useState(1);

  const [detalleProductoModal, setDetalleProductoModal] = useState({
    open: false,
    producto: null,
  });

  const listaVendedores = useMemo(() => {
    return ['todos', ...new Set(comentarios.map((c) => c.vendedor))];
  }, [comentarios]);

  const handleFiltrarPorVendedor = (vendedorNombre) => {
    setFiltroVendedor(vendedorNombre);
    setPaginaActual(1);
  };

  const handleAbrirDetalleAdmin = (productId) => {
    if (!productId) return;
    const productoEncontrado = catalogoAdminMock[productId] || {
      id: productId,
      nombre: 'Ítem en Catálogo',
      valor: 0,
      stock: 0,
      vendedor: 'No especificado',
      descripcion: 'Información registrada en el catálogo general.',
    };

    console.log('[BACKEND PENDIENTE] GET /api/admin/productos/' + productId + '/auditar', productoEncontrado);

    setDetalleProductoModal({
      open: true,
      producto: productoEncontrado,
    });
  };

  const handleCerrarDetalleAdmin = () => {
    setDetalleProductoModal({ open: false, producto: null });
  };

  const comentariosFiltrados = useMemo(() => {
    return comentarios.filter((c) => {
      const matchBusqueda =
        c.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.texto.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.itemNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.vendedor.toLowerCase().includes(busqueda.toLowerCase());

      const matchTipo = filtroTipo === 'todos' || c.tipo === filtroTipo;
      const matchVendedor = filtroVendedor === 'todos' || c.vendedor === filtroVendedor;
      const matchEstrellas = filtroEstrellas === 'todas' || c.rating === Number(filtroEstrellas);

      return matchBusqueda && matchTipo && matchVendedor && matchEstrellas;
    });
  }, [comentarios, busqueda, filtroTipo, filtroVendedor, filtroEstrellas]);

  const totalPaginas = Math.ceil(comentariosFiltrados.length / ITEMS_POR_PAGINA) || 1;
  const comentariosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    return comentariosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [comentariosFiltrados, paginaActual]);

  const handleCambioPagina = (event, valor) => {
    setPaginaActual(valor);
  };

  const handleEliminarComentario = (id) => {
    console.log('[BACKEND PENDIENTE] DELETE /api/admin/comentarios/' + id);
    setComentarios((prev) => prev.filter((c) => c.id !== id));
  };

  // Comentarios específicos del producto abierto en el modal
  const comentariosDelProductoModal = useMemo(() => {
    if (!detalleProductoModal.producto) return [];
    return comentarios.filter(
      (c) => c.productId === detalleProductoModal.producto.id && c.tipo === 'producto'
    );
  }, [comentarios, detalleProductoModal.producto]);

  const promedioProductoModal = useMemo(() => {
    if (comentariosDelProductoModal.length === 0) return '0.0';
    const suma = comentariosDelProductoModal.reduce((acc, c) => acc + c.rating, 0);
    return (suma / comentariosDelProductoModal.length).toFixed(1);
  }, [comentariosDelProductoModal]);

  const promedioCalculado = (
    comentariosFiltrados.reduce((acc, c) => acc + c.rating, 0) / (comentariosFiltrados.length || 1)
  ).toFixed(1);

  const formatCLP = (m) => Number(m || 0).toLocaleString('es-CL');

  return (
    <MainLayout {...cartProps}>
      <Box sx={{ maxWidth: 960, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          sx={{
            textTransform: 'none',
            color: 'var(--color-texto-oscuro)',
            fontWeight: 600,
            fontSize: '0.95rem',
            mb: 2.5,
            borderRadius: '12px',
            px: 1.5,
            py: 0.6,
            '&:hover': {
              bgcolor: 'rgba(195, 85, 43, 0.08)',
              color: 'var(--color-primario)',
            },
          }}
        >
          Volver a Administrar
        </Button>

        <Box
          sx={{
            border: '1.5px solid var(--color-texto-oscuro)',
            borderRadius: '24px',
            p: { xs: 2.5, md: 3.5 },
            bgcolor: 'var(--color-fondo)',
            boxShadow: '0 8px 24px rgba(44, 44, 42, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 1.5,
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primario)' }}>
                Auditoría y Comentarios de Usuarios
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontSize: '0.82rem' }}>
                {filtroVendedor !== 'todos'
                  ? `Mostrando opiniones y productos de: "${filtroVendedor}"`
                  : 'Monitoreo consolidado de reseñas de todos los vendedores y productos'}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'var(--color-input-bg)',
                p: 1,
                px: 2,
                borderRadius: '16px',
                border: '1px solid var(--color-borde)',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--color-texto-oscuro)' }}>
                {filtroVendedor !== 'todos' ? 'Promedio Vendedor:' : 'Promedio General:'} {promedioCalculado}
              </Typography>
              <Rating
                value={Number(promedioCalculado)}
                precision={0.1}
                size="small"
                readOnly
                sx={{ color: 'var(--color-primario)' }}
              />
            </Box>
          </Box>

          {filtroVendedor !== 'todos' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<StorefrontIcon fontSize="small" />}
                label={`Filtrado por: ${filtroVendedor}`}
                onDelete={() => setFiltroVendedor('todos')}
                sx={{
                  bgcolor: 'var(--color-primario)',
                  color: 'var(--color-texto-claro)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  '& .MuiChip-deleteIcon': { color: 'var(--color-texto-claro)' },
                }}
              />
              <Button
                size="small"
                startIcon={<FilterAltOffIcon />}
                onClick={() => setFiltroVendedor('todos')}
                sx={{ textTransform: 'none', color: 'var(--color-texto-oscuro)', fontSize: '0.8rem' }}
              >
                Ver todos los vendedores
              </Button>
            </Box>
          )}

          <Divider sx={{ borderColor: 'var(--color-borde)' }} />

          {/* BARRA DE BÚSQUEDA Y FILTROS */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr 1fr' }, gap: 1.5 }}>
            <TextField
              size="small"
              placeholder="Buscar por usuario, texto o ítem..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'var(--color-borde)' }} />
                  </InputAdornment>
                ),
              }}
              sx={filtroInputStyle}
            />

            <TextField
              select
              size="small"
              value={filtroTipo}
              onChange={(e) => {
                setFiltroTipo(e.target.value);
                setPaginaActual(1);
              }}
              sx={filtroInputStyle}
            >
              <MenuItem value="todos">Todos los Tipos</MenuItem>
              <MenuItem value="producto">Solo Productos</MenuItem>
              <MenuItem value="vendedor">Solo Vendedores</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              value={filtroVendedor}
              onChange={(e) => {
                setFiltroVendedor(e.target.value);
                setPaginaActual(1);
              }}
              sx={filtroInputStyle}
            >
              {listaVendedores.map((vend) => (
                <MenuItem key={vend} value={vend}>
                  {vend === 'todos' ? 'Todos los Vendedores' : vend}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              value={filtroEstrellas}
              onChange={(e) => {
                setFiltroEstrellas(e.target.value);
                setPaginaActual(1);
              }}
              sx={filtroInputStyle}
            >
              <MenuItem value="todas">Puntuación (Todas)</MenuItem>
              <MenuItem value="5">⭐⭐⭐⭐⭐ (5)</MenuItem>
              <MenuItem value="4">⭐⭐⭐⭐ (4)</MenuItem>
              <MenuItem value="3">⭐⭐⭐ (3)</MenuItem>
              <MenuItem value="2">⭐⭐ (2)</MenuItem>
              <MenuItem value="1">⭐ (1)</MenuItem>
            </TextField>
          </Box>

          {/* LISTA DE RESEÑAS */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 300 }}>
            {comentariosPaginados.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'var(--color-borde)' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  No se encontraron comentarios para esta consulta.
                </Typography>
              </Box>
            ) : (
              comentariosPaginados.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    border: '1.2px solid var(--color-texto-oscuro)',
                    borderRadius: '16px',
                    p: 2,
                    bgcolor: 'var(--color-input-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'var(--color-primario)',
                      boxShadow: '0 4px 12px rgba(44, 44, 42, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-texto-oscuro)' }}>
                        {item.usuario}
                      </Typography>
                      <Chip
                        icon={item.tipo === 'vendedor' ? <StorefrontIcon sx={{ fontSize: '14px !important' }} /> : <Inventory2OutlinedIcon sx={{ fontSize: '14px !important' }} />}
                        label={item.tipo === 'vendedor' ? 'Vendedor' : 'Producto/Servicio'}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          bgcolor: item.tipo === 'vendedor' ? 'rgba(195, 85, 43, 0.15)' : 'rgba(44, 44, 42, 0.08)',
                          color: item.tipo === 'vendedor' ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Rating value={item.rating} size="small" readOnly sx={{ color: 'var(--color-primario)' }} />
                      <Typography variant="caption" sx={{ color: 'var(--color-borde)' }}>
                        {item.fecha}
                      </Typography>
                      <IconButton
                        size="small"
                        title="Eliminar comentario"
                        onClick={() => handleEliminarComentario(item.id)}
                        sx={{ color: 'var(--color-texto-oscuro)', '&:hover': { color: '#d32f2f' } }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Tooltip title={`Filtrar y auditar todo de: ${item.vendedor}`} arrow>
                      <Box
                        onClick={() => handleFiltrarPorVendedor(item.vendedor)}
                        sx={{
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: 'var(--color-primario)',
                          bgcolor: 'rgba(195, 85, 43, 0.08)',
                          px: 1,
                          py: 0.3,
                          borderRadius: '8px',
                          border: '1px dashed var(--color-primario)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'rgba(195, 85, 43, 0.18)',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        <StorefrontIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                          Vendedor: {item.vendedor}
                        </Typography>
                      </Box>
                    </Tooltip>

                    {item.productId ? (
                      <Tooltip title="Ver ficha técnica y opiniones del ítem" arrow>
                        <Box
                          onClick={() => handleAbrirDetalleAdmin(item.productId)}
                          sx={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.6,
                            color: 'var(--color-texto-oscuro)',
                            bgcolor: 'rgba(0, 0, 0, 0.05)',
                            px: 1.2,
                            py: 0.4,
                            borderRadius: '8px',
                            border: '1.2px solid var(--color-borde)',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.1)',
                              borderColor: 'var(--color-texto-oscuro)',
                              color: 'var(--color-primario)',
                            },
                          }}
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: 15, color: 'var(--color-primario)' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                            Ítem: {item.itemNombre}
                          </Typography>
                        </Box>
                      </Tooltip>
                    ) : (
                      <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontSize: '0.82rem' }}>
                        Referencia: <strong>{item.itemNombre}</strong>
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', lineHeight: 1.45, fontSize: '0.92rem' }}>
                    "{item.texto}"
                  </Typography>
                </Box>
              ))
            )}
          </Box>

          {/* PAGINACIÓN */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontWeight: 600 }}>
              Mostrando {comentariosPaginados.length} de {comentariosFiltrados.length} comentarios
            </Typography>

            <Pagination
              count={totalPaginas}
              page={paginaActual}
              onChange={handleCambioPagina}
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: '10px',
                  fontWeight: 600,
                  color: 'var(--color-texto-oscuro)',
                  '&.Mui-selected': {
                    bgcolor: 'var(--color-primario) !important',
                    color: 'var(--color-texto-claro)',
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* MODAL DE AUDITORÍA CON FICHA Y COMENTARIOS VINCULADOS */}
        <Dialog
          open={detalleProductoModal.open}
          onClose={handleCerrarDetalleAdmin}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              border: '1.5px solid var(--color-texto-oscuro)',
              p: 2,
              bgcolor: 'var(--color-fondo)',
              boxShadow: '0 16px 40px rgba(44, 44, 42, 0.3)',
              maxHeight: '90vh',
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 800,
              color: 'var(--color-primario)',
              fontSize: '1.2rem',
              pb: 1,
            }}
          >
            Ficha Administrativa y Opiniones del Ítem
            <IconButton onClick={handleCerrarDetalleAdmin} size="small" sx={{ color: 'var(--color-texto-oscuro)' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Divider sx={{ borderColor: 'var(--color-borde)', mb: 2 }} />

          {detalleProductoModal.producto && (
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, pt: 0, overflowY: 'auto' }}>
              {/* Encabezado del producto */}
              <Box sx={{ bgcolor: 'var(--color-input-bg)', p: 2, borderRadius: '14px', border: '1px solid var(--color-borde)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-texto-oscuro)' }}>
                    {detalleProductoModal.producto.nombre}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--color-borde)', fontSize: '0.85rem' }}>
                    ID: <strong>#{detalleProductoModal.producto.id}</strong> | Vendedor: <strong>{detalleProductoModal.producto.vendedor}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'var(--color-fondo)', px: 1.5, py: 0.6, borderRadius: '12px', border: '1px solid var(--color-borde)' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--color-texto-oscuro)' }}>
                    Promedio: {promedioProductoModal}
                  </Typography>
                  <Rating value={Number(promedioProductoModal)} precision={0.1} size="small" readOnly sx={{ color: 'var(--color-primario)' }} />
                </Box>
              </Box>

              {/* Ficha técnica rápida */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1.5 }}>
                <Box sx={{ p: 1.5, bgcolor: 'var(--color-input-bg)', borderRadius: '10px', border: '1px solid var(--color-borde)' }}>
                  <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontWeight: 700 }}>PRECIO ACTUAL</Typography>
                  <Typography sx={{ fontWeight: 800, color: 'var(--color-primario)', fontSize: '1.1rem' }}>
                    ${formatCLP(detalleProductoModal.producto.valor)}
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, bgcolor: 'var(--color-input-bg)', borderRadius: '10px', border: '1px solid var(--color-borde)' }}>
                  <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontWeight: 700 }}>STOCK BODEGA</Typography>
                  <Typography sx={{ fontWeight: 800, color: 'var(--color-texto-oscuro)', fontSize: '1.1rem' }}>
                    {detalleProductoModal.producto.stock} unidades
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, bgcolor: 'var(--color-input-bg)', borderRadius: '10px', border: '1px solid var(--color-borde)' }}>
                  <Typography variant="caption" sx={{ color: 'var(--color-borde)', fontWeight: 700 }}>PESO / FLETE</Typography>
                  <Typography sx={{ fontWeight: 800, color: 'var(--color-texto-oscuro)', fontSize: '1.1rem' }}>
                    {detalleProductoModal.producto.peso || 'Estándar'}
                  </Typography>
                </Box>
              </Box>

              {/* Detalles y descripción */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                {detalleProductoModal.producto.tamanos && detalleProductoModal.producto.tamanos.length > 0 && (
                  <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontSize: '0.88rem' }}>
                    <strong>Variantes / Tallas:</strong> {detalleProductoModal.producto.tamanos.join(', ')}
                  </Typography>
                )}
                {detalleProductoModal.producto.colores && detalleProductoModal.producto.colores.length > 0 && (
                  <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontSize: '0.88rem' }}>
                    <strong>Colores disponibles:</strong> {detalleProductoModal.producto.colores.join(', ')}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontSize: '0.88rem', mt: 0.5 }}>
                  <strong>Descripción:</strong> {detalleProductoModal.producto.descripcion}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'var(--color-borde)', my: 0.5 }} />

              {/* LISTADO DE COMENTARIOS EXCLUSIVOS DEL PRODUCTO */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CommentOutlinedIcon sx={{ color: 'var(--color-primario)', fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-texto-oscuro)' }}>
                    Comentarios y Reseñas de este Ítem ({comentariosDelProductoModal.length})
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.2,
                    maxHeight: 240,
                    overflowY: 'auto',
                    p: 1.5,
                    bgcolor: 'var(--color-input-bg)',
                    borderRadius: '12px',
                    border: '1.2px solid var(--color-borde)',
                  }}
                >
                  {comentariosDelProductoModal.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'var(--color-borde)', fontStyle: 'italic', textAlign: 'center', py: 3 }}>
                      Este producto aún no registra comentarios o valoraciones.
                    </Typography>
                  ) : (
                    comentariosDelProductoModal.map((com) => (
                      <Box
                        key={com.id}
                        sx={{
                          p: 1.5,
                          bgcolor: 'var(--color-fondo)',
                          borderRadius: '10px',
                          border: '1px solid var(--color-borde)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.6,
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-texto-oscuro)' }}>
                            {com.usuario}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={com.rating} size="small" readOnly sx={{ color: 'var(--color-primario)' }} />
                            <Typography variant="caption" sx={{ color: 'var(--color-borde)' }}>
                              {com.fecha}
                            </Typography>
                            <IconButton
                              size="small"
                              title="Moderar / Eliminar"
                              onClick={() => handleEliminarComentario(com.id)}
                              sx={{ color: 'var(--color-texto-oscuro)', p: 0.3, '&:hover': { color: '#d32f2f' } }}
                            >
                              <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: '0.86rem', color: 'var(--color-texto-oscuro)', lineHeight: 1.4 }}>
                          "{com.texto}"
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            </DialogContent>
          )}

          <DialogActions sx={{ px: 3, pb: 1.5 }}>
            <Button
              onClick={handleCerrarDetalleAdmin}
              sx={{
                bgcolor: 'var(--color-primario)',
                color: 'var(--color-texto-claro)',
                borderRadius: '20px',
                textTransform: 'none',
                px: 3,
                fontWeight: 600,
                border: '1.2px solid var(--color-texto-oscuro)',
                boxShadow: '0 2px 4px rgba(44,44,42,0.2)',
                '&:hover': { bgcolor: 'var(--color-primario-hover, var(--color-primario))' },
              }}
            >
              Cerrar Auditoría
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}

const filtroInputStyle = {
  bgcolor: 'var(--color-blanco, #fff)',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    height: 38,
    '& fieldset': { borderColor: 'var(--color-borde)', borderWidth: '1.2px' },
    '&:hover fieldset': { borderColor: 'var(--color-texto-oscuro)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-primario)' },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.88rem',
    color: 'var(--color-texto-oscuro)',
  },
};