import React from 'react'
import useApi from '../hooks/useApi'
import Loading from './Loading'
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import appTheme from '../theme';


const Search = () => {

    const { bookData, loading, selectBook } = useApi()

    const cardBook = {
      maxHeight: 'auto',
      border: '1px solid #779A4A',
      borderRadius: '5px',
    
    }
    

  return (
        <>
            {
             loading ? <Loading /> :
             <Container fluid="true">
             <Grid ml="auto" mr="auto" mb="6rem" container spacing={1} >
               {Array.from(bookData).map((item, index) => {
                 // Buscar el ISBN (prioridad ISBN_13, luego ISBN_10)
                 const isbnObj = item.volumeInfo.industryIdentifiers?.find(
                   id => id.type === "ISBN_13"
                 ) || item.volumeInfo.industryIdentifiers?.find(
                   id => id.type === "ISBN_10"
                 );
                 const isbn = isbnObj ? isbnObj.identifier : null;

                 // 1. Thumbnail de volumeInfo
                 const thumbnail = item.volumeInfo.imageLinks?.thumbnail;
                 // 2. Portada de OpenLibrary si hay ISBN
                 const openLibraryCover = isbn
                   ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
                   : null;
                 // 3. Imagen por defecto
                 const defaultCover = '/img/default-book.png';

                 // Selección de imagen: thumbnail > openLibrary > default
                 const coverUrl = thumbnail || openLibraryCover || defaultCover;

                 return (
                   <Grid item key={index} xs={6} sm={4} md={3} lg={2} xl={1} >
                     <Link 
                      to={`../book/${item.id}`} 
                      state={{ book: item }}>
                       <Card sx={cardBook}>
                         <CardMedia
                           component="img"
                           alt={item.volumeInfo.title}
                           height="auto"
                           image={coverUrl}
                           onError={e => { e.target.onerror = null; e.target.src = defaultCover; }}
                         />
                       </Card>
                     </Link>
                   </Grid>
                 )
               })}
             </Grid>
             <Fab
              variant="extended"
              aria-label="add"
              sx={{
                position: 'fixed',
                bottom: 120,
                right: 24,
                zIndex: 1200,
                backgroundColor: appTheme.palette.primary.main,
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: appTheme.palette.primary.dark,
                },
              }}
            > 
              <AddIcon />
              Cargar Libro
            </Fab>
           </Container>
            }
        </>
  )
}

export default Search