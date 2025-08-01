import React from 'react';
import { Grid, Card, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';

const cardBook = {
  maxHeight: 'auto',
  border: '1px solid #779A4A',
  borderRadius: '5px',
};

export default function BookList() {
  const { bookData } = useApi();

  return (
    <Grid ml="auto" mr="auto" mb="6rem" container spacing={1}>
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
          ? `https://covers.openlibrary.org/b/isbn/${isbn}.jpg`
          : null;
        // 3. Imagen por defecto
        const defaultCover = '/img/default-book.png';

        // Selección de imagen: thumbnail > openLibrary > default
        const coverUrl = thumbnail || openLibraryCover || defaultCover;

        return (
          <Grid item key={index} xs={6} sm={4} md={2} lg={2} xl={2}>
            <Link 
              to={`../book/${item.id}`} 
              state={{ book: item, coverUrl }}
              style={{ textDecoration: 'none' }}
            >
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
        );
      })}
    </Grid>
  );
}