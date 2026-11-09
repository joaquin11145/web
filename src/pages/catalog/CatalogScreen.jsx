import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import StorefrontIcon from '@mui/icons-material/Storefront';

import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CatalogList from '../../components/organisms/CatalogList/CatalogList';
import PaymentModal from '../../components/organisms/PaymentModal/PaymentModal';
import AddressModal from '../../components/organisms/AddressModal/AddressModal';

const LIMITE_POR_PAGINA = 40;

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

  // Control de pestaña actual ('productos' o 'servicios') y página activa
  const [tabActual, setTabActual] = useState('productos');
  const [paginaActual, setPaginaActual] = useState(1);

  const [direcciones, setDirecciones] = useState([
    { direccion: 'Av. Las Condes', numero: '1234', comuna: 'Las Condes', tipoLugar: 'Casa/Depto.' },
    { direccion: 'Providencia', numero: '567', comuna: 'Providencia', tipoLugar: 'oficina' },
  ]);

  // Al cambiar de pestaña, se resetea la página a 1
  const handleCambiarTab = (nuevoTab) => {
    setTabActual(nuevoTab);
    setPaginaActual(1);
  };

  // 1. Filtrado por vendedor
  const productosFiltradosPorVendedor = useMemo(() => {
    return vendedorFiltrado
      ? productos.filter((p) => (p.vendedor || 'Tienda Oficial') === vendedorFiltrado)
      : productos;
  }, [productos, vendedorFiltrado]);

  // 2. Separación de listas completas
  const listaProductosCompleta = useMemo(() => {
    return productosFiltradosPorVendedor.filter((p) => p.tipo !== 'servicio');
  }, [productosFiltradosPorVendedor]);

  const listaServiciosCompleta = useMemo(() => {
    return productosFiltradosPorVendedor.filter((p) => p.tipo === 'servicio');
  }, [productosFiltradosPorVendedor]);

  // 3. Cálculo de páginas según la pestaña activa
  const itemsActivos = tabActual === 'productos' ? listaProductosCompleta : listaServiciosCompleta;
  const totalPaginas = Math.ceil(itemsActivos.length / LIMITE_POR_PAGINA) || 1;

  // 4. Corte de 40 elementos para la página actual
  const productosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * LIMITE_POR_PAGINA;
    return listaProductosCompleta.slice(inicio, inicio + LIMITE_POR_PAGINA);
  }, [listaProductosCompleta, paginaActual]);

  const serviciosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * LIMITE_POR_PAGINA;
    return listaServiciosCompleta.slice(inicio, inicio + LIMITE_POR_PAGINA);
  }, [listaServiciosCompleta, paginaActual]);

  const handleCambioPagina = (event, valor) => {
    setPaginaActual(valor);
    console.log('[BACKEND PENDIENTE] GET /api/catalogo', {
      tipo: tabActual,
      page: valor,
      limit: LIMITE_POR_PAGINA,
      vendedor: vendedorFiltrado || 'todos',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    console.log('[BACKEND PENDIENTE] POST /api/ordenes/checkout', orden);
    setIsPaymentOpen(false);
  };

  return (
    <MainLayout {...cartProps} onPagar={handlePagar}>
      {/* Banner de filtro por vendedor */}
      {vendedorFiltrado && (
        <Box
          sx={{
            maxWidth: 1000,
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

      {/* Lista del catálogo sincronizada con el estado de pestaña */}
      <CatalogList
        productos={productosPaginados}
        servicios={serviciosPaginados}
        tab={tabActual}
        onTabChange={handleCambiarTab}
        favoritos={favoritos}
        onToggleFavorito={onToggleFavorito}
      />

      {/* Paginador (se calcula dinámicamente con los 60 productos o 60 servicios) */}
      {totalPaginas > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
            mb: 3,
          }}
        >
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
      )}

      {/* Modales */}
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