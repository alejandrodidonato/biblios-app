import { React } from 'react'
import { Stack, Typography, Box } from '@mui/material'
import styled from '@emotion/styled'
import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Loading from './Loading'
import LoginForm from './LoginForm'
import appTheme from '../theme'


const Logo = styled("img")({ 
    margin: '140px auto 30px auto',
    display: 'flex',
    maxWidth: '300px',
    backgroundColor: appTheme.palette.primary.background,
 })

 const Trama = styled("img")({ 
    maxHeight: '80px',
 })


const Login = () => {

    const { session, loading } = useAuth()

    if (loading) return <Loading />;
    if (session) return <Navigate to="/profile" />;

  return (
        <>
    
             <Box
             display="flex"
             flexDirection="column"
             justifyContent="space-between"
             minHeight="100vh"
             padding={1}
            >
                <Stack spacing={2} alignItems="center" backgroundColor={appTheme.palette.background.default}
                sx={{
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '15px',
                    margin: '0 auto',
                    padding: '1rem',
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                  }}>
                    
                    <Logo src="../img/logo-register-login.png" alt="Logo de Biblios" />
                    <Typography lineHeight={1.2} color="primary.dark" align='center' variant="h1" pt={3} >¡Hola de nuevo!</Typography>
                    <Typography lineHeight={1.3} color="primary.dark" align='center' variant="h2" mt={0}>Ingresá con tu usuario y contraseña</Typography>
                    <LoginForm />
                    
                </Stack>
                
            </Box>
                        
        </>
  )
}

export default Login