import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Paper from '@mui/material/Paper';
import appTheme from '../theme';


const NavBar = () => {

  const location = useLocation();

  const [value, setValue] = React.useState(0);

  const navigationStyles = {
    height: '10vh',
    backgroundColor: appTheme.palette.primary.background
  }

  const iconStyles = {
    color: appTheme.palette.primary.contrastText,
    fontSize: '40px',
  };

  const selectedIconStyles = {
    color: appTheme.palette.primary.main,
    backgroundColor: appTheme.palette.primary.contrastText,
    borderRadius: '25px',
    fontSize: '50px',
    p: '5px'

  };

  return (
    <>
    
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999 }} elevation={3}>
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            sx={navigationStyles}
    
          >
            <BottomNavigationAction
              component={Link}
              to="/"
              icon={<HomeRoundedIcon sx={location.pathname === '/' ? selectedIconStyles : iconStyles}/>}
              
            
            />
            <BottomNavigationAction
              component={Link}
              to="/search"
              icon={<SearchRoundedIcon sx={location.pathname.startsWith('/search') ? selectedIconStyles : iconStyles}/>}
            />
            <BottomNavigationAction
              component={Link}
              to="/matches"
              icon={<SwapHorizRoundedIcon sx={location.pathname.startsWith('/matches') ? selectedIconStyles : iconStyles}/>}
            />
            <BottomNavigationAction
              component={Link}
              to="/profile"
              icon={<PersonRoundedIcon sx={location.pathname.startsWith('/profile') ? selectedIconStyles : iconStyles}/>}
            />
          </BottomNavigation>
          </Paper>
    
        <Outlet></Outlet>
    </>
  )
}

export default NavBar