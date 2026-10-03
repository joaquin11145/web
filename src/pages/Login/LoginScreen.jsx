import React, { useState } from 'react';
import LoginTemplate from '../../components/templates/LoginTemplate/LoginTemplate.jsx';
import LoginBrand from '../../components/organisms/LoginBrand/LoginBrand.jsx';
import LoginForm from '../../components/organisms/LoginForm/LoginForm.jsx';

export default function LoginScreen({ onLogin, onCrearCuenta }) {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recuerdame, setRecuerdame] = useState(true);

  const formatearRut = (valor) => {
    let limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length <= 1) return limpio;
    const dv = limpio.slice(-1);
    let cuerpo = limpio.slice(0, -1);
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpo}-${dv}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(rut, password);
    }
  };

  return (
    <LoginTemplate
      brandSlot={<LoginBrand />}
      formSlot={
        <LoginForm
          rut={rut}
          setRut={(val) => setRut(formatearRut(val))}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          recuerdame={recuerdame}
          setRecuerdame={setRecuerdame}
          onSubmit={handleSubmit}
          onCrearCuenta={onCrearCuenta}
        />
      }
    />
  );
}