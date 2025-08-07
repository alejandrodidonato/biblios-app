import { React, useState } from 'react'
import Button from '@mui/material/Button';
import { FormControl, Stack, Box, InputLabel, Input, IconButton, InputAdornment, Typography, Link, AlertTitle, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import supabaseClient from '../supabase.js'



const LoginForm = () => {
    
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const dataUser = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    const [showPassword, setShowPassword] = useState(false);
  
    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const { setSession } = useAuth()
    const [ errorMessage, setErrorMessage ] = useState('')
    

    const navigate = useNavigate()


    const handleSubmit = async(e) => {

        e.preventDefault()
        setErrorMessage('')
        
        try {
          
            const { data,error } = await supabaseClient.auth.signInWithPassword(user)
            
            if(error)
            {
                console.log(error.message)
                switch(error.message)
                {
                  case 'Invalid login credentials':
                    setErrorMessage("Email o contraseña incorrectos.")
                  break;
                  case 'Email not confirmed':
                    setErrorMessage("Por favor, revisá tu casilla de email para poder verificar tu usuario.")
                    const { data, error } = await supabaseClient.auth.resend({
                        type: 'signup',
                        email: user.email
                      })
                  break;
      
                  default:
                    setErrorMessage("Error")
                  break;
                }
            }
            else
            {
                setSession(data.session)
                navigate('/')
            }
  
            
          } catch(error)
          {
            setErrorMessage("Error inesperado. Volvé a intentarlo en unos minutos.")
          }
    }

  return (
        <>
        {   
            <Stack
                direction="column" alignItems="center"
            >
                 <form onSubmit={handleSubmit}>
                    <Box  sx={{ margin: '2rem auto', padding: '1rem', width: '100%',  maxWidth: '400px' }}>
                    <FormControl variant="standard" sx={{ width: '100%', paddingBottom: '2rem' }}>
                        <InputLabel sx={{ fontSize: '14px', color: 'primary.main' }} htmlFor="email">Email</InputLabel>
                        <Input id="email" type="text" onChange={dataUser} name="email" />
                    </FormControl>
                    
                    <FormControl sx={{ width: '100%' }} variant="standard">
                        <InputLabel sx={{ fontSize: '14px', color: 'primary.main' }} htmlFor="password">Contraseña</InputLabel>
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
                    
                    {errorMessage && (
                        <Alert severity="error" icon={false} sx={{ marginTop: '20px' }}>
                        <AlertTitle sx={{ fontSize: '12px' }}>{errorMessage}</AlertTitle>
                        </Alert>
                    )}
                    </Box>

                    <Box>
                    <Typography align="center" variant="subtitle2" color="primary.dark" mt={4}>
                        ¿No tenés una cuenta? <Link component={RouterLink} color="primary.dark" fontWeight={700} to="/register">Registrate</Link>
                    </Typography>
                    </Box>
                    
                    <Button
                    variant="contained"
                    sx={{
                        textTransform: 'capitalize',
                        fontSize: '18px',
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                        width: '100%',
                        marginTop: '3rem',
                        marginBottom: '1rem',
                    }}
                    type="submit"
                    >
                    Ingresar
                    </Button>
                </form>
                
            </Stack>            
}           
        </>
  )
}

export default LoginForm