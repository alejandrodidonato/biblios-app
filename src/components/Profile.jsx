import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useProfile from '../hooks/useProfile';
import { Outlet, useNavigate } from 'react-router-dom';
import UserBooks from './UserBooks';
import { Container, Box, Grid, Avatar, Typography, Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import Loading from './Loading';
import appTheme from '../theme';
import { TabsProfile } from './TabsProfile';

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
      <Container sx={{ textAlign: 'center', backgroundColor: '#b5c69a', borderTopLeftRadius: 3, borderTopRightRadius: 3, py: 2, mt: 4 }}>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={5} md={4}>
            <Avatar
              src={profile?.avatar_url || "/img/profile-example.png"}
              alt="Foto de perfil"
              sx={{ width: 100, height: 100, margin: '0 auto', backgroundColor: '#ffffff', border: `5px solid #ffffff` }}
            />
          </Grid>
          <Grid item xs={7} md={8} sx={{ textAlign: 'left'}}>
            <Typography variant="h3" color="white" sx={{ fontWeight: 800, mb: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
           {profile?.email}
          </Typography>
            <Button
              variant="outlined"
              sx={{ backgroundColor: appTheme.palette.primary.white, color: appTheme.palette.primary.main, mb: { xs: 1, md: 0}, mr: { xs: 0, md: 1}, textTransform: 'none', fontWeight: 600 , fontSize: '0.7rem'}}
              onClick={() => navigate('/editar-perfil')}
            >
              Editar perfil
            </Button>
            <Button
              variant="outlined"
              sx={{ backgroundColor: appTheme.palette.primary.white, textTransform: 'none', fontWeight: 600, color: appTheme.palette.primary.main, fontSize: '0.7rem' }}
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Outlet />
      <TabsProfile />
      
      { /*
      /<UserBooks />
      */ }
    </>
  );
};

export default Profile;