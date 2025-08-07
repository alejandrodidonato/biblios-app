import { createTheme } from "@mui/material/styles";


const appTheme = createTheme({
  typography: {
    fontFamily: 'Poppins',
    h1: {
      fontFamily: 'Avenir Bold',
      fontSize: '32px',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Avenir Medium',
      fontSize: '18px',
      fontWeight: 500,
    },
    h3: {
      fontFamily: 'Avenir Medium',
      fontSize: '14px',
      fontWeight: 500,
    },
    h4: {
      fontFamily: 'Avenir Medium',
      fontSize: '12px',
      fontWeight: 500,
    },
    h5: {
      fontFamily: 'Avenir Medium',
      fontSize: '20px',
      fontWeight: 500,
    },
    body1: {
      fontSize: '14px',
      fontWeight: 400,
    },
    body2: {
      fontSize: '12px',
      fontWeight: 400,
    },
  },
  palette: {
    primary: {
      main: '#779A4A',
      dark: '#425D07',
      light: '#8D6542',
      white: '#ffffff',
    },
    background: {
      default: '#f4f2e9',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `

        @font-face {
          font-family: 'Avenir Bold';
          src: url('/fonts/AvenirNextBold.woff') format('woff'),
               url('/fonts/AvenirNextBold.woff2') format('woff2');
          font-weight: 700;
          font-style: normal;
        }
        @font-face {
          font-family: 'Avenir Medium';
          src: url('/fonts/AvenirNextMedium.woff') format('woff'),
               url('/fonts/AvenirNextMedium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
        }
          
      `,
    },
  },
});

export default appTheme;