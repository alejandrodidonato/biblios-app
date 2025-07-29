import React from 'react'
import useApi from '../hooks/useApi';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Alert } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
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
                <Grid item xs={10}>
                    <TextField
                        fullWidth
                        label={`Buscar por ${searchType}`}
                        type="text"
                        name="query"
                        onChange={handleSearch}
                        onKeyDown={handleSendQuery}
                        value={query}
                        variant="filled"
                        size="small"
                        sx={textFieldStyles}
                        InputProps={{
                            disableUnderline: true,
                            sx: { borderBottom: 'none' }
                        }}
                        InputLabelProps={{
                            sx: { color: appTheme.palette.primary.dark, fontWeight: '500', fontSize: '14px' }
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        style={{ borderRadius: '0', maxHeight: '100px' }}
                        onClick={handleSendQuery}
                        disabled={loading}
                    >
                        <SendRoundedIcon sx={{ minHeight: '35px', width: '100%' }} />
                    </Button>
                </Grid>
                <Grid item xs={12} mt={2}>
                     <select
                      value={searchType}
                      onChange={e => setSearchType(e.target.value)}
                      className="border px-2 py-1"
                    >
                      <option value="title">Título</option>
                      <option value="author">Autor</option>
                      <option value="isbn">ISBN</option>
                       <option value="publisher">Editorial</option>
                    </select>
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