// src/components/ComprarLibris.jsx
import { Box, Button, Container, Typography, Grid, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LibrisIcon from './LibrisIcon'

const packs = [
  { id: 'pack1', cantidad: 250, precio: 5000 },
  { id: 'pack2', cantidad: 500, precio: 10000 },
  { id: 'pack3', cantidad: 1000, precio: 20000 },
]

const ComprarLibris = () => {
  const navigate = useNavigate()

  const handleCompra = async (pack) => {
    try {
      const response = await fetch('../api/crear-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cantidad: pack.cantidad,
          precio: pack.precio,
        }),
      })

      const data = await response.json()

      if (data?.init_point) {
        window.location.href = data.init_point
      } else {
        alert('No se pudo iniciar el pago.')
      }
    } catch (error) {
      console.error('Error al crear preferencia:', error)
      alert('Hubo un problema al conectar con Mercado Pago.')
    }
  }

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h2" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
        Comprar Libris
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {packs.map((pack) => (
          <Grid item key={pack.id}>
            <Card sx={{ minWidth: 200, p: 2, textAlign: 'center' }}>
                <Box display="flex" justifyContent="center" >
                    <LibrisIcon size={40} fontSize="40px" />
                </Box>
              <CardContent >
                <Typography variant="h5" gutterBottom>
                {pack.cantidad} Libris
                </Typography>
                <Typography variant="body1">${pack.precio}</Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => handleCompra(pack)}
                >
                  Comprar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" mt={4}>
        <Button variant="outlined" onClick={() => navigate('/profile')}>
          Volver al perfil
        </Button>
      </Box>
    </Container>
  )
}

export default ComprarLibris
