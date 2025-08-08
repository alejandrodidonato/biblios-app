import React from 'react'
import useApi from '../hooks/useApi';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Fab, Grid, Alert, FormControl, Select, InputLabel, MenuItem, Paper, IconButton, InputBase, Divider } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import appTheme from '../theme';
import Loading from './Loading';

const SearchBar = () => {
    const { getBookList, clearBookList, search, setSearch, error, searchType,  setSearchType } = useApi()
    const { query } = search
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const newQuery = e.target.value;
        setSearch({
            ...search,
            [e.target.name]: newQuery,
        });
        if (newQuery === '') {
            clearBookList();
        }
    };

    const doSearch = () => {
    if (query.trim() !== '') {
        getBookList(query);
        navigate('list', { replace: true });
    }
};

    const handleSendQuery = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (query.trim() !== '') {
                getBookList(query);
                navigate('list', { replace: true });
            }
        }
    };

    return (
        <>
            <Grid container spacing={0} mt={2} mb={2}>
                <Grid item xs={12} mt={2}>
                    <FormControl sx={{ mb: 1, minWidth: 120 }} size="small">
                        <InputLabel id="select-small-label">Buscar por</InputLabel>
                        <Select
                            labelId="select-small-label"
                            id="select-small"
                            value={searchType}
                            label="Buscar por"
                            onChange={e => setSearchType(e.target.value)}
                        >
                            <MenuItem value="titulo">Titulo</MenuItem>
                            <MenuItem value="autor">Autor</MenuItem>
                            <MenuItem value="ISBN">ISBN</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Paper
                    component="form"
                    sx={{ p: '0px', display: 'flex', alignItems: 'center', width: '100%' }}
                    >

                    <InputBase
                        sx={{ ml: 1, flex: 1, fontSize: 16, fontFamily: 'Poppins' }}
                        placeholder={`Ingresa un ${searchType}`}
                        inputProps={{ 'aria-label': 'Ingresa un libro' }}
                        name="query"
                        onChange={handleSearch}
                        onKeyDown={handleSendQuery}
                        value={query}
                    />
                    <IconButton type="button" sx={{ backgroundColor: appTheme.palette.primary.main, borderRadius: 0 }} aria-label="search" onClick={doSearch}>
                        <SearchIcon sx={{ color: appTheme.palette.primary.white }} />
                    </IconButton>
                    </Paper>
                    
                </Grid>
            </Grid>
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            )}
            <Outlet />

        </>
    )
}

export default SearchBar