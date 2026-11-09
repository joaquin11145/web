import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CatalogList from '../../components/organisms/CatalogList/CatalogList';
import ProductFormModal from '../../components/organisms/ProductForm/ProductoForm.jsx';
import OfferModal from '../../components/organisms/OfferModal/OfferModal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PublicationsScreen({
  productos = [],
  onEditarProducto,
  onEliminarProducto,
  currentUser = null,
  cartProps = {},
}) {
  const navigate = useNavigate();

  const [tabActual, setTabActual] = useState('productos');
  const [modalOpen, setModalOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [productoOferta, setProductoOferta] = useState(null);

  // Identificador de la empresa autenticada
  const miEmpresa = currentUser?.nombreEmpresa || currentUser?.name || 'Textiles del Sur SpA';

  // FILTRO ESTRICTO: Solo las publicaciones de la empresa conectada
  const misPublicaciones = useMemo(() => {
    return productos.filter((p) => (p.vendedor || '').trim().toLowerCase() === miEmpresa.trim().toLowerCase());
  }, [productos, miEmpresa]);

  const misProductos = useMemo(() => {
    return misPublicaciones.filter((p) => p.tipo !== 'servicio');
  }, [misPublicaciones]);

  const misServicios = useMemo(() => {
    return misPublicaciones.filter((p) => p.tipo === 'servicio');
  }, [misPublicaciones]);

  const handleAbrirCrear = () => {
    setProductoEditar(null);
    setModalOpen(true);
  };

  const handleEditar = (producto) => {
    setProductoEditar(producto);
    setModalOpen(true);
  };

  const handleGuardar = (form) => {
    // Se asegura que la publicación quede asignada a la empresa actual
    const formConVendedor = {
      ...form,
      vendedor: miEmpresa,
    };
    onEditarProducto(formConVendedor, productoEditar);
    setModalOpen(false);
  };

  const handleEliminar = (producto) => {
    if (onEliminarProducto) {
      onEliminarProducto(producto);
    }
    setModalOpen(false);
  };

  const handleOferta = (producto) => {
    setProductoOferta(producto);
    setOfferModalOpen(true);
  };

  const handleGuardarOferta = (ofertaData) => {
    console.log('[BACKEND PENDIENTE] POST /api/emprendedor/ofertas', {
      productoId: productoOferta?.id,
      ...ofertaData,
    });
    setOfferModalOpen(false);
  };

  return (
    <MainLayout {...cartProps} currentUser={currentUser}>
      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
        {/* Barra superior de navegación */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/emprendedor')}
            sx={{
              textTransform: 'none',
              color: 'var(--color-texto-oscuro)',
              fontWeight: 600,
              fontSize: '0.92rem',
              '&:hover': { bgcolor: 'rgba(195, 85, 43, 0.08)' },
            }}
          >
            Volver al Panel
          </Button>

          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            onClick={handleAbrirCrear}
            sx={{
              bgcolor: 'var(--color-primario)',
              color: 'var(--color-texto-claro)',
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              height: 38,
              border: '1.2px solid var(--color-texto-oscuro)',
              boxShadow: '0 2px 5px rgba(44, 44, 42, 0.25)',
              '&:hover': {
                bgcolor: 'var(--color-primario-hover, var(--color-primario))',
              },
            }}
          >
            Crear Publicación
          </Button>
        </Box>

        {/* Resumen del Emprendedor */}
        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'var(--color-input-bg)', borderRadius: '12px', border: '1px solid var(--color-borde)' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
            Empresa: <strong style={{ color: 'var(--color-primario)' }}>{miEmpresa}</strong>
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--color-borde)' }}>
            Tienes {misPublicaciones.length} publicaciones activas ({misProductos.length} productos y {misServicios.length} servicios)
          </Typography>
        </Box>

        {/* Listado en modo vendedor (muestra botones Editar, Comentarios y Oferta) */}
        <CatalogList
          productos={misProductos}
          servicios={misServicios}
          tab={tabActual}
          onTabChange={setTabActual}
          modo="vendedor"
          onEditar={handleEditar}
          onOferta={handleOferta}
          onComentarios={(item) => navigate(`/producto/${item.id}`)}
        />

        {/* Modal de Crear / Editar Publicación */}
        <ProductFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleGuardar}
          onDelete={handleEliminar}
          producto={productoEditar}
        />

        {/* Modal de Oferta */}
        {offerModalOpen && (
          <OfferModal
            open={offerModalOpen}
            onClose={() => setOfferModalOpen(false)}
            onSave={handleGuardarOferta}
            producto={productoOferta}
          />
        )}
      </Box>
    </MainLayout>
  );
}