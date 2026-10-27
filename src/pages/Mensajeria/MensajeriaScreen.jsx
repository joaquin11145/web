import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MainLayout from '../../components/templates/MainLayout/MainLayout';

const chatsIniciales = [
  { id: 1, nombre: 'Tienda Oficial' },
  { id: 2, nombre: 'Soporte MeyerExpress' },
  { id: 3, nombre: 'Vendedor Textil' },
  { id: 4, nombre: 'Calzados Chile' },
];

const mensajesIniciales = {
  1: [
    { remitente: 'contacto', texto: '¡Hola! ¿En qué podemos ayudarte con tu pedido?' },
    { remitente: 'yo', texto: 'Hola, quería consultar la disponibilidad de stock de la polera roja.' },
  ],
  2: [
    { remitente: 'contacto', texto: 'Bienvenido al canal de asistencia técnica.' },
  ],
  3: [],
  4: [],
};

export default function MensajeriaScreen({ cartProps = {} }) {
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down('md'));

  const [chatActivo, setChatActivo] = useState(chatsIniciales[0]);
  const [mensajesPorChat, setMensajesPorChat] = useState(mensajesIniciales);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [vistaMovil, setVistaMovil] = useState('lista');

  const handleSeleccionarChat = (chat) => {
    setChatActivo(chat);
    if (esMovil) {
      setVistaMovil('chat');
    }
  };

  const handleVolverALista = () => {
    setVistaMovil('lista');
  };

  const handleEnviar = (e) => {
    if (e) e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    const texto = nuevoMensaje.trim();
    setMensajesPorChat((prev) => ({
      ...prev,
      [chatActivo.id]: [...(prev[chatActivo.id] || []), { remitente: 'yo', texto }],
    }));
    setNuevoMensaje('');
  };

  const conversacionActual = mensajesPorChat[chatActivo.id] || [];

  return (
    <MainLayout {...cartProps}>
      <Box
        sx={{
          width: '100%',
          height: { xs: 'calc(100vh - 100px)', md: 'calc(100vh - 120px)' },
          border: '1.5px solid var(--color-borde)',
          borderRadius: { xs: 0, md: '12px' },
          bgcolor: 'var(--color-fondo)',
          display: 'flex',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(44, 44, 42, 0.08)',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: 280 },
            borderRight: { xs: 'none', md: '1.5px solid var(--color-borde)' },
            bgcolor: 'var(--color-fondo)',
            display: {
              xs: vistaMovil === 'lista' ? 'flex' : 'none',
              md: 'flex',
            },
            flexDirection: 'column',
            p: 2,
            gap: 1.5,
            flexShrink: 0,
            boxSizing: 'border-box',
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '1.15rem',
              color: 'var(--color-primario)',
              mb: 1,
            }}
          >
            Mensajes
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {chatsIniciales.map((chat) => {
              const seleccionado = chatActivo.id === chat.id;
              return (
                <Box
                  key={chat.id}
                  onClick={() => handleSeleccionarChat(chat)}
                  sx={{
                    bgcolor: seleccionado ? 'rgba(195, 85, 43, 0.18)' : 'var(--color-input-bg)',
                    border: '1px solid',
                    borderColor: seleccionado ? 'var(--color-primario)' : 'var(--color-borde)',
                    borderRadius: '8px',
                    p: 1.5,
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: seleccionado ? 'rgba(195, 85, 43, 0.18)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.92rem',
                      fontWeight: seleccionado ? 700 : 500,
                      color: seleccionado ? 'var(--color-primario)' : 'var(--color-texto-oscuro)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {chat.nombre}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: {
              xs: vistaMovil === 'chat' ? 'flex' : 'none',
              md: 'flex',
            },
            flexDirection: 'column',
            bgcolor: 'var(--color-input-bg)',
            height: '100%',
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderBottom: '1px solid var(--color-borde)',
              bgcolor: 'var(--color-fondo)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {esMovil && (
              <IconButton
                size="small"
                onClick={handleVolverALista}
                sx={{ color: 'var(--color-primario)', mr: 0.5 }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--color-texto-oscuro)',
              }}
            >
              {chatActivo.nombre}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              p: 2.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              overflowY: 'auto',
              bgcolor: 'var(--color-fondo)',
            }}
          >
            {conversacionActual.length === 0 ? (
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--color-borde)',
                  fontStyle: 'italic',
                  m: 'auto',
                }}
              >
                Inicia una conversación con {chatActivo.nombre}
              </Typography>
            ) : (
              conversacionActual.map((msg, index) => {
                const esMio = msg.remitente === 'yo';
                return (
                  <Box
                    key={index}
                    sx={{
                      alignSelf: esMio ? 'flex-end' : 'flex-start',
                      maxWidth: { xs: '85%', sm: '75%' },
                      bgcolor: esMio ? 'var(--color-primario)' : 'var(--color-input-bg)',
                      color: esMio ? 'var(--color-texto-claro)' : 'var(--color-texto-oscuro)',
                      border: esMio ? 'none' : '1px solid var(--color-borde)',
                      borderRadius: esMio ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      p: 1.4,
                      boxShadow: '0 2px 4px rgba(44, 44, 42, 0.08)',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.35 }}>
                      {msg.texto}
                    </Typography>
                  </Box>
                );
              })
            )}
          </Box>

          <Box
            component="form"
            onSubmit={handleEnviar}
            sx={{
              borderTop: '1px solid var(--color-borde)',
              p: 2,
              bgcolor: 'var(--color-fondo)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontWeight: 600,
                color: 'var(--color-texto-oscuro)',
                mb: 0.6,
                fontSize: '0.82rem',
              }}
            >
              Enviar mensaje
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Escriba acá ..."
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                sx={{
                  bgcolor: 'var(--color-input-bg)',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    height: 38,
                    '& fieldset': { borderColor: 'var(--color-borde)' },
                    '&:hover fieldset': { borderColor: 'var(--color-texto-oscuro)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-primario)' },
                  },
                  '& .MuiInputBase-input': {
                    py: 0.8,
                    px: 1.4,
                    fontSize: '0.9rem',
                    color: 'var(--color-texto-oscuro)',
                  },
                }}
              />
              <IconButton
                type="submit"
                sx={{
                  bgcolor: 'var(--color-primario)',
                  color: 'var(--color-texto-claro)',
                  borderRadius: '8px',
                  width: 38,
                  height: 38,
                  '&:hover': {
                    bgcolor: 'var(--color-primario-hover)',
                  },
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}