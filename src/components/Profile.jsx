import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useProfile from '../hooks/useProfile';
import { Outlet, useNavigate } from 'react-router-dom';
import { Container, Box, Grid, Avatar, Typography, Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import Loading from './Loading';
import appTheme from '../theme';
import { TabsProfile } from './TabsProfile';
import BookGrid from './BookGrid';
import useBook from '../hooks/useBook';
import useApi from '../hooks/useApi';

const Profile = () => {
  const { userAuth, logOut } = useAuth();
  const navigate = useNavigate();

  // Usa el contexto de perfil
  const { profile, loading, error, refresh, updateProfile } = useProfile();
  const [selectedTab, setSelectedTab] = useState(0); // 0: Mis libros, 1: Buscados
  const { userBooks, userSearchedBooks } = useBook();
  const { bookData } = useApi();
  const fallbackCover = '/img/default-book.png';


  const handleLogout = async () => {
    await logOut();
  };

  // Si quieres refrescar el perfil al montar el componente:
  useEffect(() => {
    refresh();
  }, []);



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
      <TabsProfile value={selectedTab} onChange={(_, v) => setSelectedTab(v)} />

      {selectedTab === 0 && (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Mis libros
          </Typography>
          <BookGrid
            books={userBooks}
            getCover={item => item.thumbnail_url || fallbackCover}
            getAlt={item => item.title || 'Libro'}
            // si tenés una ruta de detalle para los libros propios:
            getLink={item => item.isbn ? `../book/${item.isbn}` : null}
            noResultsMessage="No tenés libros publicados."
          />
        </Container>
      )}

      {selectedTab === 1 && (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
            Libros Buscados
          </Typography>
          <BookGrid
            books={userSearchedBooks}
            getCover={item => item.thumbnail_url || fallbackCover}
            getAlt={item => item.title || 'Libro buscado'}
            // si los libros buscados tienen alguna acción, podés usar getLink
            noResultsMessage="No tenés búsquedas guardadas."
          />
        </Container>
      )}
    </>
  );
};

export default Profile;