import { createTheme } from "@mui/material/styles";


const appTheme = createTheme({
    typography: {
        fontFamily: 'Poppins',
        h1: {
          fontFamily: 'Avenir',
          fontSize: '32px',
          fontWeight: 800,
        },
        h2: {
          fontFamily: 'Avenir',
          fontSize: '16px',
          fontWeight: 800,
        },
        subtitle2: {
          fontFamily: 'Poppins',
          fontSize: '13px',
          fontWeight: 400,
        }
        
        
      },
      palette: {
        primary: {
            main: '#779A4A',
            dark: '#425D07',
            light: '#8D6542',
            background: '#779a4a80',
            contrastText: '#FFFFFF'
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: `

          @font-face {
            font-family: 'Avenir';
            src: url(fonts/AvenirNextCyr-Heavy.woff) format('woff'); 
            weight: 800;
            font-style: normal;
          }
          
          @font-face {
            font-family: 'Avenir';
            src: url(fonts/AvenirNextCyr-Bold.woff) format('woff'); 
            weight: 700;
            font-style: normal;
          }
          
          @font-face {
            font-family: 'Avenir';
            src: url(fonts/AvenirNextCyr-Medium.woff) format('woff'); 
            weight: 500;
            font-style: normal;
          }
          
          @font-face {
            font-family: 'Avenir';
            src: url(fonts/AvenirNextCyr-Regular.woff) format('woff'); 
            weight: 400;
            font-style: normal;
          }
          
          @font-face {
            font-family: 'Avenir';
            src: url(fonts/AvenirNextCyr-Light.woff) format('woff'); 
            weight: 300;
            font-style: normal;
          }
          
          `,
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              borderBottom: '1px solid #779A4A',
              color: '#425D07'
            }
          }
        },
      }
});

export default appTheme;