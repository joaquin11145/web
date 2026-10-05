import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const categorias = [
  { nombre: 'Categoria 1', subcategorias: ['Subcategoria 1', 'Subcategoria 2', 'Subcategoria 3'] },
  { nombre: 'Categoria 2', subcategorias: ['Subcategoria 4', 'Subcategoria 5'] },
  { nombre: 'Categoria 3', subcategorias: ['Subcategoria 6', 'Subcategoria 7'] },
  { nombre: 'Categoria 4', subcategorias: ['Subcategoria 8', 'Subcategoria 9'] },
  { nombre: 'Categoria 5', subcategorias: ['Subcategoria 10', 'Subcategoria 11'] },
];

const opcionesPrincipales = ['Mensajes', 'Tus Pedidos', 'Transacciones'];

export default function Sidebar({ open, onClose, onNavigate }) {
  const [categoriaHover, setCategoriaHover] = useState(null);

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ display: 'flex' }} onMouseLeave={() => setCategoriaHover(null)}>
        <Box sx={{ width: 240 }} role="presentation">
          <List disablePadding>
            {opcionesPrincipales.map((opcion) => (
              <ListItemButton key={opcion} onClick={() => onNavigate && onNavigate(opcion)}>
                <ListItemText primary={opcion} primaryTypographyProps={{ fontWeight: 700 }} />
              </ListItemButton>
            ))}

            {categorias.map((categoria) => (
              <ListItemButton
                key={categoria.nombre}
                selected={categoriaHover === categoria.nombre}
                onMouseEnter={() => setCategoriaHover(categoria.nombre)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(195, 85, 43, 0.1)',
                  },
                }}
              >
                <ListItemText primary={categoria.nombre} primaryTypographyProps={{ fontWeight: 700 }} />
                <ChevronRightIcon fontSize="small" />
              </ListItemButton>
            ))}
          </List>
        </Box>


        {categoriaHover && (
          <Paper
            elevation={3}
            sx={{
              width: 220,
              borderRadius: 0,
              borderLeft: '1px solid var(--color-borde)',
              p: 2,
            }}
          >
            {categorias
              .filter((c) => c.nombre === categoriaHover)
              .map((c) => (
                <Box key={c.nombre}>
                  <Box sx={{ fontWeight: 700, color: 'var(--color-primario)', mb: 1 }}>
                    {c.nombre}
                  </Box>
                  <List disablePadding>
                    {c.subcategorias.map((sub) => (
                      <ListItemButton key={sub} sx={{ pl: 0, py: 0.5 }}>
                        <ListItemText primary={sub} />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              ))}
          </Paper>
        )}
      </Box>
    </Drawer>
  );
}