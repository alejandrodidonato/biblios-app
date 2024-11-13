import { createTheme } from "@mui/material/styles";


const appTheme = createTheme({
    typography: {
        fontFamily: 'Poppins',
        h1: {
          fontFamily: 'Avenir',
          fontSize: '32px',
          fontWeight: 700,
        },
        h2: {
          fontFamily: 'Avenir',
          fontSize: '16px',
          fontWeight: 500,
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
          styleOverrides: {
              body: {
                  backgroundColor: '#f4f2e9', // Color de fondo del body
              },
              '@font-face': [
                  {
                      fontFamily: 'Avenir',
                      src: "url('fonts/AvenirNextCyr-Heavy.woff') format('woff')",
                      fontWeight: 800,
                      fontStyle: 'normal',
                  },
                  {
                      fontFamily: 'Avenir',
                      src: "url('fonts/AvenirNextCyr-Bold.woff') format('woff')",
                      fontWeight: 700,
                      fontStyle: 'normal',
                  },
                  {
                      fontFamily: 'Avenir',
                      src: "url('fonts/AvenirNextCyr-Medium.woff') format('woff')",
                      fontWeight: 500,
                      fontStyle: 'normal',
                  },
                  {
                      fontFamily: 'Avenir',
                      src: "url('fonts/AvenirNextCyr-Regular.woff') format('woff')",
                      fontWeight: 400,
                      fontStyle: 'normal',
                  },
                  {
                      fontFamily: 'Avenir',
                      src: "url('fonts/AvenirNextCyr-Light.woff') format('woff')",
                      fontWeight: 300,
                      fontStyle: 'normal',
                  }
              ]
          },
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