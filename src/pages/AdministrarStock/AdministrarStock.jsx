import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MainLayout from '../../components/templates/MainLayout/MainLayout';
import StockModal from '../../components/organisms/StockModal/StockModal.jsx';

export default function AdministrarStock({
  productos = [],
  onAtras,
  onActualizarStock,
}) {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const handleAbrirStock = (prod) => {
    setProductoSeleccionado(prod);
    setModalAbierto(true);
  };

  const handleCerrarStock = () => {
    setProductoSeleccionado(null);
    setModalAbierto(false);
  };

  const listaProductos =
    Array.isArray(productos) && productos.length > 0
      ? productos
      : [
          {
            id: 1,
            nombre: 'Producto 1',
            valor: '12.000',
            descripcion: '(Tamaño), (Peso), (Color), (Material Principal).',
            stock: 5,
          },
          {
            id: 2,
            nombre: 'Producto 2',
            valor: '7.000',
            descripcion: '(Tamaño), (Peso), (Color), (Material Principal).',
            stock: 3,
          },
        ];

  return (
    <MainLayout>
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: 960,
          width: '100%',
          mx: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Botón Atrás superior tipo píldora */}
        <Box sx={{ width: '100%', mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={onAtras}
            sx={{
              height: 38,
              borderRadius: '20px',
              bgcolor: 'var(--color-primario)',
              color: 'var(--color-fondo)',
              border: '1.5px solid var(--color-texto-oscuro)',
              boxShadow: '0 4px 6px rgba(44, 44, 42, 0.4)',
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'var(--color-primario)' },
            }}
          >
            Atras
          </Button>
        </Box>

        {/* Panel contenedor exterior de Figma */}
        <Box
          sx={{
            width: '100%',
            bgcolor: 'var(--color-fondo)',
            border: '1.5px solid var(--color-texto-oscuro)',
            borderRadius: '22px',
            boxShadow: '0 8px 18px rgba(44, 44, 42, 0.25)',
            p: { xs: 1.5, sm: 2.5 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxSizing: 'border-box',
          }}
        >
          {listaProductos.map((prod) => {
            const desc =
              prod.descripcion ||
              `(${Array.isArray(prod.tamanos) ? prod.tamanos.join(', ') : 'Tamaño'}), (${
                Array.isArray(prod.colores) ? prod.colores.join(', ') : 'Color'
              })`;

            const valorTxt =
              typeof prod.valor === 'number'
                ? prod.valor.toLocaleString('es-CL')
                : prod.valor || '0';

            return (
              <Box
                key={prod.id}
                sx={{
                  width: '100%',
                  bgcolor: 'var(--color-fondo)',
                  border: '1.5px solid var(--color-texto-oscuro)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 8px rgba(44, 44, 42, 0.25)',
                  p: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  gap: { xs: 1.5, sm: 2.5 },
                  alignItems: 'center',
                  boxSizing: 'border-box',
                }}
              >
                {/* Cuadro Foto */}
                <Box
                  sx={{
                    width: { xs: 90, sm: 130 },
                    height: { xs: 90, sm: 130 },
                    bgcolor: 'var(--color-blanco)',
                    border: '1.2px solid var(--color-borde)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    userSelect: 'none',
                  }}
                >
                  <Typography
                    sx={{
                      color: 'var(--color-texto-oscuro)',
                      fontSize: { xs: '1.1rem', sm: '1.3rem' },
                      fontWeight: 500,
                    }}
                  >
                    foto
                  </Typography>
                </Box>

                {/* Divisor vertical */}
                <Box
                  sx={{
                    width: '1.2px',
                    alignSelf: 'stretch',
                    bgcolor: 'var(--color-texto-oscuro)',
                    flexShrink: 0,
                  }}
                />

                {/* Información del producto */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.6, pr: 1 }}>
                  <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>
                    Nombre: {prod.nombre}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                    Valor: {valorTxt}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontSize: '0.84rem' }}>
                    Descripción: {desc}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 600 }}>
                    Cantidad Disponible: {prod.stock !== undefined ? prod.stock : '(Cantidad)'}
                  </Typography>
                </Box>

                {/* Botón Editar Stock */}
                <Box sx={{ alignSelf: 'flex-start', flexShrink: 0 }}>
                  <Button
                    variant="contained"
                    disableElevation
                    onClick={() => handleAbrirStock(prod)}
                    sx={{
                      height: 32,
                      px: { xs: 1.5, sm: 2.2 },
                      borderRadius: '16px',
                      bgcolor: 'var(--color-primario)',
                      color: 'var(--color-fondo)',
                      border: '1.2px solid var(--color-texto-oscuro)',
                      boxShadow: '0 3px 5px rgba(44, 44, 42, 0.4)',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      textTransform: 'none',
                      '&:hover': { bgcolor: 'var(--color-primario)' },
                    }}
                  >
                    Editar Stock
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Modal Organism para CRUD de Stock */}
      <StockModal
        open={modalAbierto}
        onClose={handleCerrarStock}
        producto={productoSeleccionado}
        onGuardarStock={onActualizarStock}
      />
    </MainLayout>
  );
}