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
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../validations.js';
import useAuth from '../hooks/useAuth'
import getErrorMessage from '../utils/errorMessages';

const RegisterForm = () => {

  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    if (data.password !== data.repeatPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      await registerUser({ email: data.email, password: data.password });
      setSuccess('¡Registro exitoso! Ahora podés iniciar sesión.');
      reset();
    } catch (err) {
      setError(getErrorMessage(err.message));
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Stack direction="column" alignItems="center">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ margin: '2rem auto', padding: '1rem', width: '100%', maxWidth: '400px' }}>

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
          {error && (
            <Alert severity="error" icon={false} sx={{ mt: 2 }}>
              <AlertTitle sx={{ fontSize: 12 }}>{error}</AlertTitle>
            </Alert>
          )}
          {success && (
            <Alert severity="success" icon={false} sx={{ mt: 2 }}>
              <AlertTitle sx={{ fontSize: 12 }}>{success}</AlertTitle>
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
          Registrarme
        </Button>
      </form>
    </Stack>
  );
};

export default RegisterForm;
