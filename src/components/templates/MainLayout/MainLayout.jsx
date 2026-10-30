import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TopBar from '../../organisms/TopBar/TopBar';
import Sidebar from '../../organisms/SideBar/SideBar';
import CartModal from '../../organisms/CartModal/CartModal';
import QuotationModal from '../../organisms/QuotationModal/QuotationModal';

export default function MainLayout({
  children,
  cartItems = [],
  isCartOpen = false,
  onOpenCart,
  onCloseCart,
  onUpdateQuantity,
  onPagar,
  onCotizarCarrito,
  onFiltrarVendedor,
  isQuotationOpen = false,
  onCloseQuotation,
  itemsParaCotizar = [],
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({ name: 'Usuario' });

  const handleSidebarNavigate = (opcion) => {
    setSidebarOpen(false);

    switch (opcion) {
      // Opciones Comprador
      case 'Mensajes':
        navigate('/mensajes');
        break;
      case 'Tus Pedidos':
        navigate('/pedidos');
        break;
      case 'Cotizaciones':
        navigate('/cotizaciones');
        break;
      case 'Transacciones':
        navigate('/transacciones');
        break;
      case 'Perfil':
        navigate('/perfil');
        break;
      case 'Modo Emprendedor':
        navigate('/emprendedor');
        break;

      // Opciones Emprendedor
      case 'Pedidos Recibidos':
        navigate('/emprendedor');
        break;
      case 'Devoluciones':
        navigate('/emprendedor/devoluciones');
        break;
      case 'Publicaciones':
        navigate('/emprendedor/publicaciones');
        break;
      case 'Administrar Stock':
        navigate('/emprendedor/stock');
        break;
      case 'Ingresar como cliente':
      case 'Modo Comprador':
        navigate('/comprador');
        break;

      default:
        console.log('Navegando a opción:', opcion);
        navigate('/comprador');
        break;
    }
  };

  const handleProfileMenuAction = (action) => {
    switch (action) {
      case 'Perfil':
        navigate('/perfil');
        break;
      case 'Modo Emprendedor':
        navigate('/emprendedor');
        break;
      case 'Modo Comprador':
        navigate('/comprador');
        break;
      case 'Cerrar Sesión':
        setCurrentUser(null);
        navigate('/login');
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--color-fondo)' }}>
      <TopBar 
        onMenuClick={() => setSidebarOpen(true)} 
        username={currentUser ? currentUser.name : 'Usuario'} 
        onMenuAction={handleProfileMenuAction}
        onOpenCart={onOpenCart}
      />
      
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onNavigate={handleSidebarNavigate} 
      />
      
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {children}
      </Box>

      {/* Modal global del carrito */}
      <CartModal
        isOpen={isCartOpen}
        onClose={onCloseCart}
        cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onCotizar={onCotizarCarrito}
        onPagar={onPagar}
        onFiltrarVendedor={onFiltrarVendedor}
      />

      {/* Modal global de cotización */}
      <QuotationModal
        open={isQuotationOpen}
        onClose={onCloseQuotation}
        itemsCotizados={itemsParaCotizar}
        totalCotizado={itemsParaCotizar.reduce(
          (acc, item) => acc + (Number(item.valor) || 0) * (Number(item.cantidad) || 1),
          0
        )}
      />
    </Box>
  );
}