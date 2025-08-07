// BookDetails.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { Stack, Box } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import supabaseClient from '../supabase.js'
import Loading from './Loading'

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
        published_year, // entero, p. ej. 2020
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
      alert('Tenés que estar logueado para guardar búsquedas')
      return
    }

    try {
      // 1. Asegurar existencia del libro y obtener su id
      const bookId = await ensureBookRecord(book)

      // 2. Verificar si ya hay una búsqueda activa
      const { data: existing, error: existingErr } = await supabaseClient
        .from('searches')
        .select('id')
        .eq('user_id', user_id)
        .eq('book_id', bookId)
        .eq('active', true)
        .limit(1)

      if (existingErr) throw existingErr
      if (existing?.length) {
        alert('Ya tenés esa búsqueda activa')
        return
      }

      // 3. Insertar búsqueda
      const { error: insertSearchErr } = await supabaseClient.from('searches').insert([
        {
          user_id,
          book_id: bookId,
        },
      ])

      if (insertSearchErr) throw insertSearchErr

      alert('Búsqueda agregada correctamente')
    } catch (err) {
      console.error('Error agregando búsqueda:', err)
      alert(err.message || 'Error al agregar la búsqueda')
    }
  }

  return (
    <>
      <Container className="fluid my-4 mx-1 book-info">
        <Box className="justify-content-center">
          <Grid className="mx-1">
            <img src={coverUrl} alt="" />
            <h1 className="book-title">{book.volumeInfo.title}</h1>
            <h2 className="book-author">{book.volumeInfo.authors?.join(', ')}</h2>
            <h3 className="book-year">
              {book.volumeInfo.publishedDate
                ? book.volumeInfo.publishedDate.substring(0, 4)
                : ''}
            </h3>
            <h4 className="book-publisher">{book.volumeInfo.publisher}</h4>
          </Grid>
          <Grid className="mx-1"></Grid>
        </Box>
        <Box className="justify-content-center mt-4">
          <Grid className="mx-1">
            <p className="book-description">{book.volumeInfo.description} </p>
          </Grid>
        </Box>



        <Box justifyContent="center" className="mx-2 mt-4">
          <Stack
            sx={{ gap: 2 }}
            justifyContent={{ xs: 'center', md: 'start' }}
            direction={{ xs: 'column', md: 'row' }}
          >
            <Button
              variant="contained"
              endIcon={<AddCircleIcon />}
              onClick={() =>
                navigate('/add-book', {
                  state: {
                    book,
                    coverUrl,
                    mode: 'listing',
                  },
                })
              }
            >
              Agregar a mi biblioteca
            </Button>
            <Button
              variant="contained"
              endIcon={<AddCircleIcon />}
              onClick={handleAddToSearches}
            >
              Agregar a mis búsquedas
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  )
}

export default BookDetails
