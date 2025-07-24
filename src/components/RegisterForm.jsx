import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import {
  FormControl,
  FormHelperText,
  Stack,
  Box,
  InputLabel,
  Input,
  IconButton,
  InputAdornment,
  Typography,
  Link,
  AlertTitle,
  Alert
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import appTheme from '../theme';
import supabaseClient from '../supabase.js';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../validations.js';
import useAuth from '../hooks/useAuth'

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const { register: registerAuth } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onTouched'
  });

  const onSubmit = async (data) => {
    setErrorMessage('');
    setSuccessMessage('');

    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();

    try {
      const { data, error } = await registerAuth({ email, password });

      console.log('Registro:', data, error);

      if (error) {
        let mensaje;
        switch (error.status) {
          case 400:
            mensaje = 'Datos inválidos. Revisa tu correo y contraseña.';
            break;
          case 409:
            mensaje = 'El correo electrónico ya está en uso.';
            break;
          case 422:
            mensaje = 'La contraseña debe tener al menos 6 caracteres.';
            break;
          case 500:
            mensaje = 'Error del servidor. Por favor, intentá nuevamente más tarde.';
            break;
          default:
            mensaje = 'No se pudo registrar. Intentá de nuevo.';
        }
        setErrorMessage(mensaje);
      } else {
        setSuccessMessage('¡Registro exitoso! Ahora podés iniciar sesión.');
        // Navegar después de 3s y guardar referencia para cleanup
        timeoutRef.current = setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error en el registro. Por favor, intenta más tarde.');
    }
  };

   // Limpieza del timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => e.preventDefault();

  return (
    <Stack direction="column" alignItems="center">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ margin: '2rem auto', padding: '1rem', width: '100%' }}>

          {/* Email */}
          <FormControl variant="standard" fullWidth error={!!errors.email} sx={{ mb: 3 }}>
            <InputLabel htmlFor="email" sx={{ fontSize: 14, color: appTheme.palette.primary.main }}>
              Email
            </InputLabel>
            <Input
              id="email"
              type="email"
              {...register('email')}
            />
            {errors.email && (
              <FormHelperText>{errors.email.message}</FormHelperText>
            )}
          </FormControl>

          {/* Password */}
          <FormControl variant="standard" fullWidth error={!!errors.password} sx={{ mb: 3 }}>
            <InputLabel htmlFor="password" sx={{ fontSize: 14, color: appTheme.palette.primary.main }}>
              Contraseña
            </InputLabel>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    color="primary"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.password && (
              <FormHelperText>{errors.password.message}</FormHelperText>
            )}
          </FormControl>

          {/* Repetir Password */}
          <FormControl variant="standard" fullWidth error={!!errors.repeatPassword} sx={{ mb: 3 }}>
            <InputLabel htmlFor="repeatPassword" sx={{ fontSize: 14, color: appTheme.palette.primary.main }}>
              Confirmar contraseña
            </InputLabel>
            <Input
              id="repeatPassword"
              type={showPassword ? 'text' : 'password'}
              {...register('repeatPassword')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    color="primary"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.repeatPassword && (
              <FormHelperText>{errors.repeatPassword.message}</FormHelperText>
            )}
          </FormControl>

          {/* Errores de Servidor */}
          {errorMessage && (
            <Alert severity="error" icon={false} sx={{ mt: 2 }}>
              <AlertTitle sx={{ fontSize: 12 }}>{errorMessage}</AlertTitle>
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" icon={false} sx={{ mt: 2 }}>
              <AlertTitle sx={{ fontSize: 12 }}>{successMessage}</AlertTitle>
            </Alert>
          )}

        </Box>

        <Box>
          <Typography align="center" variant="subtitle2" color="primary.dark">
            ¿Ya tenés una cuenta?{' '}
            <Link component={RouterLink} to="/login" color="primary.dark" fontWeight={700}>
              Ingresá
            </Link>
          </Typography>
        </Box>

        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
          sx={{
            textTransform: 'capitalize',
            fontSize: 18,
            fontFamily: 'Poppins',
            fontWeight: 700,
            width: '100%',
            mt: 4,
            mb: 2
          }}
        >
          {isSubmitting ? 'Registrando…' : 'Registrarme'}
        </Button>
      </form>
    </Stack>
  );
};

export default RegisterForm;
