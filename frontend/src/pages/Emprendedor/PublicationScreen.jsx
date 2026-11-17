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
import { useCrudFeedback } from '../../components/organisms/CrudFeedback/CrudFeedbackProvider';

export default function PublicationsScreen({
  productos = [],
  onEditarProducto,
  onEliminarProducto,
  currentUser = null,
  cartProps = {},
}) {
  const navigate = useNavigate();
  const { confirmarAccion, mostrarExito, mostrarError } = useCrudFeedback();

  const [tabActual, setTabActual] = useState('productos');
  const [modalOpen, setModalOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [productoOferta, setProductoOferta] = useState(null);

  const miEmpresa = currentUser?.nombreEmpresa || currentUser?.name || 'Textiles del Sur SpA';

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
    confirmarAccion({
      titulo: productoEditar ? 'Confirmar Edición de Publicación' : 'Confirmar Nueva Publicación',
      mensaje: productoEditar
        ? `¿Deseas guardar los cambios en "${form.nombre}"?`
        : `¿Deseas publicar "${form.nombre}" en el catálogo de ${miEmpresa}?`,
      textoConfirmar: 'Guardar Publicación',
      onConfirmar: () => {
        try {
          const formConVendedor = {
            ...form,
            vendedor: miEmpresa,
          };
          onEditarProducto(formConVendedor, productoEditar);
          setModalOpen(false);
          mostrarExito(
            productoEditar
              ? `Publicación "${form.nombre}" actualizada correctamente.`
              : `Publicación "${form.nombre}" creada correctamente.`
          );
        } catch (err) {
          mostrarError('No se pudo guardar la publicación.');
        }
      },
    });
  };

  const handleEliminar = (producto) => {
    confirmarAccion({
      titulo: 'Confirmar Eliminación de Publicación',
      mensaje: `¿Estás seguro de eliminar "${producto.nombre}" de tu catálogo?`,
      textoConfirmar: 'Eliminar',
      esDestructivo: true,
      onConfirmar: () => {
        try {
          if (onEliminarProducto) {
            onEliminarProducto(producto);
          }
          setModalOpen(false);
          mostrarExito(`Publicación "${producto.nombre}" eliminada correctamente.`);
        } catch (err) {
          mostrarError('Error al eliminar la publicación.');
        }
      },
    });
  };

  const handleOferta = (producto) => {
    setProductoOferta(producto);
    setOfferModalOpen(true);
  };

  const handleGuardarOferta = (ofertaData) => {
    confirmarAccion({
      titulo: 'Confirmar Oferta Temporal',
      mensaje: `¿Deseas aplicar esta oferta promocional sobre "${productoOferta?.nombre}"?`,
      textoConfirmar: 'Aplicar Oferta',
      onConfirmar: () => {
        try {
          console.log('[BACKEND PENDIENTE] POST /api/emprendedor/ofertas', {
            productoId: productoOferta?.id,
            ...ofertaData,
          });
          setOfferModalOpen(false);
          mostrarExito(`Oferta aplicada correctamente a "${productoOferta?.nombre}".`);
        } catch (err) {
          mostrarError('No se pudo aplicar la oferta promocional.');
        }
      },
    });
  };

  return (
    <MainLayout {...cartProps} currentUser={currentUser}>
      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
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

        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'var(--color-input-bg)', borderRadius: '12px', border: '1px solid var(--color-borde)' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
            Empresa: <strong style={{ color: 'var(--color-primario)' }}>{miEmpresa}</strong>
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--color-borde)' }}>
            Tienes {misPublicaciones.length} publicaciones activas ({misProductos.length} productos y {misServicios.length} servicios)
          </Typography>
        </Box>

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

        <ProductFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleGuardar}
          onDelete={handleEliminar}
          producto={productoEditar}
        />

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