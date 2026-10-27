import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CatalogList from '../../components/organisms/CatalogList/CatalogList';
import PaymentModal from '../../components/organisms/PaymentModal/PaymentModal';
import AddressModal from '../../components/organisms/AddressModal/AddressModal';

export default function CatalogScreen({
  productos = [],
  favoritos = [],
  onToggleFavorito,
  cartProps = {},
  vendedorFiltrado = null,
  onLimpiarFiltroVendedor,
}) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const [direcciones, setDirecciones] = useState([
    { direccion: 'Av. Las Condes', numero: '1234', comuna: 'Las Condes', tipoLugar: 'Casa/Depto.' },
    { direccion: 'Providencia', numero: '567', comuna: 'Providencia', tipoLugar: 'oficina' },
  ]);

  // Aplicación sincrónica del filtro por vendedor en memoria
  const productosFiltradosPorVendedor = vendedorFiltrado
    ? productos.filter((p) => (p.vendedor || 'Tienda Oficial') === vendedorFiltrado)
    : productos;

  const productosfiltrados = productosFiltradosPorVendedor.filter((p) => p.tipo !== 'servicio');
  const serviciosfiltrados = productosFiltradosPorVendedor.filter((p) => p.tipo === 'servicio');

  const totalCalculado = (cartProps.cartItems || []).reduce(
    (acc, item) => acc + (Number(item.valor) || 0) * (Number(item.cantidad) || 1),
    0
  );

  const handlePagar = () => {
    if (cartProps.onCloseCart) cartProps.onCloseCart();
    setIsPaymentOpen(true);
  };

  const handleAgregarDireccion = (nuevaDir) => {
    setDirecciones((prev) => [...prev, nuevaDir]);
  };

  const handlePagoCompletado = (orden) => {
    console.log('Orden completada con éxito:', orden);
    setIsPaymentOpen(false);
  };

  return (
    <MainLayout {...cartProps} onPagar={handlePagar}>
      {/* Banner de filtro por vendedor si se presionó "Ver" en el carrito */}
      {vendedorFiltrado && (
        <Box
          sx={{
            maxWidth: 900,
            mx: 'auto',
            mb: 2.5,
            p: 1.5,
            bgcolor: 'rgba(195, 85, 43, 0.12)',
            border: '1.2px solid var(--color-primario)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StorefrontIcon sx={{ color: 'var(--color-primario)' }} />
            <Typography sx={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--color-texto-oscuro)' }}>
              Mostrando solo artículos de: <strong>{vendedorFiltrado}</strong>
            </Typography>
          </Box>
          <Chip
            label="Quitar filtro"
            size="small"
            onDelete={onLimpiarFiltroVendedor}
            onClick={onLimpiarFiltroVendedor}
            sx={{
              bgcolor: 'var(--color-primario)',
              color: 'var(--color-texto-claro)',
              fontWeight: 600,
              '& .MuiChip-deleteIcon': { color: 'var(--color-texto-claro)' },
            }}
          />
        </Box>
      )}

      <CatalogList
        productos={productosfiltrados}
        servicios={serviciosfiltrados}
        favoritos={favoritos}
        onToggleFavorito={onToggleFavorito}
      />

      <PaymentModal
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={totalCalculado}
        direccionesGuardadas={direcciones}
        onAbrirNuevaDireccion={() => setIsAddressOpen(true)}
        onPagoCompletado={handlePagoCompletado}
      />

      <AddressModal
        open={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        onAgregar={handleAgregarDireccion}
      />
    </MainLayout>
  );
}