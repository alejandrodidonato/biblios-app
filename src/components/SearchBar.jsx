import { React, useEffect, useRef } from 'react'
import useApi from '../hooks/useApi';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, TextField, Grid } from '@mui/material';
import { TuneRounded } from '@mui/icons-material';
import appTheme from '../theme';


const SearchBar = () => {

    const { loading, getBookList, clearBookList, search, setSearch } = useApi()

    const { query } = search

    const navigate = useNavigate();

    const textFieldStyles = {
        backgroundColor: 'rgba(119,154,74,0.25)',
        padding: '0',
        color: appTheme.palette.primary.dark
    }

    const searchRef = useRef('');

    const handleSearch = (e) => {
      const newQuery = e.target.value;
      setSearch({
        ...search,
        [e.target.name]: newQuery,
      });
    };

    const handleFilterClick = () => {
      navigate('filter', { replace: true });
    };
  
    useEffect(() => {
      const delayedSearch = setTimeout(() => {
        if (query !== searchRef.current && query !== '') {
          getBookList(query, loading);
          navigate('list', { replace: true });
          searchRef.current = query;
        }
        else if( query === '')
        {
            clearBookList();
        }
      }, 300);
  
      return () => clearTimeout(delayedSearch);
    }, [query, loading, navigate, getBookList, clearBookList]);

    
  return (
      <>
       
            <Grid container spacing={0} mt={2} mb={2}>
            <Grid item xs={10}>
                <TextField
                fullWidth
                label='Buscar por título, autor, ISBN...'
                type="text"
                name="query"
                onChange={handleSearch}
                value={query}
                variant="filled"
                size="small"
                sx={textFieldStyles}
                InputProps={{
                    disableUnderline: true,
                    sx: {
                        borderBottom: 'none',
                        
                }
                  }}
                InputLabelProps={{
                    sx: { color: appTheme.palette.primary.dark, fontWeight: '500', fontSize: '14px' }
                }}
                />
            </Grid>
            <Grid item xs={2}>
                <Button type="button" variant="contained" color="primary" style={{borderRadius: '0', maxHeight: '100px'}}  onClick={handleFilterClick}>
                <TuneRounded sx={{ minHeight: '35px', width: '100%' }}/>
                </Button>
            </Grid>
            
            </Grid>

        <Outlet></Outlet>
      </>
        
  )
}

export default SearchBar