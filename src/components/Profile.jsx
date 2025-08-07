import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useProfile from '../hooks/useProfile';
import { Outlet, useNavigate } from 'react-router-dom';
import { Container, Grid, Avatar, Typography, Button, Stack, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import appTheme from '../theme';
import { TabsProfile } from './TabsProfile';
import BookGrid from './BookGrid';
import useBook from '../hooks/useBook';
import LibrisIcon from './LibrisIcon';
import Loading from './Loading';
import { fontSize } from '@mui/system';

const Profile = () => {
  const { logOut, loading } = useAuth();
  const navigate = useNavigate();

  // Usa el contexto de perfil
  const { profile, refresh } = useProfile();
  const [selectedTab, setSelectedTab] = useState(0); // 0: Mis libros, 1: Buscados
  const { userBooks, userSearchedBooks } = useBook();
  const fallbackCover = '/img/default-book.png';
  

  const handleLogout = async () => {
    await logOut();
  };

  // Si quieres refrescar el perfil al montar el componente:
  useEffect(() => {
    refresh();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Container sx={{ textAlign: 'center', backgroundColor: '#b5c69a', borderTopLeftRadius: 3, borderTopRightRadius: 3, py: 2, mt: 2 }}>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={5} md={4}>
            <Avatar
              src={profile?.avatar_url || "/img/profile-example.png"}
              alt="Foto de perfil"
              sx={{ width: 100, height: 100, margin: '0 auto', backgroundColor: '#ffffff', border: `5px solid #ffffff` }}
            />
          </Grid>
          <Grid item xs={7} md={8} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'space-around' }}>
            <Button
              variant="outlined"
              sx={{ backgroundColor: appTheme.palette.primary.white, color: appTheme.palette.primary.main, mb: { xs: 1, md: 0}, mr: { xs: 0, md: 1}, textTransform: 'none', fontWeight: 600 , fontSize: '1rem', minWidth: '120px'}}
              onClick={() => navigate('/editar-perfil')}
            >
              Editar perfil
            </Button>
            <Button
              variant="outlined"
              sx={{ backgroundColor: appTheme.palette.primary.white, textTransform: 'none', fontWeight: 600, color: appTheme.palette.primary.main, fontSize: '1rem', minWidth: '120px' }}
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </Grid>
        </Grid>
        <Grid>
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
             <Typography variant="h2" color="white" sx={{ fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis' }}>
           {profile?.email}
          </Typography>
            <Box
  onClick={() => navigate('/comprar-libris')}
  sx={{
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  }}
>
  <LibrisIcon size={40} fontSize={42} />
  <Typography
    sx={{
      marginLeft: 1,
      fontSize: '20px',
      fontWeight: 700,
      color: appTheme.palette.primary.white,
    }}
  >
    {profile?.token_balance}
  </Typography>
</Box>
          </Grid>
        </Grid>
      </Container>
      <Outlet />
      <TabsProfile value={selectedTab} onChange={(_, v) => setSelectedTab(v)} />

      {selectedTab === 0 && (
        <Container maxWidth="md" sx={{ my: 4, px: 6, py: 2, backgroundColor: appTheme.palette.backgroundcolor, borderRadius: 1, border: `1px solid ${appTheme.palette.primary.dark}` }}>
          
          <Typography variant="h2" color={appTheme.palette.primary.dark} sx={{ mb: 2, fontWeight: 700, textAlign: 'center', textDecoration: 'underline', textUnderlineOffset: '10px' }}>
            Mi biblioteca
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ my: 4 }}>
            <Button variant="contained" endIcon={<AddCircleIcon />} onClick={() => navigate('/search')}>
              Agregar nuevo libro
            </Button>
          </Stack>
          <BookGrid
            books={userBooks}
            getCover={item => item.thumbnail_url || fallbackCover}
            getAlt={item => item.title || 'Libro'}
            getLink={item => item.googlebooks_id ? `/book-profile/${item.googlebooks_id}` : null}
            noResultsMessage="No tenés libros publicados."
          />
          
        </Container>
      )}

      {selectedTab === 1 && (
        <Container maxWidth="md" sx={{ my: 4, px: 6, py: 2, backgroundColor: appTheme.palette.backgroundcolor, borderRadius: 1, border: `1px solid ${appTheme.palette.primary.dark}` }}>
          
          <Typography variant="h2" color={appTheme.palette.primary.dark} sx={{ mb: 2, fontWeight: 700, textAlign: 'center', textDecoration: 'underline', textUnderlineOffset: '10px' }}>
            Mis búsquedas
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ my: 4 }}>
            <Button variant="contained" endIcon={<AddCircleIcon />} onClick={() => navigate('/search')}>
              Agregar nueva búsqueda
            </Button>
          </Stack>
          <BookGrid
            books={userSearchedBooks}
            getCover={item => item.thumbnail_url || fallbackCover}
            getAlt={item => item.title || 'Libro buscado'}
            getLink={item => item.googlebooks_id ? `/book-profile/${item.googlebooks_id}` : null}
            noResultsMessage="No tenés búsquedas guardadas."
          />
          
        </Container>
        
      )}

      
    </>
  );
};

export default Profile;