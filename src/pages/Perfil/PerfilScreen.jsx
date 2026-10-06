import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

function formatearRut(valor) {
  const limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpio.length <= 1) return limpio;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  return `${cuerpo}-${dv}`;
}

const perfilInicial = {
  nombres: 'Carlos Andrés',
  apellidos: 'Pérez Gómez',
  rut: '12-3',
  correo: 'carlos.perez@ficticio.cl',
  telefonos: ['+56 9 7654 3210', '+56 9 1122 3344'],
  direcciones: [
    {
      id: 1,
      tipo: 'Casa/Depto.',
      region: 'Metropolitana',
      provincia: 'Santiago',
      comuna: 'Las Condes',
      codigoPostal: '7550000',
      direccion: 'Av. Las Condes',
      numero: '456',
    },
    {
      id: 2,
      tipo: 'Tienda física',
      region: 'Los Lagos',
      provincia: 'Osorno',
      comuna: 'Osorno',
      codigoPostal: '5290000',
      direccion: 'Eleuterio Ramírez',
      numero: '789',
    },
  ],
  password: '123',
};

export default function PerfilScreen() {
  const [perfil, setPerfil] = useState(perfilInicial);
  const [formData, setFormData] = useState(perfilInicial);
  const [editando, setEditando] = useState(false);

  // Modales
  const [modalCredencialesOpen, setModalCredencialesOpen] = useState(false);
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false);
  const [modalTelefonoOpen, setModalTelefonoOpen] = useState(false);
  const [modalDireccionOpen, setModalDireccionOpen] = useState(false);

  // Credenciales generales
  const [credRut, setCredRut] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [errorCred, setErrorCred] = useState('');

  // Modificar contraseña
  const [nuevaPass, setNuevaPass] = useState('');
  const [confirmarPass, setConfirmarPass] = useState('');
  const [errorPass, setErrorPass] = useState('');
  const [mensajeExitoPass, setMensajeExitoPass] = useState('');

  // Edite Teléfono
  const [nuevoTel, setNuevoTel] = useState('');
  const [telSeleccionado, setTelSeleccionado] = useState(null);

  // Edite Dirección
  const [dirSeleccionada, setDirSeleccionada] = useState(null);
  const [tipoInmueble, setTipoInmueble] = useState('Tienda física');
  const [nuevaDir, setNuevaDir] = useState({
    region: '',
    provincia: '',
    comuna: '',
    codigoPostal: '',
    direccion: '',
    numero: '',
  });

  const handleChange = (campo) => (e) => {
    setFormData((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  // Validar credenciales para ingresar a la edición de datos
  const handleValidarCredenciales = (e) => {
    e.preventDefault();
    if (credRut.trim() === perfil.rut && credPassword.trim() === perfil.password) {
      setFormData(perfil);
      setModalCredencialesOpen(false);
      setEditando(true);
      setCredRut('');
      setCredPassword('');
      setErrorCred('');
    } else {
      setErrorCred('RUT o Contraseña incorrectos.');
    }
  };

  // Validar credenciales para cambiar la contraseña
  const handleValidarCredencialesPassword = (e) => {
    e.preventDefault();
    if (credRut.trim() === perfil.rut && credPassword.trim() === perfil.password) {
      setErrorCred('');
      setModalPasswordOpen(true);
    } else {
      setErrorCred('RUT o Contraseña actual incorrectos.');
    }
  };

  // Guardar la nueva contraseña
  const handleGuardarNuevaPassword = (e) => {
    e.preventDefault();
    if (!nuevaPass.trim()) {
      setErrorPass('Ingrese una contraseña válida.');
      return;
    }
    if (nuevaPass !== confirmarPass) {
      setErrorPass('Las contraseñas no coinciden.');
      return;
    }

    setPerfil((prev) => ({ ...prev, password: nuevaPass }));
    setNuevaPass('');
    setConfirmarPass('');
    setErrorPass('');
    setCredRut('');
    setCredPassword('');
    setModalPasswordOpen(false);
    setMensajeExitoPass('Contraseña actualizada correctamente.');
    setTimeout(() => setMensajeExitoPass(''), 4000);
  };

  const handleGuardarDatos = (e) => {
    e.preventDefault();
    setPerfil(formData);
    setEditando(false);
  };

  const handleCancelarEdicion = () => {
    setFormData(perfil);
    setEditando(false);
  };

  // Manejo de Teléfonos
  const handleAgregarTelefono = () => {
    if (!nuevoTel.trim()) return;
    const actualizados = [...formData.telefonos, nuevoTel.trim()];
    setFormData((prev) => ({ ...prev, telefonos: actualizados }));
    setPerfil((prev) => ({ ...prev, telefonos: actualizados }));
    setNuevoTel('');
  };

  const handleEliminarTelefono = () => {
    if (!telSeleccionado) return;
    const actualizados = formData.telefonos.filter((t) => t !== telSeleccionado);
    setFormData((prev) => ({ ...prev, telefonos: actualizados }));
    setPerfil((prev) => ({ ...prev, telefonos: actualizados }));
    setTelSeleccionado(null);
  };

  // Manejo de Direcciones
  const handleAgregarDireccion = () => {
    if (!nuevaDir.direccion.trim() || !nuevaDir.numero.trim()) return;
    const item = {
      ...nuevaDir,
      tipo: tipoInmueble,
      id: Date.now(),
    };
    const actualizadas = [...formData.direcciones, item];
    setFormData((prev) => ({ ...prev, direcciones: actualizadas }));
    setPerfil((prev) => ({ ...prev, direcciones: actualizadas }));
    setNuevaDir({
      region: '',
      provincia: '',
      comuna: '',
      codigoPostal: '',
      direccion: '',
      numero: '',
    });
  };

  const handleEliminarDireccion = () => {
    if (!dirSeleccionada) return;
    const actualizadas = formData.direcciones.filter((d) => d.id !== dirSeleccionada.id);
    setFormData((prev) => ({ ...prev, direcciones: actualizadas }));
    setPerfil((prev) => ({ ...prev, direcciones: actualizadas }));
    setDirSeleccionada(null);
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 860, width: '100%', mx: 'auto', p: { xs: 1.5, sm: 3 }, boxSizing: 'border-box' }}>
        <Box
          component={editando ? 'form' : 'div'}
          onSubmit={editando ? handleGuardarDatos : undefined}
          sx={{
            width: '100%',
            bgcolor: 'var(--color-fondo)',
            border: '1.5px solid var(--color-texto-oscuro)',
            borderRadius: '28px',
            boxShadow: '0 12px 30px rgba(44, 44, 42, 0.22)',
            p: { xs: 2.5, sm: '36px 44px' },
            boxSizing: 'border-box',
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: 'var(--color-texto-oscuro)', mb: 3, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
          >
            {editando ? 'Edite sus Datos' : 'Mi Perfil'}
          </Typography>

          {mensajeExitoPass && (
            <Box
              sx={{
                mb: 2,
                p: 1.2,
                bgcolor: 'rgba(46, 125, 50, 0.15)',
                border: '1px solid #2e7d32',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                {mensajeExitoPass}
              </Typography>
            </Box>
          )}

          {!editando ? (
            /* ================= VISTA: VER PERFIL ================= */
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2.5,
                  bgcolor: 'var(--color-blanco)',
                  p: 2.5,
                  border: '1.2px solid var(--color-texto-oscuro)',
                  borderRadius: '16px',
                }}
              >
                <Box>
                  <Typography variant="caption" sx={labelCaptionStyle}>Nombres</Typography>
                  <Typography variant="body1" sx={valueTextStyle}>{perfil.nombres}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={labelCaptionStyle}>Apellidos</Typography>
                  <Typography variant="body1" sx={valueTextStyle}>{perfil.apellidos}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={labelCaptionStyle}>RUT</Typography>
                  <Typography variant="body1" sx={valueTextStyle}>{perfil.rut}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={labelCaptionStyle}>Correo Electrónico</Typography>
                  <Typography variant="body1" sx={valueTextStyle}>{perfil.correo}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={labelCaptionStyle}>Teléfonos Registrados</Typography>
                  {perfil.telefonos.map((t, idx) => (
                    <Typography key={idx} variant="body2" sx={valueTextStyle}>• {t}</Typography>
                  ))}
                </Box>

                <Box>
                  <Typography variant="caption" sx={labelCaptionStyle}>Direcciones Registradas</Typography>
                  {perfil.direcciones.map((d) => (
                    <Typography key={d.id} variant="body2" sx={valueTextStyle}>
                      • <strong>[{d.tipo}]</strong> {d.direccion} #{d.numero}, {d.comuna} ({d.region})
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Botones de acción principales */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, mt: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  disableElevation
                  onClick={() => {
                    setErrorCred('');
                    setCredRut('');
                    setCredPassword('');
                    setModalCredencialesOpen(true);
                  }}
                  sx={botonNaranjaPildora}
                >
                  Editar Perfil
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  disableElevation
                  onClick={() => {
                    setErrorCred('');
                    setErrorPass('');
                    setCredRut('');
                    setCredPassword('');
                    setNuevaPass('');
                    setConfirmarPass('');
                    setModalPasswordOpen('credenciales');
                  }}
                  sx={botonNaranjaPildora}
                >
                  Cambiar Contraseña
                </Button>
              </Box>
            </Box>
          ) : (
            /* ================= VISTA: EDITE SUS DATOS ================= */
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" sx={labelStyle}>Nombres</Typography>
                    <TextField fullWidth size="small" value={formData.nombres} onChange={handleChange('nombres')} required sx={inputRectStyle} />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={labelStyle}>Apellidos</Typography>
                    <TextField fullWidth size="small" value={formData.apellidos} onChange={handleChange('apellidos')} required sx={inputRectStyle} />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={labelStyle}>RUT</Typography>
                    <TextField fullWidth size="small" value={formData.rut} disabled sx={{ ...inputRectStyle, opacity: 0.8 }} />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={labelStyle}>Correo Electrónico</Typography>
                    <TextField fullWidth size="small" type="email" value={formData.correo} onChange={handleChange('correo')} required sx={inputRectStyle} />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ p: 1.5, bgcolor: 'var(--color-blanco)', border: '1.2px solid var(--color-texto-oscuro)' }}>
                    <Typography variant="caption" sx={labelStyle}>Teléfonos ({formData.telefonos.length})</Typography>
                    <Box sx={{ maxHeight: 65, overflowY: 'auto', mb: 1 }}>
                      {formData.telefonos.map((t, idx) => (
                        <Typography key={idx} variant="caption" sx={{ display: 'block', color: 'var(--color-texto-oscuro)' }}>
                          • {t}
                        </Typography>
                      ))}
                    </Box>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      disableElevation
                      onClick={() => setModalTelefonoOpen(true)}
                      sx={{ ...botonNaranjaPildora, height: 32, fontSize: '0.85rem' }}
                    >
                      Editar Teléfono
                    </Button>
                  </Box>

                  <Box sx={{ p: 1.5, bgcolor: 'var(--color-blanco)', border: '1.2px solid var(--color-texto-oscuro)' }}>
                    <Typography variant="caption" sx={labelStyle}>Direcciones ({formData.direcciones.length})</Typography>
                    <Box sx={{ maxHeight: 65, overflowY: 'auto', mb: 1 }}>
                      {formData.direcciones.map((d) => (
                        <Typography key={d.id} variant="caption" sx={{ display: 'block', color: 'var(--color-texto-oscuro)' }}>
                          • [{d.tipo}] {d.direccion} #{d.numero}, {d.comuna}
                        </Typography>
                      ))}
                    </Box>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      disableElevation
                      onClick={() => setModalDireccionOpen(true)}
                      sx={{ ...botonNaranjaPildora, height: 32, fontSize: '0.85rem' }}
                    >
                      Editar Dirección
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, mt: 3 }}>
                <Button type="submit" fullWidth variant="contained" disableElevation sx={botonNaranjaPildora}>
                  Guardar
                </Button>
                <Button type="button" fullWidth variant="contained" disableElevation onClick={handleCancelarEdicion} sx={botonNaranjaPildora}>
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ================= MODAL CREDENCIALES (PARA EDITAR PERFIL) ================= */}
      {modalCredencialesOpen && (
        <Box sx={modalBackdropStyle} onClick={() => setModalCredencialesOpen(false)}>
          <Box
            onClick={(e) => e.stopPropagation()}
            component="form"
            onSubmit={handleValidarCredenciales}
            sx={{
              width: '100%',
              maxWidth: 420,
              bgcolor: 'var(--color-fondo)',
              border: '1.5px solid var(--color-texto-oscuro)',
              borderRadius: '26px',
              p: { xs: 2.5, sm: '32px 36px' },
              boxShadow: '0 18px 45px rgba(44, 44, 42, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5, color: 'var(--color-texto-oscuro)', fontSize: '1.08rem' }}>
              Ingrese su Rut y su Contraseña
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, mb: 3, textAlign: 'left' }}>
              <Box>
                <Typography variant="caption" sx={labelStyle}>Rut</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={credRut}
                  onChange={(e) => setCredRut(formatearRut(e.target.value))}
                  required
                  sx={inputRectStyle}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={labelStyle}>Contraseña</Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  value={credPassword}
                  onChange={(e) => setCredPassword(e.target.value)}
                  required
                  sx={inputRectStyle}
                />
              </Box>

              {errorCred && (
                <Typography variant="caption" sx={{ color: 'red', fontWeight: 600 }}>
                  {errorCred}
                </Typography>
              )}
            </Box>

            <Button type="submit" fullWidth variant="contained" disableElevation sx={botonFigmaRectangular}>
              Acceder
            </Button>
          </Box>
        </Box>
      )}

      {/* ================= MODAL CREDENCIALES (PASO 1 PARA CAMBIAR CONTRASEÑA) ================= */}
      {modalPasswordOpen === 'credenciales' && (
        <Box sx={modalBackdropStyle} onClick={() => setModalPasswordOpen(false)}>
          <Box
            onClick={(e) => e.stopPropagation()}
            component="form"
            onSubmit={handleValidarCredencialesPassword}
            sx={{
              width: '100%',
              maxWidth: 420,
              bgcolor: 'var(--color-fondo)',
              border: '1.5px solid var(--color-texto-oscuro)',
              borderRadius: '26px',
              p: { xs: 2.5, sm: '32px 36px' },
              boxShadow: '0 18px 45px rgba(44, 44, 42, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'var(--color-texto-oscuro)', fontSize: '1.08rem' }}>
              Ingrese su Rut y su Contraseña
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--color-texto-oscuro)', mb: 2, display: 'block', opacity: 0.8 }}>
              Confirme sus credenciales actuales para cambiar la clave.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, mb: 3, textAlign: 'left' }}>
              <Box>
                <Typography variant="caption" sx={labelStyle}>Rut</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={credRut}
                  onChange={(e) => setCredRut(formatearRut(e.target.value))}
                  required
                  sx={inputRectStyle}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={labelStyle}>Contraseña Actual</Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  value={credPassword}
                  onChange={(e) => setCredPassword(e.target.value)}
                  required
                  sx={inputRectStyle}
                />
              </Box>

              {errorCred && (
                <Typography variant="caption" sx={{ color: 'red', fontWeight: 600 }}>
                  {errorCred}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button type="submit" fullWidth variant="contained" disableElevation sx={botonFigmaRectangular}>
                Continuar
              </Button>
              <Button
                type="button"
                fullWidth
                variant="text"
                onClick={() => setModalPasswordOpen(false)}
                sx={botonTextoCancelar}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* ================= MODAL INGRESO DE NUEVA CONTRASEÑA (PASO 2) ================= */}
      {modalPasswordOpen === true && (
        <Box sx={modalBackdropStyle} onClick={() => setModalPasswordOpen(false)}>
          <Box
            onClick={(e) => e.stopPropagation()}
            component="form"
            onSubmit={handleGuardarNuevaPassword}
            sx={{
              width: '100%',
              maxWidth: 420,
              bgcolor: 'var(--color-fondo)',
              border: '1.5px solid var(--color-texto-oscuro)',
              borderRadius: '26px',
              p: { xs: 2.5, sm: '32px 36px' },
              boxShadow: '0 18px 45px rgba(44, 44, 42, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-texto-oscuro)', fontSize: '1.08rem' }}>
              Nueva Contraseña
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, mb: 3, textAlign: 'left' }}>
              <Box>
                <Typography variant="caption" sx={labelStyle}>Nueva Contraseña</Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  value={nuevaPass}
                  onChange={(e) => setNuevaPass(e.target.value)}
                  required
                  sx={inputRectStyle}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={labelStyle}>Confirmar Contraseña</Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  value={confirmarPass}
                  onChange={(e) => setConfirmarPass(e.target.value)}
                  required
                  sx={inputRectStyle}
                />
              </Box>

              {errorPass && (
                <Typography variant="caption" sx={{ color: 'red', fontWeight: 600 }}>
                  {errorPass}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button type="submit" fullWidth variant="contained" disableElevation sx={botonFigmaRectangular}>
                Guardar Contraseña
              </Button>
              <Button
                type="button"
                fullWidth
                variant="text"
                onClick={() => setModalPasswordOpen(false)}
                sx={botonTextoCancelar}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* ================= MODAL EDITE TELÉFONO ================= */}
      {modalTelefonoOpen && (
        <Box sx={modalBackdropStyle} onClick={() => setModalTelefonoOpen(false)}>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: '100%',
              maxWidth: 440,
              bgcolor: 'var(--color-fondo)',
              border: '1.5px solid var(--color-texto-oscuro)',
              borderRadius: '30px',
              boxShadow: '0 18px 45px rgba(44, 44, 42, 0.35)',
              p: { xs: 2.5, sm: '30px 34px' },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: 120,
                border: '1.2px solid var(--color-texto-oscuro)',
                bgcolor: 'var(--color-blanco)',
                overflowY: 'auto',
                p: 1.2,
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.8,
              }}
            >
              {formData.telefonos.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'var(--color-borde)', fontStyle: 'italic', m: 'auto' }}>
                  Sin teléfonos registrados
                </Typography>
              ) : (
                formData.telefonos.map((tel, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setTelSeleccionado(tel)}
                    sx={{
                      p: 0.8,
                      cursor: 'pointer',
                      bgcolor: telSeleccionado === tel ? 'var(--color-fondo)' : 'transparent',
                      border: telSeleccionado === tel ? '1px solid var(--color-primario)' : '1px solid transparent',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500 }}>
                      {tel}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ingrese nuevo teléfono"
                value={nuevoTel}
                onChange={(e) => setNuevoTel(e.target.value)}
                sx={inputRectStyle}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button fullWidth variant="contained" disableElevation onClick={handleAgregarTelefono} sx={botonFigmaRectangular}>
                Agregar Teléfono
              </Button>
              <Button
                fullWidth
                variant="contained"
                disableElevation
                onClick={handleEliminarTelefono}
                disabled={!telSeleccionado}
                sx={botonFigmaRectangular}
              >
                Eliminar Teléfono
              </Button>
              <Button fullWidth variant="contained" disableElevation onClick={() => setModalTelefonoOpen(false)} sx={botonFigmaRectangular}>
                Salir
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* ================= MODAL EDITE DIRECCIÓN ================= */}
      {modalDireccionOpen && (
        <Box sx={modalBackdropStyle} onClick={() => setModalDireccionOpen(false)}>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: '100%',
              maxWidth: 480,
              maxHeight: '94vh',
              overflowY: 'auto',
              bgcolor: 'var(--color-fondo)',
              border: '1.5px solid var(--color-texto-oscuro)',
              borderRadius: '34px',
              boxShadow: '0 18px 45px rgba(44, 44, 42, 0.35)',
              p: { xs: 2.5, sm: '32px 36px' },
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: 120,
                border: '1.2px solid var(--color-texto-oscuro)',
                bgcolor: 'var(--color-blanco)',
                overflowY: 'auto',
                p: 1.2,
                mb: 1.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.8,
              }}
            >
              {formData.direcciones.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'var(--color-borde)', fontStyle: 'italic', m: 'auto' }}>
                  Sin direcciones registradas
                </Typography>
              ) : (
                formData.direcciones.map((d) => (
                  <Box
                    key={d.id}
                    onClick={() => setDirSeleccionada(d)}
                    sx={{
                      p: 0.8,
                      cursor: 'pointer',
                      bgcolor: dirSeleccionada?.id === d.id ? 'var(--color-fondo)' : 'transparent',
                      border: dirSeleccionada?.id === d.id ? '1px solid var(--color-primario)' : '1px solid transparent',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'var(--color-texto-oscuro)', fontWeight: 500, fontSize: '0.85rem' }}>
                      [{d.tipo}] {d.direccion} #{d.numero}, {d.comuna} - CP: {d.codigoPostal || 'S/N'} ({d.region})
                    </Typography>
                  </Box>
                ))
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={tipoInmueble === 'Tienda física'}
                    onChange={() => setTipoInmueble('Tienda física')}
                    sx={{ p: 0.5, color: 'var(--color-texto-oscuro)', '&.Mui-checked': { color: 'var(--color-primario)' } }}
                  />
                }
                label={<Typography sx={{ fontSize: '0.85rem', color: 'var(--color-texto-oscuro)' }}>Tienda física</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={tipoInmueble === 'Casa/Depto.'}
                    onChange={() => setTipoInmueble('Casa/Depto.')}
                    sx={{ p: 0.5, color: 'var(--color-texto-oscuro)', '&.Mui-checked': { color: 'var(--color-primario)' } }}
                  />
                }
                label={<Typography sx={{ fontSize: '0.85rem', color: 'var(--color-texto-oscuro)' }}>Casa/Depto.</Typography>}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2.5 }}>
              <Box>
                <Typography variant="caption" sx={labelStyle}>Ingrese Región</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={nuevaDir.region}
                  onChange={(e) => setNuevaDir({ ...nuevaDir, region: e.target.value })}
                  sx={inputRectStyle}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={labelStyle}>Ingrese Provincia</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={nuevaDir.provincia}
                  onChange={(e) => setNuevaDir({ ...nuevaDir, provincia: e.target.value })}
                  sx={inputRectStyle}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={labelStyle}>Ingrese Comuna</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={nuevaDir.comuna}
                  onChange={(e) => setNuevaDir({ ...nuevaDir, comuna: e.target.value })}
                  sx={inputRectStyle}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={labelStyle}>Ingrese Código Postal</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={nuevaDir.codigoPostal}
                  onChange={(e) => setNuevaDir({ ...nuevaDir, codigoPostal: e.target.value })}
                  sx={inputRectStyle}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={labelStyle}>Ingrese Dirección</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={nuevaDir.direccion}
                  onChange={(e) => setNuevaDir({ ...nuevaDir, direccion: e.target.value })}
                  sx={inputRectStyle}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={labelStyle}>Ingrese Número de Dirección</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={nuevaDir.numero}
                  onChange={(e) => setNuevaDir({ ...nuevaDir, numero: e.target.value })}
                  sx={inputRectStyle}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button fullWidth variant="contained" disableElevation onClick={handleAgregarDireccion} sx={botonFigmaRectangular}>
                Agregar Dirección
              </Button>
              <Button
                fullWidth
                variant="contained"
                disableElevation
                onClick={handleEliminarDireccion}
                disabled={!dirSeleccionada}
                sx={botonFigmaRectangular}
              >
                Eliminar Dirección
              </Button>
              <Button fullWidth variant="contained" disableElevation onClick={() => setModalDireccionOpen(false)} sx={botonFigmaRectangular}>
                Salir
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </MainLayout>
  );
}

const labelCaptionStyle = {
  color: 'var(--color-texto-oscuro)',
  fontWeight: 600,
  display: 'block',
};

const valueTextStyle = {
  color: 'var(--color-texto-oscuro)',
  fontWeight: 500,
  mt: 0.2,
};

const labelStyle = {
  color: 'var(--color-texto-oscuro)',
  fontWeight: 600,
  display: 'block',
  mb: 0.2,
};

const inputRectStyle = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    height: 32,
    backgroundColor: 'var(--color-blanco)',
    '& fieldset': {
      borderColor: 'var(--color-texto-oscuro)',
      borderWidth: '1.2px',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-texto-oscuro)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-primario)',
    },
  },
  '& .MuiInputBase-input': {
    py: 0.5,
    px: 1.2,
    fontSize: '0.86rem',
    color: 'var(--color-texto-oscuro)',
  },
};

const botonNaranjaPildora = {
  height: 38,
  borderRadius: '20px',
  bgcolor: 'var(--color-primario)',
  color: 'var(--color-fondo)',
  border: '1.5px solid var(--color-texto-oscuro)',
  boxShadow: '0 4px 6px rgba(44, 44, 42, 0.4)',
  fontWeight: 600,
  fontSize: '0.95rem',
  textTransform: 'none',
  '&:hover': {
    bgcolor: 'var(--color-primario)',
  },
};

const botonFigmaRectangular = {
  height: 34,
  borderRadius: '4px',
  bgcolor: 'var(--color-primario)',
  color: 'var(--color-fondo)',
  boxShadow: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  textTransform: 'none',
  '&:hover': {
    bgcolor: 'var(--color-primario)',
  },
  '&:disabled': {
    bgcolor: 'rgba(195, 85, 43, 0.4)',
    color: 'var(--color-fondo)',
  },
};

const botonTextoCancelar = {
  height: 32,
  color: 'var(--color-primario)',
  fontWeight: 600,
  fontSize: '0.9rem',
  textTransform: 'none',
  '&:hover': {
    bgcolor: 'transparent',
    textDecoration: 'underline',
  },
};

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  bgcolor: 'rgba(44, 44, 42, 0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1400,
  p: 2,
  boxSizing: 'border-box',
};