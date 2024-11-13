import { React, useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import useApi from '../hooks/useApi';
import Loading from './Loading';

const Book = () => {

  const { loading } = useApi()

  const { id } = useParams()


  return (
        <>
        {
          loading ? <Loading /> :

          <Container className="fluid my-4 mx-1 book-info">
            <Box className="justify-content-center">
              <Grid className='mx-1'>
                <h1 className='book-title'></h1>
                <h2 className='book-author'></h2>
                <h3 className='book-year'></h3>
                <h4 className='book-publisher'></h4>
              </Grid>
              <Grid className='mx-1'>
          
              </Grid>
            </Box>
            <Box className="justify-content-center mt-4">
              <Grid className='mx-1'>
                <p className='book-description'> </p>
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