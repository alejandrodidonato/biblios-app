import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid'
import appTheme from '../theme';

export default function Loading() {
  return (
    <Grid container justifyContent="center" alignItems="center" spacing={0} p={2} >
      <CircularProgress size="5rem" sx={{ 
        color: appTheme.palette.primary.main,
        marginTop: '25vh'
      }} />
    </Grid>
  );
}
