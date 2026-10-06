import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CatalogList from '../../components/organisms/CatalogList/CatalogList';
import ProductForm from '../../components/organisms/ProductForm/ProductoForm.jsx';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import OfferModal from '../../components/organisms/OfferModal/OfferModal';


export default function PublicationsScreen({ productos, onEditarProducto, onEliminarProducto }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [productoOferta, setProductoOferta] = useState(null);

  const handleAbrirCrear = () => {
    setProductoEditar(null);
    setModalOpen(true);
  };

  const handleEditar = (producto) => {
    setProductoEditar(producto);
    setModalOpen(true);
  };

  const handleGuardar = (form) => {
    onEditarProducto(form, productoEditar);
  };

  const handleEliminar = (producto) => {
    onEliminarProducto(producto);
  };

  const handleAbrirOferta = (producto) => {
    setProductoOferta(producto);
    setOfferModalOpen(true);
  }
  return (
    <MainLayout>
      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 2 }}>
        <Button onClick={() => navigate('/emprendedor')} sx={{ textTransform: 'none' }}>
          ← Atrás
        </Button>
        <Button
          onClick={handleAbrirCrear}
          variant="contained"
          sx={{ float: 'right', bgcolor: 'var(--color-primario)', textTransform: 'none', borderRadius: 3 }}
        >
          + Crear publicación
        </Button>
      </Box>

      <CatalogList
        productos={productos.filter((p) => p.tipo === 'producto')}
        servicios={productos.filter((p) => p.tipo === 'servicio')}
        modo="vendedor"
        onEditar={handleEditar}
        onComentarios={(item) => console.log('Ver comentarios de:', item.nombre)}
        onOferta={handleAbrirOferta}
      />

      <ProductForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleGuardar}
        onDelete={handleEliminar}
        producto={productoEditar}
      />
      <OfferModal
        open={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        producto={productoOferta}
      />
    </MainLayout>
  );
}
