import React, { createContext, useContext, useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CustomButton from '../../atoms/Button/CustomButton';

const CrudFeedbackContext = createContext(null);

export function useCrudFeedback() {
  const context = useContext(CrudFeedbackContext);
  if (!context) {
    throw new Error('useCrudFeedback debe usarse dentro de CrudFeedbackProvider');
  }
  return context;
}

export function CrudFeedbackProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    open: false,
    titulo: 'Confirmar Acción',
    mensaje: '¿Estás seguro de realizar esta operación?',
    textoConfirmar: 'Confirmar',
    esDestructivo: false,
    onConfirmar: null,
  });

  const [toast, setToast] = useState({
    open: false,
    mensaje: '',
    tipo: 'success', // 'success' | 'error' | 'warning'
  });

  const mostrarExito = useCallback((mensaje) => {
    setToast({ open: true, mensaje, tipo: 'success' });
  }, []);

  const mostrarError = useCallback((mensaje) => {
    setToast({ open: true, mensaje, tipo: 'error' });
  }, []);

  const confirmarAccion = useCallback(
    ({
      titulo = 'Confirmar Operación',
      mensaje = '¿Deseas continuar con esta acción?',
      textoConfirmar = 'Confirmar',
      esDestructivo = false,
      onConfirmar,
    }) => {
      setConfirmState({
        open: true,
        titulo,
        mensaje,
        textoConfirmar,
        esDestructivo,
        onConfirmar,
      });
    },
    []
  );

  const handleCerrarConfirmacion = () => {
    setConfirmState((prev) => ({ ...prev, open: false, onConfirmar: null }));
  };

  const handleEjecutarConfirmacion = async () => {
    const accion = confirmState.onConfirmar;
    handleCerrarConfirmacion();
    if (accion) {
      try {
        await accion();
      } catch (error) {
        mostrarError(error?.message || 'Ocurrió un error inesperado al procesar la operación.');
      }
    }
  };

  return (
    <CrudFeedbackContext.Provider value={{ confirmarAccion, mostrarExito, mostrarError }}>
      {children}

      {/* Modal Global de Confirmación previa a cualquier CRUD */}
      <Dialog
        open={confirmState.open}
        onClose={handleCerrarConfirmacion}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '22px',
              border: '1.5px solid var(--color-texto-oscuro)',
              p: 1.5,
              bgcolor: 'var(--color-fondo)',
              boxShadow: '0 14px 34px rgba(44, 44, 42, 0.3)',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: confirmState.esDestructivo ? '#d32f2f' : 'var(--color-primario)',
            fontSize: '1.1rem',
            pb: 1,
          }}
        >
          {confirmState.titulo}
        </DialogTitle>

        <Divider sx={{ borderColor: 'var(--color-borde)', mb: 1.5 }} />

        <DialogContent sx={{ pt: 0.5 }}>
          <Typography sx={{ color: 'var(--color-texto-oscuro)', fontSize: '0.92rem', lineHeight: 1.45 }}>
            {confirmState.mensaje}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 1.5, gap: 1.2 }}>
          <CustomButton pill outlined onClick={handleCerrarConfirmacion}>
            Cancelar
          </CustomButton>
          <CustomButton pill onClick={handleEjecutarConfirmacion}>
            {confirmState.textoConfirmar}
          </CustomButton>
        </DialogActions>
      </Dialog>

      {/* Notificación Flotante de Éxito o Error tras ejecutar el CRUD */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3800}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.tipo}
          variant="filled"
          sx={{
            borderRadius: '16px',
            border: '1.5px solid var(--color-texto-oscuro)',
            bgcolor: toast.tipo === 'success' ? '#2e7d32' : '#d32f2f',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.88rem',
            boxShadow: '0 8px 20px rgba(44, 44, 42, 0.25)',
          }}
        >
          {toast.mensaje}
        </Alert>
      </Snackbar>
    </CrudFeedbackContext.Provider>
  );
}