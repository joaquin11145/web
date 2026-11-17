import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

import MainLayout from '../../components/templates/MainLayout/MainLayout';
import LoginField from '../../components/molecules/LoginField/LoginField';
import CustomButton from '../../components/atoms/Button/CustomButton';
import { useCrudFeedback } from '../../components/organisms/CrudFeedback/CrudFeedbackProvider';
import { hashPassword } from '../../utils/security';

function formatearRut(valor) {
  if (!valor) return '';
  const limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpio.length <= 1) return limpio;
  const dv = limpio.slice(-1);
  let cuerpo = limpio.slice(0, -1);
  cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${cuerpo}-${dv}`;
}

export default function UsuariosAdminScreen({
  usuarios = [],
  onCrearUsuarioAdmin,
  onEditarUsuarioAdmin,
  onEliminarUsuarioAdmin,
  cartProps = {},
}) {
  const navigate = useNavigate();
  const { confirmarAccion, mostrarExito, mostrarError } = useCrudFeedback();

  const [filtroRol, setFiltroRol] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Modal Crear / Editar
  const [openModal, setOpenModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [rutOriginalEditar, setRutOriginalEditar] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alertaModal, setAlertaModal] = useState('');

  const [formUsuario, setFormUsuario] = useState({
    rut: '',
    name: '',
    email: '',
    rol: 'comprador',
    nombreEmpresa: '',
    paginaWeb: '',
    telefono: '',
    direccion: '',
    password: '',
  });

  const obtenerRolNormalizado = (u) => {
    if (u.rol === 'admin' || (u.rut || '').replace(/[^0-9kK]/g, '') === '999999999') {
      return 'admin';
    }
    if (u.soyEmpresa || u.rol === 'emprendedor') {
      return 'emprendedor';
    }
    return 'comprador';
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const rolUsuario = obtenerRolNormalizado(u);
    const coincideRol = filtroRol === 'todos' || rolUsuario === filtroRol;
    const termino = busqueda.trim().toLowerCase();
    const coincideBusqueda =
      !termino ||
      (u.name || '').toLowerCase().includes(termino) ||
      (u.rut || '').toLowerCase().includes(termino) ||
      (u.email || '').toLowerCase().includes(termino) ||
      (u.nombreEmpresa || '').toLowerCase().includes(termino);

    return coincideRol && coincideBusqueda;
  });

  const handleAbrirCrear = () => {
    setModoEdicion(false);
    setRutOriginalEditar('');
    setAlertaModal('');
    setFormUsuario({
      rut: '',
      name: '',
      email: '',
      rol: 'comprador',
      nombreEmpresa: '',
      paginaWeb: '',
      telefono: '+56 9 ',
      direccion: '',
      password: '',
    });
    setOpenModal(true);
  };

  const handleAbrirEditar = (usuario) => {
    const rolDetectado = obtenerRolNormalizado(usuario);
    setModoEdicion(true);
    setRutOriginalEditar(usuario.rut);
    setAlertaModal('');
    setFormUsuario({
      rut: usuario.rut || '',
      name: usuario.name || '',
      email: usuario.email || '',
      rol: rolDetectado,
      nombreEmpresa: usuario.nombreEmpresa || '',
      paginaWeb: usuario.paginaWeb || '',
      telefono: Array.isArray(usuario.telefonos) && usuario.telefonos.length > 0 ? usuario.telefonos[0] : '',
      direccion:
        Array.isArray(usuario.direcciones) && usuario.direcciones.length > 0
          ? `${usuario.direcciones[0].direccion || ''} ${usuario.direcciones[0].numero || ''}, ${usuario.direcciones[0].comuna || ''}`.trim()
          : '',
      password: '',
    });
    setOpenModal(true);
  };

  const handleGuardarUsuario = async () => {
    if (!formUsuario.rut.trim() || !formUsuario.name.trim() || !formUsuario.email.trim()) {
      setAlertaModal('RUT, Nombre completo y Correo electrónico son obligatorios.');
      mostrarError('Error de validación: faltan campos obligatorios.');
      return;
    }

    if (formUsuario.rol === 'emprendedor' && !formUsuario.nombreEmpresa.trim()) {
      setAlertaModal('Para el rol Emprendedor debe indicar el nombre de la empresa.');
      mostrarError('Error de validación: nombre de empresa requerido.');
      return;
    }

    if (!modoEdicion && (!formUsuario.password.trim() || formUsuario.password.length < 4)) {
      setAlertaModal('Debe asignar una contraseña inicial de al menos 4 caracteres.');
      mostrarError('Error de validación: contraseña demasiado corta.');
      return;
    }

    if (modoEdicion && formUsuario.password.trim() && formUsuario.password.length < 4) {
      setAlertaModal('Si desea cambiar la contraseña, debe tener al menos 4 caracteres.');
      mostrarError('Error de validación: contraseña demasiado corta.');
      return;
    }

    if (!modoEdicion) {
      const existeRut = usuarios.some(
        (u) =>
          (u.rut || '').replace(/[^0-9kK]/g, '').toUpperCase() ===
          formUsuario.rut.trim().replace(/[^0-9kK]/g, '').toUpperCase()
      );
      if (existeRut) {
        setAlertaModal('Ya existe un usuario registrado con ese RUT.');
        mostrarError('Error: el RUT ya se encuentra registrado en el sistema.');
        return;
      }
    }

    confirmarAccion({
      titulo: modoEdicion ? 'Confirmar Actualización de Usuario' : 'Confirmar Creación de Usuario',
      mensaje: modoEdicion
        ? `¿Deseas guardar los cambios realizados en la cuenta de "${formUsuario.name.trim()}" (${formUsuario.rut})?`
        : `¿Deseas crear la cuenta para "${formUsuario.name.trim()}" con rol ${formUsuario.rol.toUpperCase()}?`,
      textoConfirmar: modoEdicion ? 'Guardar Cambios' : 'Crear Usuario',
      onConfirmar: async () => {
        try {
          const soyEmpresaFlag = formUsuario.rol === 'emprendedor';
          let nuevoHash = undefined;
          if (formUsuario.password.trim()) {
            nuevoHash = await hashPassword(formUsuario.password.trim());
          }

          const datosProcesados = {
            rut: formUsuario.rut.trim(),
            name: formUsuario.name.trim(),
            email: formUsuario.email.trim(),
            rol: formUsuario.rol,
            soyEmpresa: soyEmpresaFlag,
            nombreEmpresa: soyEmpresaFlag
              ? formUsuario.nombreEmpresa.trim()
              : formUsuario.rol === 'admin'
              ? 'Administración Central'
              : '',
            tieneWeb: Boolean(formUsuario.paginaWeb.trim()),
            paginaWeb: formUsuario.paginaWeb.trim(),
            telefonos: formUsuario.telefono.trim() ? [formUsuario.telefono.trim()] : [],
            direcciones: formUsuario.direccion.trim()
              ? [{ id: 1, direccion: formUsuario.direccion.trim(), numero: '', comuna: 'Osorno', region: 'Los Lagos' }]
              : [],
            ...(nuevoHash ? { passwordHash: nuevoHash } : {}),
          };

          if (modoEdicion) {
            if (onEditarUsuarioAdmin) {
              onEditarUsuarioAdmin(rutOriginalEditar, datosProcesados);
            }
            mostrarExito(`Usuario "${datosProcesados.name}" actualizado correctamente.`);
          } else {
            if (onCrearUsuarioAdmin) {
              onCrearUsuarioAdmin({
                ...datosProcesados,
                fechaCreacion: new Date().toISOString(),
              });
            }
            mostrarExito(`Usuario "${datosProcesados.name}" creado y cifrado con Bcrypt correctamente.`);
          }
          setOpenModal(false);
        } catch (err) {
          mostrarError('No se pudo procesar la operación sobre el usuario.');
        }
      },
    });
  };

  const handleSolicitarEliminar = (usuario) => {
    confirmarAccion({
      titulo: 'Confirmar Eliminación de Usuario',
      mensaje: `¿Estás seguro de eliminar permanentemente la cuenta de "${usuario.name}" (${usuario.rut})? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar Definitivamente',
      esDestructivo: true,
      onConfirmar: () => {
        try {
          if (onEliminarUsuarioAdmin) {
            onEliminarUsuarioAdmin(usuario.rut);
          }
          mostrarExito(`La cuenta de "${usuario.name}" fue eliminada correctamente.`);
        } catch (err) {
          mostrarError('Ocurrió un fallo al intentar eliminar el usuario.');
        }
      },
    });
  };

  const renderBadgeRol = (rol) => {
    if (rol === 'admin') {
      return (
        <Chip
          label="Administrador"
          size="small"
          sx={{ bgcolor: '#222222', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem' }}
        />
      );
    }
    if (rol === 'emprendedor') {
      return (
        <Chip
          label="Emprendedor"
          size="small"
          sx={{ bgcolor: 'var(--color-primario)', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem' }}
        />
      );
    }
    return (
      <Chip
        label="Comprador"
        size="small"
        variant="outlined"
        sx={{ borderColor: 'var(--color-texto-oscuro)', color: 'var(--color-texto-oscuro)', fontWeight: 700, fontSize: '0.75rem' }}
      />
    );
  };

  return (
    <MainLayout {...cartProps}>
      <Box sx={{ maxWidth: 980, mx: 'auto', p: { xs: 1.5, sm: 3 }, pb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin')}
            sx={{
              textTransform: 'none',
              color: 'var(--color-texto-oscuro)',
              fontWeight: 600,
              fontSize: '0.95rem',
              borderRadius: '12px',
              px: 1.5,
              py: 0.6,
              '&:hover': {
                bgcolor: 'rgba(195, 85, 43, 0.08)',
                color: 'var(--color-primario)',
              },
            }}
          >
            Volver a Administrar
          </Button>

          <Button
            variant="contained"
            disableElevation
            startIcon={<PersonAddAlt1OutlinedIcon />}
            onClick={handleAbrirCrear}
            sx={{
              borderRadius: '20px',
              bgcolor: 'var(--color-primario)',
              color: 'var(--color-texto-claro)',
              border: '1.5px solid var(--color-texto-oscuro)',
              boxShadow: '0 4px 6px rgba(44, 44, 42, 0.3)',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              height: 42,
              '&:hover': { bgcolor: 'var(--color-primario-hover, var(--color-primario))' },
            }}
          >
            + Nuevo Usuario
          </Button>
        </Box>

        <Typography
          sx={{
            fontSize: { xs: '1.35rem', sm: '1.65rem' },
            fontWeight: 800,
            color: 'var(--color-texto-oscuro)',
            mb: 2,
          }}
        >
          Gestión Integral de Usuarios ({usuariosFiltrados.length})
        </Typography>

        <Box
          sx={{
            border: '1.5px solid var(--color-texto-oscuro)',
            borderRadius: '24px',
            p: { xs: 2, sm: 3 },
            bgcolor: 'var(--color-fondo)',
            boxShadow: '0 8px 24px rgba(44, 44, 42, 0.08)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 2,
              mb: 2.5,
            }}
          >
            <Tabs
              value={filtroRol}
              onChange={(e, val) => setFiltroRol(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: 'var(--color-texto-oscuro)',
                },
                '& .Mui-selected': {
                  color: 'var(--color-primario) !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'var(--color-primario)',
                },
              }}
            >
              <Tab label={`Todos (${usuarios.length})`} value="todos" />
              <Tab
                label={`Compradores (${usuarios.filter((u) => obtenerRolNormalizado(u) === 'comprador').length})`}
                value="comprador"
              />
              <Tab
                label={`Emprendedores (${usuarios.filter((u) => obtenerRolNormalizado(u) === 'emprendedor').length})`}
                value="emprendedor"
              />
              <Tab
                label={`Administradores (${usuarios.filter((u) => obtenerRolNormalizado(u) === 'admin').length})`}
                value="admin"
              />
            </Tabs>

            <TextField
              size="small"
              placeholder="Buscar por nombre, RUT o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'var(--color-primario)' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                minWidth: { xs: '100%', md: 280 },
                bgcolor: 'var(--color-input-bg)',
                borderRadius: '14px',
                '& .MuiOutlinedInput-root': { borderRadius: '14px' },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {usuariosFiltrados.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4, color: 'var(--color-borde)', fontStyle: 'italic' }}>
                No se encontraron usuarios que coincidan con el filtro seleccionado.
              </Typography>
            ) : (
              usuariosFiltrados.map((usuario) => {
                const rol = obtenerRolNormalizado(usuario);
                const esCuentaActual =
                  (cartProps?.currentUser?.rut || '').replace(/[^0-9kK]/g, '') ===
                  (usuario.rut || '').replace(/[^0-9kK]/g, '');

                return (
                  <Box
                    key={usuario.rut}
                    sx={{
                      border: '1.2px solid var(--color-texto-oscuro)',
                      borderRadius: '16px',
                      p: 2.2,
                      bgcolor: 'var(--color-input-bg)',
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'var(--color-primario)',
                        boxShadow: '0 4px 12px rgba(44, 44, 42, 0.12)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-texto-oscuro)' }}>
                          {usuario.name}
                        </Typography>
                        {renderBadgeRol(rol)}
                        {esCuentaActual && (
                          <Chip
                            label="Tu Sesión"
                            size="small"
                            sx={{ bgcolor: '#2e7d32', color: '#fff', fontWeight: 700, fontSize: '0.72rem' }}
                          />
                        )}
                      </Box>

                      <Typography sx={{ fontSize: '0.88rem', color: 'var(--color-texto-oscuro)' }}>
                        <strong>RUT:</strong> {usuario.rut} • <strong>Correo:</strong> {usuario.email}
                      </Typography>

                      {rol === 'emprendedor' && usuario.nombreEmpresa && (
                        <Typography sx={{ fontSize: '0.86rem', color: 'var(--color-primario)', fontWeight: 600 }}>
                          Empresa: {usuario.nombreEmpresa} {usuario.paginaWeb ? `(${usuario.paginaWeb})` : ''}
                        </Typography>
                      )}

                      {Array.isArray(usuario.telefonos) && usuario.telefonos.length > 0 && (
                        <Typography sx={{ fontSize: '0.84rem', color: 'var(--color-texto-oscuro)' }}>
                          <strong>Teléfono:</strong> {usuario.telefonos.join(', ')}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                      <IconButton
                        size="small"
                        title="Enviar Mensaje"
                        onClick={() => navigate('/mensajes')}
                        sx={{
                          border: '1px solid var(--color-borde)',
                          color: 'var(--color-texto-oscuro)',
                          '&:hover': { color: 'var(--color-primario)', borderColor: 'var(--color-primario)' },
                        }}
                      >
                        <EmailOutlinedIcon fontSize="small" />
                      </IconButton>

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => handleAbrirEditar(usuario)}
                        sx={{
                          borderRadius: '16px',
                          borderColor: 'var(--color-primario)',
                          color: 'var(--color-primario)',
                          textTransform: 'none',
                          fontWeight: 700,
                          px: 1.8,
                        }}
                      >
                        Editar
                      </Button>

                      <IconButton
                        size="small"
                        title={esCuentaActual ? 'No puedes eliminar tu propia cuenta activa' : 'Eliminar Usuario'}
                        disabled={esCuentaActual}
                        onClick={() => handleSolicitarEliminar(usuario)}
                        sx={{
                          border: '1px solid',
                          borderColor: esCuentaActual ? 'var(--color-borde)' : '#d32f2f',
                          color: esCuentaActual ? 'var(--color-borde)' : '#d32f2f',
                          '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>

        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: '24px',
                border: '1.5px solid var(--color-texto-oscuro)',
                p: 2,
                bgcolor: 'var(--color-fondo)',
              },
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 800,
              color: 'var(--color-primario)',
              fontSize: '1.15rem',
              pb: 1,
            }}
          >
            {modoEdicion ? 'Editar Cuenta de Usuario' : 'Crear Nuevo Usuario'}
            <IconButton onClick={() => setOpenModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Divider sx={{ borderColor: 'var(--color-borde)', mb: 2 }} />

          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 0 }}>
            <Collapse in={Boolean(alertaModal)}>
              <Alert severity="error" sx={{ mb: 1, borderRadius: '8px', fontSize: '0.84rem' }}>
                {alertaModal}
              </Alert>
            </Collapse>

            <TextField
              select
              label="Tipo de Usuario (Rol)"
              value={formUsuario.rol}
              onChange={(e) => setFormUsuario({ ...formUsuario, rol: e.target.value })}
              fullWidth
              size="small"
              sx={{ bgcolor: 'var(--color-input-bg)', borderRadius: '10px' }}
            >
              <MenuItem value="comprador">Comprador (Cliente)</MenuItem>
              <MenuItem value="emprendedor">Emprendedor (Vendedor / Empresa)</MenuItem>
              <MenuItem value="admin">Administrador del Sistema</MenuItem>
            </TextField>

            <LoginField
              label="RUT"
              placeholder="12.345.678-9"
              value={formUsuario.rut}
              onChange={(e) => setFormUsuario({ ...formUsuario, rut: formatearRut(e.target.value) })}
              disabled={modoEdicion}
              maxLength={12}
              required
            />

            <LoginField
              label="Nombre Completo"
              placeholder="Ej: Andrea Muñoz"
              value={formUsuario.name}
              onChange={(e) => setFormUsuario({ ...formUsuario, name: e.target.value })}
              required
            />

            <LoginField
              label="Correo Electrónico"
              type="email"
              placeholder="usuario@meyerexpress.cl"
              value={formUsuario.email}
              onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })}
              required
            />

            {formUsuario.rol === 'emprendedor' && (
              <>
                <LoginField
                  label="Nombre de la Empresa / Tienda"
                  placeholder="Ej: Calzados Osorno SpA"
                  value={formUsuario.nombreEmpresa}
                  onChange={(e) => setFormUsuario({ ...formUsuario, nombreEmpresa: e.target.value })}
                  required
                />
                <LoginField
                  label="Sitio Web (Opcional)"
                  placeholder="https://mitienda.cl"
                  value={formUsuario.paginaWeb}
                  onChange={(e) => setFormUsuario({ ...formUsuario, paginaWeb: e.target.value })}
                />
              </>
            )}

            <LoginField
              label="Teléfono de Contacto"
              placeholder="+56 9 1234 5678"
              value={formUsuario.telefono}
              onChange={(e) => setFormUsuario({ ...formUsuario, telefono: e.target.value })}
            />

            <LoginField
              label={modoEdicion ? 'Nueva Contraseña (Opcional - se cifra con Bcrypt)' : 'Contraseña Inicial (Se cifra con Bcrypt)'}
              placeholder={modoEdicion ? 'Dejar en blanco para mantener clave actual' : 'Mínimo 4 caracteres'}
              value={formUsuario.password}
              onChange={(e) => setFormUsuario({ ...formUsuario, password: e.target.value })}
              isPassword={true}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              required={!modoEdicion}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 1.5, display: 'flex', gap: 1.5 }}>
            <CustomButton pill outlined onClick={() => setOpenModal(false)}>
              Cancelar
            </CustomButton>
            <CustomButton pill onClick={handleGuardarUsuario}>
              {modoEdicion ? 'Guardar Cambios' : 'Crear Usuario'}
            </CustomButton>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}