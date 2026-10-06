import { useState } from 'react';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CatalogList from '../../components/organisms/CatalogList/CatalogList';
import ProductDetail from '../../components/organisms/ProductDetail/ProductDetail';




export default function CatalogScreen({ productos, favoritos, onToggleFavorito }) {
  const [selected, setSelected] = useState(null);

  const productosfiltrados = productos.filter((p) => p.tipo !== 'servicio');
  const serviciosfiltrados = productos.filter((p) => p.tipo === 'servicio');
  return (
    <MainLayout>
      {selected ? (
        <ProductDetail 
        item={selected} 
        onBack={() => setSelected(null)} 
        favoritos={favoritos} onToggleFavorito={onToggleFavorito} 
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
    </MainLayout>
  );
}