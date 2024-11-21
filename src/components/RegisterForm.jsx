import { React, useState } from 'react'
import Button from '@mui/material/Button';
import { FormControl, Stack, Box, InputLabel, Input, IconButton, InputAdornment, Typography, Link, AlertTitle, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import appTheme from '../theme';
import supabaseClient from '../supabase.js'



const RegisterForm = () => {


    //Hooks
    
    const [user, setUser] = useState({
      email: '',
      password: ''
  });
    const [showPassword, setShowPassword] = useState(false)
    const [repeatPassword, setRepeatPassword] = useState('')
    const [ errorMessage, setErrorMessage ] = useState('')
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate()

    // Función para guardar usuario

    const dataUser = e => {
      setUser({
          ...user,
          [e.target.name]: e.target.value
      })
  }

    // Función para mostrar/ocultar contraseña
  
    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    
    // Función para el manejo del envío del formulario

    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage('');
      setSuccessMessage('');
    
      if (user.password === '' || user.email === '' || !repeatPassword) {
        setErrorMessage('Por favor, completa todos los campos.');
        return;
      }
    
      if (user.password !== repeatPassword) {
        setErrorMessage('Las contraseñas no coinciden.');
        return;
      }
    
      try {
        // Registro de usuario con Supabase Auth
        const { data, error } = await supabaseClient.auth.signUp({
          email: user.email,
          password: user.password,
        });
    
        if (error) {
          // Manejo de errores de Supabase
          switch (error.message) {
            case 'User already registered':
            case 'Email already exists':
              setErrorMessage('El correo electrónico ya está registrado.');
              break;
            case 'Password should be at least 6 characters':
              setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
              break;
            case 'Unable to validate email address: invalid format':
              setErrorMessage('El formato del correo no es válido.');
              break;
            default:
              setErrorMessage('Error al registrarte. Por favor, intenta de nuevo.');
          }
        } else {
          // Registro exitoso
          setSuccessMessage('¡Registro exitoso! Ahora podés iniciar sesión.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        setErrorMessage('Error en el registro. Por favor, intenta más tarde.');
      }
    };

  return (
        <>
        {   
            <Stack direction="column" sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                <form onSubmit={handleSubmit}>
                    <Box sx={{
                            margin: '2rem auto',
                            padding: '1rem',
                        }}>

                        <FormControl variant="standard" sx={{
                            width: '100%',
                            paddingBottom: '2rem',
                        }}  >
                        <InputLabel sx={{
                            fontSize: '14px',
                            color: appTheme.palette.primary.main,
                        
                        }} htmlFor="email">Email</InputLabel>
                        <Input
                            id="email"
                            type="text"
                            onChange={dataUser}
                            name="email"
                        />
                        </FormControl>
                        <FormControl sx={{ width: '100%', paddingBottom: '2rem' }} variant="standard" >
                        <InputLabel sx={{
                            fontSize: '14px',
                            color: appTheme.palette.primary.main,
                        
                        }} htmlFor="password">Contraseña</InputLabel>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
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
                            onChange={dataUser}
                        />
                        </FormControl>
                        <FormControl sx={{ width: '100%' }} variant="standard" >
                        <InputLabel sx={{
                            fontSize: '14px',
                            color: appTheme.palette.primary.main,
                        }} htmlFor="password-confirm">Confirmar contraseña</InputLabel>
                        <Input
                            id="password-confirm"
                            name="password-confirm"
                            type={showPassword ? 'text' : 'password'}
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
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                        </FormControl>
                        
                        {errorMessage && (
                        <Alert severity="error" icon={false} sx={{
                            marginTop: '20px'
                        }}  >
                            <AlertTitle sx={{
                            fontSize: '12px'
                        }}>{errorMessage}</AlertTitle>
                        </Alert>
                        )}
                        {successMessage && (
                          <Alert severity="success" icon={false} sx={{ marginTop: '20px' }} >
                            <AlertTitle sx={{ fontSize: '12px' }}>{successMessage}</AlertTitle>
                          </Alert>
                        )}
                    </Box>
                    <Box>
                        <Typography align="center" variant='subtitle2' color="primary.dark">¿Ya tenés una cuenta? <Link component={RouterLink} color="primary.dark" fontWeight={700} to="/login" >Ingresá</Link></Typography>
                        
                        
                    </Box>
                    
                    <Button variant="contained" sx={{
                        textTransform: 'capitalize',
                        fontSize: '18px',
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                        width: '100%',
                        marginTop: '3rem',
                        marginBottom: '1rem'
                    }} type="submit">Registrarme</Button>
                </form>
                
            </Stack>            
}           
        </>
  )
}

export default RegisterForm