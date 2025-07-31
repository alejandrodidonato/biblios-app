import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home'
import Filter from './Filter';
import Search from './Search';
import Book from './Book';
import SearchBar from './SearchBar';
import NavBar from './NavBar';
import Profile from './Profile';
/*import Matches from './components/Matches';

import Filter from './components/Filter';
import UserBooks from './components/UserBooks';*/
import { ProtectedRoute } from './ProtectedRoute';

const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.5 }}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.5 }}
            >
              <Register />
            </motion.div>
          }
          
        />
        <Route path='/' element={<ProtectedRoute>  <NavBar/> </ProtectedRoute>}>
                  
                  <Route index element={ <Home/> } />
                
                  <Route path='search' element={ <SearchBar /> }>
                    <Route path='list' element={ <Search /> } />
                    <Route path='filter' element={ <Filter /> } />
                    <Route path='book/:id' element={ <Book/> } />
                  </Route>
                  <Route path='profile' element={ <Profile /> }></Route>
                  {/*
                  <Route path='matches' element={ <Matches/> } />
                  
                    <Route path='user-books' element={ <UserBooks /> } />
                  </Route>
                  <Route path='filter' element={ <Filter/> } />
                <Route path='*' element={ <Navigate to="/"/> } />
                */}
              </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AppRouter;