import React, { useState } from 'react';
import SignUpTemplate from '../../components/templates/SignUpTemplate/SignUpTemplate.jsx';
import SignUpForm from '../../components/organisms/SignUpForm/SignUpForm.jsx';
import PhoneModal from '../../components/organisms/PhoneModal/PhoneModal.jsx';
import AddressModal from '../../components/organisms/AddressModal/AddressModal.jsx';

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

  const handleAgregarTelefono = (telefono) => {
    setFormData((prev) => ({ ...prev, telefonos: [...prev.telefonos, telefono] }));
  };

  const handleAgregarDireccion = (direccion) => {
    setFormData((prev) => ({ ...prev, direcciones: [...prev.direcciones, direccion] }));
  };

  const handleCrearCuenta = (e) => {
    e.preventDefault();

    if (!formData.rut.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor verifíquelas.');
      return;
    }

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

  return (
    <>
      <SignUpTemplate
        onVolverLogin={onVolverLogin}
        formSlot={
          <SignUpForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCrearCuenta}
            onAbrirTelefono={() => setPhoneModalOpen(true)}
            onAbrirDireccion={() => setAddressModalOpen(true)}
          />
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