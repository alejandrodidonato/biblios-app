import { useEffect, useState } from 'react'
import { Container, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import supabase from '../supabase'
import Loading from './Loading'
import BookGrid from './BookGrid'

const Home = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const fallbackCover = '/img/default-book.png'

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('listings')
        .select('id, book:books(*), user_id')
        .eq('status', 'disponible')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error al traer listings:', error)
      } else {
        setListings(data)
      }

      setLoading(false)
    }

    fetchListings()
  }, [])

  if (loading) return <Loading />

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
        Últimos libros agregados
      </Typography>

      <BookGrid
        books={listings.map(l => l.book)}
        getCover={item => item.thumbnail_url || fallbackCover}
        getAlt={item => item.title || 'Libro'}
        getLink={item => item.googlebooks_id ? `/book-profile/${item.googlebooks_id}` : null}
        noResultsMessage="No hay libros disponibles en este momento."
      />
    </Container>
  )
}

export default Home
