import {React, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import UserBooks from './UserBooks';




const Profile = () => {

  const { userAuth, logOut } = useAuth()

  const handleLogout = async () => {
    await logOut()
  }

  const {email } = userAuth

  const username = email.substring(0, email.lastIndexOf("@"));


  const navigate = useNavigate();


  return (
        <>
           
             <Container className='text-center card-profile'>
              <Row className="justify-content-left my-3 mx-auto">
                <Col xs="4" className="align-items-left">
                  <img src="../img/profile-example.png" className="rounded-circle img-profile" alt="Foto de perfil" />
                </Col>
                <Col xs="8" className='mt-2'>
                  <h1 className="text-white username-profile">{ username }</h1>
                  <button onClick={handleLogout} className="btn-profile btn-edit">
                    Editar perfil
                  </button>
                  <button onClick={handleLogout} className="btn-profile btn-logout">
                    Cerrar sesión
                  </button>
                  
                  
                </Col>
              </Row>
              
            </Container>
            <Outlet></Outlet>
            <UserBooks />
        </>
  )
}

export default Profile