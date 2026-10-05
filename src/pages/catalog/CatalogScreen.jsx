import { useState } from 'react';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import CatalogList from '../../components/organisms/CatalogList/CatalogList';
import ProductDetail from '../../components/organisms/ProductDetail/ProductDetail';

const productosMock = [
  { id: 1, nombre: 'Polera', valor: 12000, tamanos: ['36', '37', '38', '39', '40', '41', '42', '43', '44'], colores: ['Rojo', 'Amarillo', 'Verde', 'Naranjo'], stock: 5 },
  { id: 2, nombre: 'Producto 2', valor: 12000, tamanos: ['36', '37', '38'], colores: ['Rojo'], stock: 3 },
  { id: 3, nombre: 'Producto 3', valor: 12000, tamanos: ['40', '41'], colores: ['Verde'], stock: 8 },
];

const serviciosMock = [
  { id: 101, nombre: 'Servicio 1', valor: 15000, tamanos: [], colores: [], stock: 1 },
];

export default function CatalogScreen({ favoritos, onToggleFavorito }) {
  const [selected, setSelected] = useState(null);

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
          productos={productosMock}
          servicios={serviciosMock}
          onSelectItem={setSelected}
          favoritos={favoritos}
          onToggleFavorito={onToggleFavorito}
        />
      )}
    </MainLayout>
  );
}