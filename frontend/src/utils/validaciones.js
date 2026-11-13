// Formateo automático de RUT chileno: 12.345.678-K
export function formatearRut(valor) {
  if (!valor) return '';
  const limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
  if (limpio.length <= 1) return limpio;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  let cuerpoFormateado = '';
  let contador = 0;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
    contador++;
    if (contador === 3 && i !== 0) {
      cuerpoFormateado = '.' + cuerpoFormateado;
      contador = 0;
    }
  }

  return `${cuerpoFormateado}-${dv}`;
}

// Validación matemática de RUT (Módulo 11 oficial de Chile)
export function validarRut(rutCompleto) {
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

// Formateo en caliente de teléfono (+56 9 XXXX XXXX)
export function formatearTelefono(valor) {
  if (!valor) return '';
  let numeros = valor.replace(/\D/g, '');

  if (numeros.startsWith('569')) numeros = '9' + numeros.slice(3);
  else if (numeros.startsWith('56')) numeros = numeros.slice(2);

  numeros = numeros.slice(0, 9);

  if (numeros.length === 0) return '';
  if (numeros.length <= 1) return `+56 ${numeros}`;
  if (numeros.length <= 5) return `+56 ${numeros.slice(0, 1)} ${numeros.slice(1)}`;
  return `+56 ${numeros.slice(0, 1)} ${numeros.slice(1, 5)} ${numeros.slice(5)}`;
}

export function validarTelefono(valor) {
  if (!valor) return false;
  const digitos = valor.replace(/\D/g, '');
  return digitos.length === 9 || digitos.length === 11;
}

// Validación estricta de correo electrónico
export function validarEmail(email) {
  if (!email) return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).trim().toLowerCase());
}

// Validación de contraseña
export function validarPassword(pass) {
  if (!pass) return false;
  return pass.trim().length >= 6;
}

// Limpieza para nombres y texto (sin números ni símbolos)
export function limpiarSoloLetras(texto) {
  return texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
}