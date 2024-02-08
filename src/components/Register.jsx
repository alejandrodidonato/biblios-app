import {React, useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'
import Loading from './Loading';
import { Stack, Typography } from '@mui/material'
import styled from '@emotion/styled'
import RegisterForm from './RegisterForm'

const Logo = styled("img")({ 
    margin: '30px 0px'
 })

const Register = () => {

    const { userAuth, dataUser, signUp, userLogin, loading } = useAuth()

    const navigate = useNavigate()

    const [error, setError ] = useState()

    

    const handleSubmit = async(e) => {

        e.preventDefault()

        setError('')

        try {
            
            await signUp(userLogin.email, userLogin.password)
            navigate('/')

        } catch(error) {

            if ( error.code === "auth/internal-error")
            {
                setError('Se requiere una contraseña.');
            } else if ( error.code === "auth/email-already-in-use")
            {
                setError('El mail ingresado ya está siendo utilizado.');
            } else if ( error.code === "auth/weak-password")
            {
                setError('La contraseña debe tener al menos 6 caractéres.');
            } else if ( error.code === "auth/invalid-email")
            {
                setError('Se debe ingresar un mail válido.');
            } else
            {
                setError('Se produjo un error. Volvé a intentar más tarde.');
            }
                
        }
        
    }



  return (
        <>
            <Stack direction="column">
                <img src="../img/trama.svg" alt="Trama de Biblios" />
                <Logo src="../img/logo-register-login.png" alt="Logo de Biblios" />
                <Typography lineHeight={1.3} color="primary.dark" align='center' variant="h1">¡Bienvenido!</Typography>
                <Typography lineHeight={1.3} color="primary.dark" align='center' variant="h2">Registrate para poder comenzar</Typography>
                <RegisterForm />
            </Stack>
        </>
  )
}

export default Register