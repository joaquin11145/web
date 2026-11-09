import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SignUpTemplate from '../../components/templates/SignUpTemplate/SignUpTemplate.jsx';
import SignUpForm from '../../components/organisms/SignUpForm/SignUpForm.jsx';
import PhoneModal from '../../components/organisms/PhoneModal/PhoneModal.jsx';
import AddressModal from '../../components/organisms/AddressModal/AddressModal.jsx';

function formatearRut(valor) {
  if (!valor) return '';
  const limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpio.length <= 1) return limpio;
  const dv = limpio.slice(-1);
  let cuerpo = limpio.slice(0, -1);
  cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${cuerpo}-${dv}`;
}

function validarRut(rutCompleto) {
  if (!rutCompleto) return false;
  const limpio = rutCompleto.replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpio.length < 8 || limpio.length > 9) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo[i], 10);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvCalculado = '';
  if (dvEsperado === 11) dvCalculado = '0';
  else if (dvEsperado === 10) dvCalculado = 'K';
  else dvCalculado = dvEsperado.toString();

  return dv === dvCalculado;
}

function validarEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).trim().toLowerCase());
}

export default function SignUpScreen({ onVolverLogin }) {
  const [formData, setFormData] = useState({
    rut: '',
    email: '',
    nombres: '',
    apellidos: '',
    genero: '',
    fechaNacimiento: '',
    password: '',
    confirmPassword: '',
    soyEmpresa: false,
    nombreEmpresa: '',
    tieneWeb: false,
    paginaWeb: '',
    telefonos: [],
    direcciones: [],
  });

  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  // Viñeta de alerta visual
  const [alerta, setAlerta] = useState({ open: false, mensaje: '', tipo: 'error' });

  const handleUpdateFormData = (nuevoValor) => {
    if (typeof nuevoValor === 'function') {
      setFormData((prev) => {
        const resultado = nuevoValor(prev);
        if (resultado.rut && resultado.rut !== prev.rut) {
          resultado.rut = formatearRut(resultado.rut);
        }
        return resultado;
      });
    } else {
      const dataActualizada = { ...nuevoValor };
      if (dataActualizada.rut) {
        dataActualizada.rut = formatearRut(dataActualizada.rut);
      }
      setFormData(dataActualizada);
    }

    if (alerta.open) setAlerta({ open: false, mensaje: '', tipo: 'error' });
  };

  const handleAgregarTelefono = (telefono) => {
    setFormData((prev) => ({ ...prev, telefonos: [...prev.telefonos, telefono] }));
  };

  const handleAgregarDireccion = (direccion) => {
    setFormData((prev) => ({ ...prev, direcciones: [...prev.direcciones, direccion] }));
  };

  const handleCrearCuenta = (e) => {
    e.preventDefault();

    // 1. Validar RUT
    if (!formData.rut.trim()) {
      setAlerta({ open: true, mensaje: 'El campo RUT es obligatorio.', tipo: 'error' });
      return;
    }
    if (!validarRut(formData.rut)) {
      setAlerta({ open: true, mensaje: 'El RUT no es válido (ej: 12.345.678-K).', tipo: 'error' });
      return;
    }

    // 2. Validar Nombres y Apellidos
    if (!formData.nombres.trim() || !formData.apellidos.trim()) {
      setAlerta({ open: true, mensaje: 'Debe ingresar sus nombres y apellidos completos.', tipo: 'error' });
      return;
    }

    // 3. Validar Correo
    if (!formData.email.trim()) {
      setAlerta({ open: true, mensaje: 'El correo electrónico es obligatorio.', tipo: 'error' });
      return;
    }
    if (!validarEmail(formData.email)) {
      setAlerta({ open: true, mensaje: 'El formato del correo es inválido (ejemplo@dominio.cl).', tipo: 'error' });
      return;
    }

    // 4. Validar Contraseñas y Coincidencia estricta
    if (!formData.password || !formData.confirmPassword) {
      setAlerta({ open: true, mensaje: 'Debe ingresar y confirmar su contraseña.', tipo: 'error' });
      return;
    }
    if (formData.password.length < 4) {
      setAlerta({ open: true, mensaje: 'La contraseña debe tener al menos 4 caracteres.', tipo: 'error' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setAlerta({
        open: true,
        mensaje: 'La confirmación de la contraseña no coincide con la contraseña ingresada.',
        tipo: 'error',
      });
      return;
    }

    // 5. Validar datos de empresa si corresponde
    if (formData.soyEmpresa && !formData.nombreEmpresa.trim()) {
      setAlerta({ open: true, mensaje: 'Debe ingresar el nombre de su empresa.', tipo: 'error' });
      return;
    }

    // Registro exitoso en memoria
    setAlerta({
      open: true,
      mensaje: '¡Cuenta creada con éxito! Redirigiendo a inicio de sesión...',
      tipo: 'success',
    });

    setTimeout(() => {
      if (onVolverLogin) {
        onVolverLogin();
      }
    }, 1500);
  };

  return (
    <>
      <SignUpTemplate
        onVolverLogin={onVolverLogin}
        formSlot={
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Collapse in={alerta.open} sx={{ mb: 2, width: '100%' }}>
              <Alert
                severity={alerta.tipo}
                icon={alerta.tipo === 'success' ? <CheckCircleIcon fontSize="inherit" /> : undefined}
                sx={{
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: alerta.tipo === 'error' ? '#d32f2f' : '#2e7d32',
                  fontSize: '0.85rem',
                }}
              >
                {alerta.mensaje}
              </Alert>
            </Collapse>

            <SignUpForm
              formData={formData}
              setFormData={handleUpdateFormData}
              onSubmit={handleCrearCuenta}
              onAbrirTelefono={() => setPhoneModalOpen(true)}
              onAbrirDireccion={() => setAddressModalOpen(true)}
            />
          </Box>
        }
      />

      <PhoneModal
        open={phoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        onAgregar={handleAgregarTelefono}
      />
      <AddressModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        esEmpresa={formData.soyEmpresa}
        onAgregar={handleAgregarDireccion}
      />
    </>
  );
}