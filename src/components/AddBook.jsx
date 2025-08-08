
import React, { useEffect, useMemo } from 'react'
import {
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  Avatar,
  Box,
  Divider,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const CONDITION_OPTIONS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'bueno', label: 'Bueno' },
  { value: 'aceptable', label: 'Aceptable' },
  { value: 'malo', label: 'Malo' },
]



// esquema sin description, condition sin default
const schema = yup.object({
  title: yup.string().trim().required('Título requerido'),
  authors: yup.string().trim().required('Autor requerido'),
  condition: yup
    .string()
    .oneOf(CONDITION_OPTIONS.map(o => o.value), '¿Cúal es el estado del libro?')
    .required('Condición requerida'),
  isbn: yup
  .string()
  .required('Ingresá el ISBN del libro (lo podés encontrar en la contratapa)'),
  publisher: yup.string().nullable(),
  publishedDate: yup
    .string()
    .nullable()
    .matches(/^\d{4}$/, 'Ingresa un año válido (YYYY)'),
  coverUrl: yup.string().url('URL inválida').nullable(),
})


const extractYear = raw => {
  if (!raw) return ''
  const m = raw.match(/\d{4}/)
  return m ? m[0] : ''
}

const normalizeGoogleBook = volume => {
  const info = volume.volumeInfo || {}
  const industryIdentifiers = info.industryIdentifiers || []
  const isbnObj =
    industryIdentifiers.find(id => id.type === 'ISBN_13') || industryIdentifiers[0] || {}
  const isbn = isbnObj.identifier || ''
  const rawCover = info.imageLinks?.thumbnail || ''
  const coverUrl = rawCover.replace(/&edge=curl/gi, '')

  const authors = Array.isArray(info.authors) ? info.authors.join(', ') : info.authors || ''

  return {
    title: info.title || '',
    authors,
    publisher: info.publisher || '',
    publishedDate: extractYear(info.publishedDate || ''),
    isbn,
    coverUrl,
  }
}


const AddBook = ({
  book,
  initialValues = {},
  onSubmit,
  submitLabel = 'Guardar',
  loading = false,
  mode = 'listing',
}) => {
  const prefill = useMemo(() => {
    if (book) {
      if (book.volumeInfo) return normalizeGoogleBook(book)
      return {
        title: book.title || '',
        authors: book.authors || '',
        publisher: book.publisher || '',
        publishedDate: book.publishedDate ? extractYear(book.publishedDate) : '',
        isbn: book.isbn || '',
        coverUrl: book.coverUrl || '',
      }
    }
    return {}
  }, [book])

  const defaultValues = {
    title: '',
    authors: '',
    condition: '',
    isbn: '',
    publisher: '',
    publishedDate: '',
    coverUrl: '',
    ...prefill,
    ...initialValues,
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onBlur',
  })

  const navigate = useNavigate()

  useEffect(() => {
    reset({
      ...defaultValues,
    })
  }, [book, JSON.stringify(defaultValues), reset])

  const internalSubmit = async data => {
    const payload = {
      title: data.title.trim(),
      authors: data.authors.trim(),
      isbn: data.isbn?.trim() || null,
      publisher: data.publisher?.trim() || null,
      publishedDate: data.publishedDate?.trim() || null, // solo año (YYYY)
      coverUrl: data.coverUrl?.trim() || null,
      condition: data.condition,
    }
    await onSubmit(payload)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(internalSubmit)} noValidate>
      <Stack spacing={2}>
        <Typography variant="h6">
          {mode === 'listing' ? 'Publicar libro propio' : 'Agregar búsqueda de libro'}
        </Typography>

        <Controller
          name="coverUrl"
          control={control}
          render={({ field }) => (
            <>
              {field.value ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    variant="rounded"
                    src={field.value}
                    alt="Portada"
                    sx={{ width: 80, height: 110 }}
                  />
                  <TextField
                    label="URL de portada"
                    fullWidth
                    {...field}
                    onChange={e => field.onChange(e.target.value)}
                    error={!!errors.coverUrl}
                    helperText={errors.coverUrl?.message}
                  />
                </Box>
              ) : (
                <TextField
                  label="URL de portada (opcional)"
                  fullWidth
                  {...field}
                  error={!!errors.coverUrl}
                  helperText={errors.coverUrl?.message}
                />
              )}
            </>
          )}
        />

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              label="Título"
              fullWidth
              required
              {...field}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />

        <Controller
          name="authors"
          control={control}
          render={({ field }) => (
            <TextField
              label="Autor(es)"
              fullWidth
              required
              {...field}
              error={!!errors.authors}
              helperText={errors.authors?.message}
            />
          )}
        />

        {mode === 'listing' && (
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Condición del libro"
                fullWidth
                required
                displayEmpty
                {...field}
                error={!!errors.condition}
                helperText={errors.condition?.message}
              >
                <MenuItem value="" disabled>
                  Seleccioná condición
                </MenuItem>
                {CONDITION_OPTIONS.map(o => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Controller
            name="publisher"
            control={control}
            render={({ field }) => (
              <TextField
                label="Editorial"
                fullWidth
                {...field}
                error={!!errors.publisher}
                helperText={errors.publisher?.message}
              />
            )}
          />
          <Controller
            name="publishedDate"
            control={control}
            render={({ field }) => (
              <TextField
                label="Año de publicación"
                fullWidth
                placeholder="2023"
                inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '\\d*' }}
                {...field}
                error={!!errors.publishedDate}
                helperText={errors.publishedDate?.message}
              />
            )}
          />
        </Stack>

        <Controller
          name="isbn"
          control={control}
          required
          render={({ field }) => (
            <TextField
              label="ISBN"
              fullWidth
              {...field}
              error={!!errors.isbn}
              helperText={errors.isbn?.message}
            />
          )}
        />

        <Divider />

        <Box display="flex" justifyContent="space-between" gap={1}>
          <Button type="button" variant="contained" onClick={() => navigate("/search")}>
            Buscar
          </Button>
          <Button type="submit" variant="contained" disabled={loading || isSubmitting}>
            {submitLabel}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

export default AddBook
