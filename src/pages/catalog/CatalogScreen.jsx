import { useState } from 'react';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CatalogList from '../../components/organisms/CatalogList/CatalogList';
import ProductDetail from '../../components/organisms/ProductDetail/ProductDetail';
import CartModal from '../../components/organisms/CartModal/CartModal';
import PaymentModal from '../../components/organisms/PaymentModal/PaymentModal';
import AddressModal from '../../components/organisms/AddressModal/AddressModal';

export default function CatalogScreen({ productos, favoritos, onToggleFavorito }) {
  const [selected, setSelected] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  // Lista de direcciones guardadas para el despacho
  const [direcciones, setDirecciones] = useState([
    { direccion: 'Av. Las Condes', numero: '1234', comuna: 'Las Condes', tipoLugar: 'Casa/Depto.' },
    { direccion: 'Providencia', numero: '567', comuna: 'Providencia', tipoLugar: 'oficina' },
  ]);

  // Estado del carrito inicializado con los elementos del diseño de Figma
  const [cartItems, setCartItems] = useState([
    { id: 1, nombre: 'producto 1', valor: 12000, cantidad: 2, vendedor: 'Tienda Oficial' },
    { id: 2, nombre: 'producto 2', valor: 7000, cantidad: 1, vendedor: 'Tienda Oficial' },
    { id: 5, nombre: 'producto 5', valor: 8000, cantidad: 2, vendedor: 'Tienda Oficial' },
    { id: 7, nombre: 'producto 7', valor: 10000, cantidad: 1, vendedor: 'Tienda Oficial' },
  ]);

  const productosfiltrados = productos.filter((p) => p.tipo !== 'servicio');
  const serviciosfiltrados = productos.filter((p) => p.tipo === 'servicio');

  const totalCalculado = cartItems.reduce(
    (acc, item) => acc + (Number(item.valor) || 0) * (Number(item.cantidad) || 1),
    0
  );

  const handleUpdateQuantity = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, cantidad: nuevaCantidad } : item
        )
      );
    }
  };

  const handleAddToCart = (producto) => {
    setCartItems((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1, vendedor: producto.vendedor || 'Tienda Oficial' }];
    });
    setIsCartOpen(true);
  };

  const handleCotizar = (items) => {
    console.log('Cotizando pedido:', items);
    alert('Cotización generada correctamente');
  };

  // Acción del botón Pagar: Cierra el carrito y despliega la pasarela de pago
  const handlePagar = () => {
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handleFiltrarVendedor = (vendedor) => {
    console.log('Filtrando por vendedor:', vendedor);
  };

  const handleAgregarDireccion = (nuevaDir) => {
    setDirecciones((prev) => [...prev, nuevaDir]);
  };

  const handlePagoCompletado = (orden) => {
    console.log('Orden completada con éxito:', orden);
    setCartItems([]); // Vacía el carrito una vez finalizado el pago
    setIsPaymentOpen(false);
  };

  return (
    <MainLayout onOpenCart={() => setIsCartOpen(true)}>
      {selected ? (
        <ProductDetail 
          item={selected} 
          onBack={() => setSelected(null)} 
          favoritos={favoritos} 
          onToggleFavorito={onToggleFavorito}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <CatalogList
          productos={productosfiltrados}
          servicios={serviciosfiltrados}
          onSelectItem={setSelected}
          favoritos={favoritos}
          onToggleFavorito={onToggleFavorito}
        />
      )}

      {/* Modal del Carrito de Compras */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onCotizar={handleCotizar}
        onPagar={handlePagar}
        onFiltrarVendedor={handleFiltrarVendedor}
      />

      {/* Modal de Pago (Figma) */}
      <PaymentModal
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={totalCalculado}
        direccionesGuardadas={direcciones}
        onAbrirNuevaDireccion={() => setIsAddressOpen(true)}
        onPagoCompletado={handlePagoCompletado}
      />

      {/* Modal de Agregar Dirección */}
      <AddressModal
        open={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        onAgregar={handleAgregarDireccion}
      />
    </MainLayout>
  );
}