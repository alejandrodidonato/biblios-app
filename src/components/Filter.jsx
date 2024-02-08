import { React, useEffect } from 'react'
import { Container } from '@mui/system'
import { Card, Grid, CardActions, Button } from '@mui/material';
import appTheme from '../theme';
import useBook from '../hooks/useBook';

const Filter = () => {

  const { categories } = useBook()

  return (
        <>
           <Container fluid="true">
        <Grid ml="auto" mr="auto" mb="6rem" container spacing={0}>
          {categories.map((category,index) => (
            <Grid key={index} item xs={6} sm={4} md={3} lg={2} container alignItems="center" justifyContent="center" mb={2}>
              <Card sx={{ minWidth: 120, minHeight: 120, mr: '10px', backgroundColor: appTheme.palette.primary.main, height: '100%', width: '100%' }}>
                <CardActions sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Button size="small" sx={{ color: appTheme.palette.primary.contrastText, textTransform: 'none', fontSize: '18px', lineHeight: '24px' }}>
                    {category.category_name}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
        </>
  )
}

export default Filter