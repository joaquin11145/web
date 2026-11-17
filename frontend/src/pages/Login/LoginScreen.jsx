import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';

import LoginTemplate from '../../components/templates/LoginTemplate/LoginTemplate.jsx';
import LoginBrand from '../../components/organisms/LoginBrand/LoginBrand.jsx';
import LoginForm from '../../components/organisms/LoginForm/LoginForm.jsx';

export default function LoginScreen({ onLogin, onCrearCuenta }) {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recuerdame, setRecuerdame] = useState(true);
  const [errorLogin, setErrorLogin] = useState('');
  const [cargando, setCargando] = useState(false);

  const formatearRut = (valor) => {
    let limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length <= 1) return limpio;
    const dv = limpio.slice(-1);
    let cuerpo = limpio.slice(0, -1);
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpo}-${dv}`;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorLogin('');

    if (!rut.trim() || !password.trim()) {
      setErrorLogin('Por favor ingrese su RUT y contraseña.');
      return;
    }

    setCargando(true);
    try {
      if (onLogin) {
        const respuesta = await onLogin(rut, password, recuerdame);
        if (respuesta && !respuesta.success) {
          setErrorLogin(respuesta.mensaje || 'RUT o contraseña incorrectos.');
        }
      }
    } catch (err) {
      setErrorLogin('Error al validar las credenciales de acceso.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LoginTemplate
        brandSlot={<LoginBrand />}
        formSlot={
          <Box sx={{ width: '100%' }}>
            <Collapse in={Boolean(errorLogin)} sx={{ mb: 2 }}>
              <Alert severity="error" sx={{ borderRadius: '8px', fontSize: '0.84rem' }}>
                {errorLogin}
              </Alert>
            </Collapse>

            <LoginForm
              rut={rut}
              setRut={(val) => {
                setRut(formatearRut(val));
                setErrorLogin('');
              }}
              password={password}
              setPassword={(val) => {
                setPassword(val);
                setErrorLogin('');
              }}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              recuerdame={recuerdame}
              setRecuerdame={setRecuerdame}
              onSubmit={handleSubmit}
              onCrearCuenta={onCrearCuenta}
              loading={cargando}
            />
          </Box>
        }
      />
    </Box>
  );
}