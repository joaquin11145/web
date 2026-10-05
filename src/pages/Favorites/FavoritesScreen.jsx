import MainLayout from '../../components/templates/MainLayout/MainLayout';
import FavoritesList from '../../components/organisms/FavoritesList/FavoritesList';

export default function FavoritesScreen({ favoritos, onToggleFavorito }) {
  return (
    <MainLayout>
      <FavoritesList favoritos={favoritos} onQuitarFavorito={(id) => onToggleFavorito({ id })} />
    </MainLayout>
  );
}