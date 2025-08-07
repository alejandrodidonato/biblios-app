import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'
import Loading from './Loading';
import { Stack, Typography, Box } from '@mui/material'
import styled from '@emotion/styled'
import RegisterForm from './RegisterForm'
import appTheme from '../theme';

const Logo = styled("img")({ 
    margin: '140px auto 30px auto',
    display: 'flex',
    maxWidth: '300px',
    backgroundColor: appTheme.palette.primary.background,
 })

 const Trama = styled("img")({ 
    maxHeight: '80px',
 })

const Register = () => {

    const { session, loading } = useAuth();

  if (loading) return <Loading />;
  if (session) return <Navigate to="/profile" />;



  return (
        <>
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
                    <Logo src="../img/logo-register-login.png" alt="Logo de Biblios" />
                    <Typography lineHeight={1.3} color="primary.dark" align='center' variant="h1">¡Bienvenido!</Typography>
                    <Typography lineHeight={1.3} color="primary.dark" align='center' variant="h2">Registrate para poder comenzar</Typography>
                    <RegisterForm />
                </Stack>
            </Box>
        </>
  )
}

export default Register