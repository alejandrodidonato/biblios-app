import React from 'react'
import useApi from '../hooks/useApi'
import Loading from './Loading'
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import appTheme from '../theme';
import BookList from './BookList';

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
              
             <Container>
              <BookList />
             
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