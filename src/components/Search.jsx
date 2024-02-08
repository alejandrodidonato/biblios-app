import React from 'react'
import useApi from '../hooks/useApi'
import Loading from './Loading'
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';

const Search = () => {

    const { bookData, loading } = useApi()

    const cardBook = {
      height: '240px',
      border: '3px solid #779A4A',
      borderRadius: '0',
    
    }


  return (
        <>
            {
             loading ? <Loading /> :
             <Container fluid="true">
             <Grid ml="auto" mr="auto" mb="6rem" container spacing={1} >
               {Array.from(bookData).map((item, index) => (
                 <Grid item key={index} xs={6} sm={4} md={3} lg={2}>
                     <Link to={`../book/${item.id}`}>
                       <Card sx={cardBook}>
                         <CardMedia
                           component="img"
                           alt={item.volumeInfo.title}
                           height="240"
                           image={item.volumeInfo.imageLinks.thumbnail}
                         />
                       </Card>
                     </Link>
                 </Grid>
               ))}
             </Grid>
           </Container>
            }
        </>
  )
}

export default Search