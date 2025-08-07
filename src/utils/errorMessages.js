/**
 * Mapea los mensajes de error de Supabase a mensajes amigables para el usuario.
 * @param {string} errorMessage - Mensaje de error recibido de Supabase.
 * @returns {string} Mensaje amigable para mostrar en la UI.
 */
const getErrorMessage = (errorMessage) => {
  switch (errorMessage) {
    case 'User already registered':
    case 'User already exists':
      return 'El email ya está registrado. Probá iniciar sesión.';
    case 'Invalid email or password':
    case 'Invalid login credentials':
      return 'Email o contraseña incorrectos.';
    case 'Password should be at least 6 characters':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'Signup requires a valid password':
      return 'Ingresá una contraseña válida.';
    case 'Signup requires a valid email':
      return 'Ingresá un email válido.';
    default:
      return 'Error en el registro. Por favor, intentá de nuevo.';
  }
};

export default getErrorMessage;