import React, { useState } from 'react';
import SignUpTemplate from '../../components/templates/SignUpTemplate/SignUpTemplate.jsx';
import SignUpForm from '../../components/organisms/SignUpForm/SignUpForm.jsx';

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
  });

  const handleCrearCuenta = (e) => {
    e.preventDefault();

    // 1. Validar campos obligatorios
    if (!formData.rut.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    // 2. Comparación estricta de contraseñas
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor verifíquelas.');
      return;
    }

    // 3. Longitud mínima recomendada
    if (formData.password.length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    alert('¡Cuenta creada con éxito!');
    console.log(formData);
    if (onVolverLogin) {
      onVolverLogin();
    }
  };

  const handleAbrirTelefono = () => {
    alert('Modal / Panel de Ingreso de Teléfono');
  };

  const handleAbrirDireccion = () => {
    alert('Modal / Panel de Ingreso de Dirección');
  };

  return (
    <SignUpTemplate
      onVolverLogin={onVolverLogin}
      formSlot={
        <SignUpForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCrearCuenta}
          onAbrirTelefono={handleAbrirTelefono}
          onAbrirDireccion={handleAbrirDireccion}
        />
      }
    />
  );
}