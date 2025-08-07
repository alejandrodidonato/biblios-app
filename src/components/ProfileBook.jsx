import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useBooks from '../hooks/useBook';
import { Container, Box, Grid, Button } from '@mui/material';
import Loading from './Loading';


const ProfileBook = () => {
    const { id } = useParams();
    const { getUserBookByID, loading } = useBooks();

   const book = getUserBookByID(id);

   if (loading) return <Loading />;
  if (!book) return <Container>Libro no encontrado en tus publicaciones ni búsquedas.</Container>;

  return (
    <>

        {
          loading ? <Loading /> :

          <Container className="fluid my-4 mx-1 book-info">
            <Box className="justify-content-center">
              <Grid className='mx-1'>
                <img src={book.thumbnail_url} alt="" />
                <h1 className='book-title'>{book.title}</h1>
              </Grid>
            </Box>
        
        
        
            <Box className="justify-content-center mx-2">
              {book.type === 'listing' && (
                <Button color="error" className='btn-book'>
                    Eliminar de mi biblioteca
                </Button>
                )}
                {book.type === 'searched' && (
                <Button color="error" className='btn-book'>
                    Eliminar de mis búsquedas
                </Button>
                )}
            </Box>
          </Container>
}
    </>
  );
};

export default ProfileBook;