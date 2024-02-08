import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import appTheme from './theme.js'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ApiProvider } from './context/ApiProvider'
import { AuthProvider } from './context/AuthProvider'
import { BookProvider } from './context/BookProvider'
import Filter from './components/Filter';
import Search from './components/Search';
import Book from './components/Book';
import SearchBar from './components/SearchBar';
import NavBar from './components/NavBar';
import Home from './components/Home';
/*import Matches from './components/Matches';
import Profile from './components/Profile';
import Filter from './components/Filter';
import UserBooks from './components/UserBooks';*/
import Login from './components/Login';
import Register from './components/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Container } from '@mui/system';



function App() {

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Container> 
      <AuthProvider>
        <ApiProvider>  
        <BookProvider>  
            <BrowserRouter>
              <Routes>
                <Route path='/register' element={ <Register/> } />
                <Route path='/login' element={ <Login/> } />
                
  
                <Route path='/' element={<ProtectedRoute>  <NavBar/> </ProtectedRoute>}>
                  
                    <Route index element={ <Home/> } />
                  
                    <Route path='search' element={ <SearchBar /> }>
                      <Route path='list' element={ <Search /> } />
                      <Route path='filter' element={ <Filter /> } />
                      <Route path='book/:id' element={ <Book/> } />
                    </Route>
                    {/*
                    <Route path='matches' element={ <Matches/> } />
                    <Route path='profile' element={ <Profile /> }>
                      <Route path='user-books' element={ <UserBooks /> } />
                    </Route>
                    <Route path='filter' element={ <Filter/> } />
                  <Route path='*' element={ <Navigate to="/"/> } />
                  */}
                </Route>
                
              </Routes>
              
            </BrowserRouter>
        </BookProvider>
        </ApiProvider>
        </AuthProvider>
      </Container>
    </ThemeProvider>
  );
}

export default App;