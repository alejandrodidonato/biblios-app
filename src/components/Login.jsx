import { React } from 'react'
import { Stack, Typography, Box } from '@mui/material'
import styled from '@emotion/styled'
import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Loading from './Loading'
import LoginForm from './LoginForm'
import { bgcolor } from '@mui/system'


const Logo = styled("img")({ 
    margin: '140px auto 30px auto',
    display: 'flex',
    maxWidth: '300px',
 })


const Login = () => {

    const { session, loading } = useAuth()

  return (
        <>
        {   
            session != null ? <Navigate to="/" /> :
             loading ? <Loading /> : 
             <Box
             display="flex"
             flexDirection="column"
             justifyContent="space-between"
             minHeight="100vh"
             padding={2}
            >
                <Stack spacing={2} alignItems="center"
                sx={{
                    width: '100%',
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                  }}>
                    <Logo src="../img/logo-register-login.png" alt="Logo de Biblios" sx={{ bgColor: '#f4f2e9' }}/>
                    <Typography lineHeight={1.7} color="primary.dark" align='center' variant="h1">¡Hola de nuevo!</Typography>
                    <Typography lineHeight={1.3} color="primary.dark" align='center' variant="h2" mt={1}>Ingresá con tu usuario y contraseña</Typography>
                    <Box mt="auto"  sx={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                        <LoginForm />
                    </Box>
                </Stack>
            </Box>
                        
        }
        </>
  )
}

export default Login