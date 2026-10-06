import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TopBar from '../../organisms/TopBar/TopBar';
import Sidebar from '../../organisms/SideBar/SideBar';

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({ name: 'Usuario' });

  const handleSidebarNavigate = (opcion) => {
    switch (opcion) {
      case 'Perfil':
        navigate('/perfil');
        break;
      default:
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
      />
      
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onNavigate={handleSidebarNavigate} 
      />
      
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {children}
      </Box>
    </Box>
  );
}