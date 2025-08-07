// components/BookGrid.jsx
import React from 'react';
import { Grid, Card, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

const defaultCover = '/img/default-book.png';

export default function BookGrid({
  books = [],
  getLink,        // (book) => string | null
  getState,       // (book) => any (optional)
  getCover,       // (book) => string | null
  getAlt,         // (book) => string
  sxCard = {},    // overrides para el Card
  noResultsMessage = null,
}) {
  if (!books || books.length === 0) {
    return noResultsMessage ? (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>{noResultsMessage}</div>
    ) : null;
  }

  return (
    <Grid ml="auto" mr="auto" mb="3rem" container spacing={1}>
      {books.map((book, index) => {
        const coverUrl = getCover?.(book) || defaultCover;
        const alt = getAlt ? getAlt(book) : 'Libro';
        const linkTo = getLink ? getLink(book) : null;
        const state = getState ? getState(book) : undefined;

        const cardContent = (
          <Card
            sx={{
              maxHeight: 'auto',
              border: '1px solid #779A4A',
              borderRadius: '5px',
              overflow: 'hidden',
              ...sxCard,
            }}
          >
            <CardMedia
              component="img"
              alt={alt}
              height="auto"
              image={coverUrl}
              onError={e => {
                // @ts-ignore
                e.target.onerror = null;
                // @ts-ignore
                e.target.src = defaultCover;
              }}
              sx={{ objectFit: 'contain' }}
            />
          </Card>
        );

        return (
          <Grid item key={index} xs={6} sm={4} md={2} lg={2} xl={2}>
            {linkTo ? (
              <Link to={linkTo} state={state} style={{ textDecoration: 'none' }}>
                {cardContent}
              </Link>
            ) : (
              cardContent
            )}
          </Grid>
        );
      })}
    </Grid>
  );
}
