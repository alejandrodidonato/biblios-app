import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useProfile from '../hooks/useProfile';
import { Outlet, useNavigate } from 'react-router-dom';
import UserBooks from './UserBooks';
import { Container, Box, Grid, Avatar, Typography, Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import Loading from './Loading';

const Profile = () => {
  const { userAuth, logOut } = useAuth();
  const navigate = useNavigate();

  // Usa el contexto de perfil
  const { profile, loading, error, refresh, updateProfile } = useProfile();

  const handleLogout = async () => {
    await logOut();
  };

  // Si quieres refrescar el perfil al montar el componente:
  useEffect(() => {
    refresh();
  }, [refresh]);



  return (
    <>
      <Container maxWidth="sm" sx={{ textAlign: 'center', backgroundColor: 'rgba(66,93,7,0.9)', borderRadius: 3, py: 4, mt: 4 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Avatar
              src={profile?.avatar_url || "/img/profile-example.png"}
              alt="Foto de perfil"
              sx={{ width: 120, height: 120, margin: '0 auto' }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h2" color="white" sx={{ fontWeight: 700, mb: 2 }}>
              {profile?.email}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}
              onClick={() => navigate('/editar-perfil')}
            >
              Editar perfil
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Outlet />
      { /*
      /<UserBooks />
      */ }
    </>
  );
};

export default Profile;