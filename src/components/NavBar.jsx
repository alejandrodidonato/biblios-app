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

  const PaperStyles = {
    position: { xs: 'fixed', md: 'fixed' },
    left: { xs: 0, md: 0 },
    right: { xs: 0, md: 'auto' },
    bottom: { xs: 0, md: 'auto' },
    top: { xs: 'auto', md: 0 },
    width: { xs: '100vw', md: '100vw' },
    height: { xs: '10vh', md: '10vh' },
    zIndex: 999,
    display: 'flex',
    flexDirection: { xs: 'row' },
    alignItems: 'center',
    justifyContent: { xs: 'center' },
    backgroundColor: '#b5c69a',
  }

  const navigationStyles = {
    width: '100%',
    height: '100%',
    flexDirection: { xs: 'row', md: 'row' },
    backgroundColor: 'transparent',
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
    
          <Paper sx={PaperStyles} elevation={3}>
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