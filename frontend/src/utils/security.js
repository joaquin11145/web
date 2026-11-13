import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Genera un hash asíncrono con salt mediante bcrypt
 */
export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(plainPassword, salt);
}

/**
 * Compara de forma segura una contraseña en texto plano contra su hash bcrypt
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) return false;
  return await bcrypt.compare(plainPassword, hashedPassword);
}