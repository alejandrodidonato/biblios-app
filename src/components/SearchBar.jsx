import React from 'react'
import useApi from '../hooks/useApi';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Alert, FormControl, Select, InputLabel, MenuItem, Paper, IconButton, InputBase, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import appTheme from '../theme';
import Loading from './Loading';

const SearchBar = () => {
    const { loading, getBookList, clearBookList, search, setSearch, error, searchType,  setSearchType } = useApi()
    const { query } = search
    const navigate = useNavigate();

    const textFieldStyles = {
        backgroundColor: 'rgba(119,154,74,0.25)',
        padding: '0',
        color: appTheme.palette.primary.dark
    }

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
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
                    >

                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder={`Ingresa un ${searchType}`}
                        inputProps={{ 'aria-label': 'Ingresa un libro' }}
                        name="query"
                        onChange={handleSearch}
                        onKeyDown={handleSendQuery}
                        value={query}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={doSearch}>
                        <SearchIcon />
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