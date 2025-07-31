import React from 'react'
import useBook from '../hooks/useBook';
import { Grid, Container, Typography, Card, CardMedia } from '@mui/material';

const UserBooks = () => {
  const { userBooks, userSearched } = useBook();

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Mi Biblioteca
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {Array.from(userBooks).map((item, index) => (
            <Grid item xs={4} sm={3} md={2} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.title || 'Libro'}
                  sx={{ height: 140, objectFit: 'contain' }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Mis Buscados
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {Array.from(userSearched).map((item, index) => (
            <Grid item xs={4} sm={3} md={2} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.title || 'Libro'}
                  sx={{ height: 140, objectFit: 'contain' }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default UserBooks;