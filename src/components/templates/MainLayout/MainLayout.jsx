import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TopBar from '../../organisms/TopBar/TopBar';
import Sidebar from '../../organisms/SideBar/SideBar';
import CartModal from '../../organisms/CartModal/CartModal';
import QuotationModal from '../../organisms/QuotationModal/QuotationModal';
import PaymentModal from '../../organisms/PaymentModal/PaymentModal';

// Ajustado a 15 minutos de inactividad máxima (alineado con la reserva de compra)
const TIEMPO_SESION_INACTIVA_MS = 15 * 60 * 1000;

export default function MainLayout({
  children,
  cartItems = [],
  isCartOpen = false,
  onOpenCart,
  onCloseCart,
  onUpdateQuantity,
  onCotizarCarrito,
  onFiltrarVendedor,
  isQuotationOpen = false,
  onCloseQuotation,
  itemsParaCotizar = [],
  zonasTransporte = [],
  currentUser = { name: 'Usuario', soyEmpresa: false },
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [alertaInactividad, setAlertaInactividad] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);

  // Detección de panel actual
  const esModoEmprendedor = location.pathname.startsWith('/emprendedor');

  // Control de expiración de sesión por inactividad
  const handleCerrarSesionInactiva = useCallback(() => {
    setAlertaInactividad(true);
    setTimeout(() => {
      if (onLogout) onLogout();
      navigate('/login');
    }, 1500);
  }, [onLogout, navigate]);

  useEffect(() => {
    const reiniciarTemporizador = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        handleCerrarSesionInactiva();
      }, TIEMPO_SESION_INACTIVA_MS);
    };

    const eventos = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    eventos.forEach((evento) => window.addEventListener(evento, reiniciarTemporizador));

    reiniciarTemporizador();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      eventos.forEach((evento) => window.removeEventListener(evento, reiniciarTemporizador));
    };
  }, [handleCerrarSesionInactiva]);

  const handleSidebarNavigate = (opcion) => {
    setSidebarOpen(false);

    switch (opcion) {
      case 'Mensajes':
        if (esModoEmprendedor) {
          navigate('/emprendedor/mensajes');
        } else {
          navigate('/mensajes');
        }
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
        if (currentUser?.soyEmpresa) navigate('/emprendedor');
        break;
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
      case 'Volver a Comprador':
        navigate('/comprador');
        break;
      case 'Volver a Emprendedor':
        if (currentUser?.soyEmpresa) navigate('/emprendedor');
        break;
      case 'Administrar Panel':
      case 'Administrar':
        navigate('/admin');
        break;
      default:
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
        if (currentUser?.soyEmpresa) navigate('/emprendedor');
        break;
      case 'Modo Comprador':
        navigate('/comprador');
        break;
      case 'Cerrar Sesión':
        if (onLogout) onLogout();
        navigate('/login');
        break;
      default:
        break;
    }
  };

  const handleAbrirPago = () => {
    if (onCloseCart) onCloseCart();
    setIsPaymentOpen(true);
  };

  const handlePagoCompletado = (orden) => {
    navigate('/pedidos');
  };

  const totalCalculado = cartItems.reduce(
    (acc, item) => acc + (Number(item.valor) || 0) * (Number(item.cantidad) || 1),
    0
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--color-fondo)' }}>
      <TopBar 
        onMenuClick={() => setSidebarOpen(true)} 
        username={currentUser?.name || 'Usuario'}
        currentUser={currentUser}
        onMenuAction={handleProfileMenuAction}
        onOpenCart={onOpenCart}
      />
      
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onNavigate={handleSidebarNavigate}
        currentUser={currentUser}
      />
      
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {children}
      </Box>

      <CartModal
        isOpen={isCartOpen}
        onClose={onCloseCart}
        cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onCotizar={onCotizarCarrito}
        onPagar={handleAbrirPago}
        onFiltrarVendedor={onFiltrarVendedor}
      />

      <PaymentModal
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={totalCalculado}
        cartItems={cartItems}
        zonasTransporte={zonasTransporte}
        onPagoCompletado={handlePagoCompletado}
      />

      <QuotationModal
        open={isQuotationOpen}
        onClose={onCloseQuotation}
        itemsCotizados={itemsParaCotizar}
        totalCotizado={itemsParaCotizar.reduce(
          (acc, item) => acc + (Number(item.valor) || 0) * (Number(item.cantidad) || 1),
          0
        )}
      />

      {/* Notificación de sesión expirada */}
      <Snackbar
        open={alertaInactividad}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          variant="filled"
          sx={{
            bgcolor: 'var(--color-primario)',
            color: 'var(--color-texto-claro)',
            borderRadius: '16px',
            border: '1.5px solid var(--color-texto-oscuro)',
            boxShadow: '0 8px 24px rgba(44, 44, 42, 0.25)',
            fontWeight: 600,
          }}
        >
          Tu sesión ha expirado por inactividad. Redirigiendo...
        </Alert>
      </Snackbar>
    </Box>
  );
}