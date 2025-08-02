import { useParams, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import useApi from '../hooks/useApi';
import Loading from './Loading';

const Book = () => {

  const location = useLocation();
  const { isbn } = useParams();
  const { loading, bookData } = useApi()

  // Opción 1: Si viene por state (navegación normal)
  const book = location.state?.book
    // Opción 2: Si el usuario recarga, busca por ISBN en el contexto
    || bookData.find(b => b.isbn === isbn);

  const coverUrl = location.state?.coverUrl

  if (!book) return <div>No se encontró el libro.</div>;


  return (
        <>
        {
          loading ? <Loading /> :

          <Container className="fluid my-4 mx-1 book-info">
            <Box className="justify-content-center">
              <Grid className='mx-1'>
                <img src={coverUrl} alt="" />
                <h1 className='book-title'>{book.volumeInfo.title}</h1>
                <h2 className='book-author'>{book.volumeInfo.authors?.join(', ')}</h2>
                <h3 className='book-year'>{book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate.substring(0, 4) : ''}</h3>
                <h4 className='book-publisher'>{book.volumeInfo.publisher}</h4>
              </Grid>
              <Grid className='mx-1'>
          
              </Grid>
            </Box>
            <Box className="justify-content-center mt-4">
              <Grid className='mx-1'>
                <p className='book-description'>{book.volumeInfo.description} </p>
              </Grid>
            </Box>
          
            <Box className="justify-content-center mx-2 separator">
              <Grid className='p-0'>
                <h5>Usuarios con este libro</h5>
                <ul className='book-users-list'>
                  <li>Juan Perez - <i>Liniers (a 2km)</i>  </li>
                  <li>Laura Gomez - <i>CABA (a 4km)</i></li>
                  <li>Roberto Fernandez - <i>Morón (a 6km)</i></li>
                </ul>
              </Grid>
            </Box>
        
        
            <Box className="justify-content-center mx-2">
              <Grid>
                <Button className='btn-book'>
                Agregar a Mi Biblioteca
                </Button>
                
              </Grid>
              <Grid>
              <Button className='btn-book' >Agregar a Mis Buscados</Button>
              </Grid>
              
            </Box>
          </Container>
}
        </>
        
  )
}

export default Book