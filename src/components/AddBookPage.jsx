
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AddBook from './AddBook'
import supabaseClient from '../supabase.js'
import Loading from './Loading'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Button,
} from '@mui/material'
import appTheme from '../theme.js'


const extractYear = val => {
  if (!val) return null
  const match = val.toString().match(/^(\d{4})/)
  if (match) return match[1]
  return null
}

const AddBookPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [modal, setModal] = useState({
  open: false,
  title: '',
  message: '',
  severity: 'info',
})

const showModal = ({ title, message, severity = 'info' }) =>
  setModal({ open: true, title, message, severity })

const closeModal = () => setModal(m => ({ ...m, open: false }))


  const book = state?.book
  const coverUrl = state?.coverUrl || (book?.volumeInfo?.imageLinks?.thumbnail ?? '')
  const mode = state?.mode === 'search' ? 'search' : 'listing'

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingSession(false)
    })
  }, [])

  if (loadingSession) return <Loading />
  const user_id = session?.user?.id
  if (!user_id) return <div>No estás autenticado.</div>

  const handleSubmit = async data => {
    try {
      let bookId = null

      // 1. Buscar por googlebooks_id si viene
      if (book?.id) {
        const { data: existingByGB, error: gbErr } = await supabaseClient
          .from('books')
          .select('id')
          .eq('googlebooks_id', book.id)
          .limit(1)
        if (gbErr) throw gbErr
        if (existingByGB?.length) {
          bookId = existingByGB[0].id
        }
      }

      // 2. Buscar por ISBN si no se encontró antes
      if (!bookId && data.isbn) {
        const { data: existingByIsbn, error: isbnErr } = await supabaseClient
          .from('books')
          .select('id')
          .eq('isbn', data.isbn.trim())
          .limit(1)
        if (isbnErr) throw isbnErr
        if (existingByIsbn?.length) {
          bookId = existingByIsbn[0].id
        }
      }

      // 3. Insertar si no existe
      if (!bookId) {
        // convertimos el año en una fecha YYYY-01-01 para published_date
        const year = extractYear(data.publishedDate)
        const published_year = year ? parseInt(year, 10) : null

        const bookPayload = {
          googlebooks_id: book?.id || null,
          title: data.title.trim(),
          authors: data.authors?.trim() || '',
          isbn: data.isbn?.trim() || null,
          published_year,
          thumbnail_url: data.coverUrl?.trim() || null,
        }

        const { data: inserted, error: insertBookError } = await supabaseClient
          .from('books')
          .insert([bookPayload])
          .select('id')
          .limit(1)

        if (insertBookError) throw insertBookError
        if (!inserted || inserted.length === 0) throw new Error('No se creó el libro')
        bookId = inserted[0].id
      }

      // 4. Crear listing con condition y status
      const listingPayload = {
        user_id,
        book_id: bookId,
        condition: data.condition,
        status: 'disponible',
        price_libris: 0,
      }

      const { error: listingError } = await supabaseClient
        .from('listings')
        .insert([listingPayload])

      if (listingError) throw listingError

      
      showModal({
        title: '¡Listo!',
        message: 'Libro publicado correctamente.',
        severity: 'success',
      })
    } catch (err) {
      console.error('Insert listing error:', err)
      showModal({
      title: 'Ocurrió un error',
      message: err?.message || 'Error al guardar.',
      severity: 'error',
    })
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <AddBook
        book={book}
        initialValues={{ coverUrl }}
        mode={mode}
        onSubmit={handleSubmit}
        submitLabel={mode === 'listing' ? 'Publicar libro' : 'Guardar búsqueda'}
      />
      <Dialog open={modal.open} onClose={closeModal} fullWidth maxWidth="xs">
  {modal.title && <DialogTitle>{modal.title}</DialogTitle>}
  <DialogContent>
    <Alert
      severity={modal.severity}
      variant="outlined"
      sx={{
        '& .MuiAlert-icon': {
          color: appTheme.palette.primary.main,
        },
      }}
    >
      {modal.message}
    </Alert>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => {
        closeModal()
        if (modal.severity === 'success') navigate('/profile')
      }}
      autoFocus
    >
      OK
    </Button>
  </DialogActions>
</Dialog>
    </div>
  )
}

export default AddBookPage
