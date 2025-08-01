import { createTheme } from "@mui/material/styles";


const appTheme = createTheme({
  typography: {
    fontFamily: 'Poppins',
    h1: {
      fontFamily: 'Avenir Black',
      fontSize: '32px',
      fontWeight: 800,
    },
    h2: {
      fontFamily: 'Avenir Medium',
      fontSize: '16px',
      fontWeight: 500,
    },
    h3: {
      fontFamily: 'Avenir Regular',
      fontSize: '14px',
      fontWeight: 700,
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
          font-family: 'Avenir Black';
          src: url('/fonts/AvenirBold.woff') format('woff'),
               url('/fonts/AvenirBold.woff2') format('woff2');
          font-weight: 800;
          font-style: normal;
        }
        @font-face {
          font-family: 'Avenir Heavy';
          src: url('/fonts/AvenirHeavy.woff') format('woff'),
               url('/fonts/AvenirHeavy.woff2') format('woff2');
          font-weight: 700;
          font-style: normal;
        }
        @font-face {
          font-family: 'Avenir Medium';
          src: url('/fonts/AvenirMedium.woff') format('woff'),
               url('/fonts/AvenirMedium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
        }
        @font-face {
          font-family: 'Avenir';
          src: url('/fonts/AvenirRegular.woff') format('woff'),
               url('/fonts/AvenirRegular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'Avenir Book';
          src: url('/fonts/AvenirBook.woff') format('woff'),
               url('/fonts/AvenirBook.woff2') format('woff2');
          font-weight: 300;
          font-style: normal;
        }
      `,
    },
  },
});

export default appTheme;