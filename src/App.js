import { BrowserRouter  } from 'react-router-dom';
import appTheme from './theme.js'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ApiProvider } from './context/ApiProvider'
import { AuthProvider } from './context/AuthProvider'
import { BookProvider } from './context/BookProvider'
import { Container } from '@mui/system';
import AppRouter from './components/AppRouter.jsx'


function App() {


  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Container> 
      <AuthProvider>
        <ApiProvider>  
        <BookProvider>  
          <BrowserRouter> 
            <AppRouter />
            </BrowserRouter>
        </BookProvider>
        </ApiProvider>
        </AuthProvider>
      </Container>
    </ThemeProvider>
  );
}

export default App;