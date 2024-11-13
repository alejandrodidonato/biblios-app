import { createTheme } from "@mui/material/styles";


const appTheme = createTheme({
    typography: {
        fontFamily: 'Poppins',
        h1: {
          fontFamily: 'Avenir Black',
          fontSize: '36px',
          fontWeight: 800,
        },
        h2: {
          fontFamily: 'Avenir',
          fontSize: '18px',
          fontWeight: 400,
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
            background: '#f4f2e9',
            contrastText: '#FFFFFF'
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
              body: {
                  backgroundColor: '#f4f2e9',
              },
              '@font-face': [
                  {
                      fontFamily: 'Avenir Black',
                      src: "url('fonts/AvenirBlack.ttf') format('ttf')",
                      fontWeight: 800,
                      fontStyle: 'normal',
                  },
                  {
                      fontFamily: 'Avenir Heavy',
                      src: "url('fonts/AvenirBold.ttf') format('ttf')",
                      fontWeight: 700,
                      fontStyle: 'normal',
                  },
                  {
                      fontFamily: 'Avenir Medium',
                      src: "url('fonts/AvenirMedium.ttf') format('ttf')",
                      fontWeight: 500,
                      fontStyle: 'normal',
                  },
                  {
                      fontFamily: 'Avenir',
                      src: "url('fonts/AvenirRegular.ttf') format('ttf')",
                      fontWeight: 400,
                      fontStyle: 'normal',
                  },
                  {
                      fontFamily: 'Avenir Light',
                      src: "url('fonts/AvenirLight.ttf') format('ttf')",
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