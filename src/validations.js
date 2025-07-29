import * as yup from 'yup';

export const registerSchema = yup.object({
  email: yup
    .string()
    .required('El correo es obligatorio')
    .email('Formato de correo inválido'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Tenés que confirmar la contraseña'),
});