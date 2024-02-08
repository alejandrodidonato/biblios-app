import { React } from 'react'
import { Stack, Typography } from '@mui/material'
import styled from '@emotion/styled'
import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Loading from './Loading'
import LoginForm from './LoginForm'


const Logo = styled("img")({ 
    margin: '30px 0px'
 })


const Login = () => {

    const { session, loading } = useAuth()

  return (
        <>
        {   
            session != null ? <Navigate to="/" /> :
             loading ? <Loading /> : 

            <Stack direction="column">
                <img src="../img/trama.svg" alt="Trama de Biblios" />
                <Logo src="../img/logo-register-login.png" alt="Logo de Biblios" />
                <Typography lineHeight={1.3} color="primary.dark" align='center' variant="h1">¡Hola de nuevo!</Typography>
                <Typography lineHeight={1.3} color="primary.dark" align='center' variant="h2">Ingresá con tu usuario y contraseña</Typography>
                <LoginForm />
            </Stack>
        
                        
        }
        </>
  )
}

export default Login