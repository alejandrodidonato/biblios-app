
import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import {
  Stack,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import supabaseClient from '../supabase.js'
import Loading from './Loading'
import appTheme from '../theme.js'



const extractYear = raw => {
  if (!raw) return null
  const m = raw.toString().match(/(\d{4})/)
  return m ? m[1] : null
}

const BookDetails = () => {
  const location = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()

  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [bookData, setBookData] = useState([]) // si lo tenés en un hook compartido podés reemplazar
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({
    open: false,
    title: '',
    message: '',
    severity: 'info',
  })

  // helper para abrir/cerrar modal
  const showModal = ({ title, message, severity = 'info' }) =>
    setModal({ open: true, title, message, severity })

  const closeModal = () => setModal(m => ({ ...m, open: false }))


  // Opción 1: Si viene por state (navegación normal)
  const book = location.state?.book || bookData.find(b => b.id === id)
  const coverUrl = location.state?.coverUrl || (book?.volumeInfo?.imageLinks?.thumbnail ?? '')

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingSession(false)
    })
  }, [])

  if (loading || loadingSession) return <Loading />
  if (!book) return <div>No se encontró el libro.</div>

  const user_id = session?.user?.id
  if (!user_id) return <div>No estás autenticado.</div>

  // busca o inserta el libro en 'books', devuelve su id
  const ensureBookRecord = async volume => {
    // extraer info mínima
    const info = volume.volumeInfo || {}
    const industryIdentifiers = info.industryIdentifiers || []
    const isbnObj =
      industryIdentifiers.find(id => id.type === 'ISBN_13') || industryIdentifiers[0] || {}
    const isbn = (isbnObj.identifier || '').trim()
    const googlebooks_id = volume.id || null
    const title = (info.title || '').trim()
    const authors = Array.isArray(info.authors) ? info.authors.join(', ').trim() : (info.authors || '').trim()
    const year = extractYear(info.publishedDate || '')
    const published_year = year ? parseInt(year, 10) : null
    const thumbnail_url = (info.imageLinks?.thumbnail || '').replace(/&edge=curl/gi, '').trim()

    // 1. buscar por googlebooks_id
    let bookId = null
    if (googlebooks_id) {
      const { data: byGB, error: gbErr } = await supabaseClient
        .from('books')
        .select('id')
        .eq('googlebooks_id', googlebooks_id)
        .limit(1)
      if (gbErr) throw gbErr
      if (byGB?.length) {
        bookId = byGB[0].id
      }
    }

    // 2. si no se encontró, buscar por ISBN (si hay)
    if (!bookId && isbn) {
      const { data: byIsbn, error: isbnErr } = await supabaseClient
        .from('books')
        .select('id')
        .eq('isbn', isbn)
        .limit(1)
      if (isbnErr) throw isbnErr
      if (byIsbn?.length) {
        bookId = byIsbn[0].id
      }
    }

    // 3. si sigue sin existir, insertarlo
    if (!bookId) {
      const bookPayload = {
        googlebooks_id,
        title,
        authors,
        isbn: isbn || '',
        published_year,
        thumbnail_url,
      }
      const { data: inserted, error: insertErr } = await supabaseClient
        .from('books')
        .insert([bookPayload])
        .select('id')
        .limit(1)
      if (insertErr) throw insertErr
      if (!inserted || inserted.length === 0) throw new Error('No se pudo crear el libro')
      bookId = inserted[0].id
    }

    return bookId
  }


const handleAddToSearches = async () => {
  if (!user_id) {
    showModal({
      title: 'Iniciá sesión',
      message: 'Tenés que estar logueado para guardar búsquedas.',
      severity: 'warning',
    })
    return
  }

  try {
    const bookId = await ensureBookRecord(book)

    const { data: existing, error: existingErr } = await supabaseClient
      .from('searches')
      .select('id')
      .eq('user_id', user_id)
      .eq('book_id', bookId)
      .eq('active', true)
      .limit(1)

    if (existingErr) throw existingErr
    if (existing?.length) {
      showModal({
        title: 'Ya está en tus búsquedas',
        message: 'Ya tenés esa búsqueda activa.',
        severity: 'info',
      })
      return
    }

    const { error: insertSearchErr } = await supabaseClient.from('searches').insert([
      { user_id, book_id: bookId },
    ])
    if (insertSearchErr) throw insertSearchErr

    showModal({
      title: '¡Listo!',
      message: 'Búsqueda agregada correctamente.',
      severity: 'success',
    })
  } catch (err) {
    console.error('Error agregando búsqueda:', err)
    showModal({
      title: 'Ocurrió un error',
      message: err?.message || 'Error al agregar la búsqueda.',
      severity: 'error',
    })
  }
}


 return (
  <Container maxWidth="md" sx={{ py: 4, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
    <Grid container spacing={4} alignItems="flex-start">
      {/* Portada a la izquierda */}
      <Grid item xs={6} sm={4}>
        <Box
          component="img"
          src={coverUrl}
          alt={book.volumeInfo.title}
          sx={{
            height: 'auto',
            borderRadius: 2,
            boxShadow: 3,
          }}
        />
      </Grid>

      {/* Info a la derecha */}
      <Grid item xs={6} sm={8}>
        <Stack spacing={1}>
          <Typography variant="h2" fontWeight={700}>
            {book.volumeInfo.title}
          </Typography>

          {book.volumeInfo.authors && (
            <Typography variant="subtitle1" color="text.secondary">
              {book.volumeInfo.authors.join(', ')}
            </Typography>
          )}

          {book.volumeInfo.publishedDate && (
            <Typography variant="body2" color="text.secondary">
              Año: {book.volumeInfo.publishedDate.substring(0, 4)}
            </Typography>
          )}

          {book.volumeInfo.publisher && (
            <Typography variant="body2" color="text.secondary">
              Editorial: {book.volumeInfo.publisher}
            </Typography>
          )}
          
        </Stack>
      </Grid>
      <Grid item spacing={4} alignItems="flex-start">
          <Stack direction="row" spacing={2} mt={2} justifyContent="center">
            <Button
              variant="contained"
              endIcon={<AddCircleIcon />}
              onClick={() =>
                navigate('/add-book', {
                  state: { book, coverUrl, mode: 'listing' },
                })
              }
            >
              Mi biblioteca
            </Button>

            <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleAddToSearches}>
              Mis búsquedas
            </Button>
          </Stack>
      </Grid>
      

      {/* Descripción abajo */}
      {book.volumeInfo.description && (
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Descripción
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
            {book.volumeInfo.description}
          </Typography>
        </Grid>
      )}
    </Grid>
    <Dialog open={modal.open} onClose={closeModal} fullWidth maxWidth="xs" >
  {modal.title && <DialogTitle textAlign="center" sx={{ color: appTheme.palette.primary.dark }}>{modal.title}</DialogTitle>}
  <DialogContent>
    <Alert severity={modal.severity} variant="outlined" sx={{ borderColor: appTheme.palette.primary.main, '& .MuiAlert-icon': { color: appTheme.palette.primary.main }, '& .MuiAlert-message': {
      color: appTheme.palette.primary.main, // verde oscuro custom
    }, }}>
      {modal.message}
    </Alert>
  </DialogContent>
  <DialogActions>
    <Button onClick={closeModal} autoFocus>OK</Button>
  </DialogActions>
</Dialog>
  </Container>
)


}

export default BookDetails
