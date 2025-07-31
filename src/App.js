import { BrowserRouter  } from 'react-router-dom';
import appTheme from './theme.js'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ApiProvider } from './context/ApiProvider'
import { AuthProvider } from './context/AuthProvider'
import { BookProvider } from './context/BookProvider'
import { SupabaseProvider } from './context/SupabaseProvider.jsx';
import { ProfileProvider } from './context/ProfileProvider.jsx';
import { Container, padding } from '@mui/system';
import AppRouter from './components/AppRouter.jsx'


function App() {


  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Container sx={{pb: {xs: '20vh', md: 0}}} > 
       <SupabaseProvider>
        <AuthProvider>
          <ProfileProvider>
            <ApiProvider>  
            <BookProvider>  
              <BrowserRouter> 
                <AppRouter />
                </BrowserRouter>
            </BookProvider>
            </ApiProvider>
          </ProfileProvider>
          </AuthProvider>
        </SupabaseProvider>
      </Container>
    </ThemeProvider>
  );
}

export default App;