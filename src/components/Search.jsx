import useApi from '../hooks/useApi'
import Loading from './Loading'
import { Container, Fab, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import appTheme from '../theme';
import BookList from './BookList';

const Search = () => {

    const { loading } = useApi()
    

  return (
        <>
            {
             loading ? <Loading /> :
              
             <Container>
              <BookList />
             
           </Container>
            }
        </>
  )
}

export default Search