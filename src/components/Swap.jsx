import React, { useEffect, useMemo, useState, useCallback } from 'react'
import {
  Box,
  Stack,
  Typography,
  Avatar,
  Button,
  Divider,
  TextField,
  Chip,
  Paper,
  Alert,
} from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/SwapHoriz'
import supabaseClient from '../supabase.js'

const Swap = ({
  matchId,
  targetListing,
  currentUserId,
  userListings = [],
  userLibrisBalance = 0,
  onComplete = () => {},
}) => {
  const [offeredBooks, setOfferedBooks] = useState([])
  const [offeredLibris, setOfferedLibris] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const [valuationTarget, setValuationTarget] = useState(0)
  const [valuationOfferedBooks, setValuationOfferedBooks] = useState(0)
  const [diff, setDiff] = useState(0)

  const estimateBookValue = useCallback(listing => {
    const base = 100
    const multiplier = {
      nuevo: 1.2,
      bueno: 1,
      aceptable: 0.8,
      malo: 0.5,
    }[listing.condition] || 1
    return Math.round(base * multiplier)
  }, [])

  useEffect(() => {
    if (targetListing) {
      setValuationTarget(estimateBookValue(targetListing))
    }
  }, [targetListing, estimateBookValue])

  useEffect(() => {
    const valOffered = offeredBooks.reduce((sum, b) => sum + estimateBookValue(b), 0)
    setValuationOfferedBooks(valOffered)
    setDiff(valOffered + offeredLibris - valuationTarget)
  }, [offeredBooks, offeredLibris, valuationTarget, estimateBookValue])

  const toggleOfferedBook = book => {
    setError(null)
    setOfferedBooks(prev => {
      if (prev.find(b => b.id === book.id)) {
        return prev.filter(b => b.id !== book.id)
      }
      return [...prev, book]
    })
  }

  const canSubmit = useMemo(() => {
    if (offeredBooks.length === 0 && offeredLibris <= 0) return false
    if (offeredLibris > userLibrisBalance) return false
    if (!targetListing) return false
    return diff >= 0
  }, [offeredBooks, offeredLibris, userLibrisBalance, targetListing, diff])

  const buildSnapshot = () =>
    offeredBooks.map(b => ({
      listing_id: b.id,
      title: b.book?.title || '',
      condition: b.condition,
      thumbnail_url: b.book?.thumbnail_url || '',
      valuation: estimateBookValue(b),
    }))

  const handleSubmitOffer = async () => {
    if (!canSubmit) return
    setIsSubmitting(true)
    setError(null)
    try {
      const toUserId = targetListing.user?.id ?? targetListing.user_id
      if (!toUserId) throw new Error('No se pudo determinar el dueño del listing objetivo')

      const { data: freshTarget, error: targetErr } = await supabaseClient
        .from('listings')
        .select('id,status,user_id')
        .eq('id', targetListing.id)
        .single()
      if (targetErr) throw targetErr
      if (freshTarget.status !== 'disponible') {
        setError('El libro objetivo ya no está disponible.')
        setIsSubmitting(false)
        return
      }

      const payload = {
        match_id: matchId,
        from_user_id: currentUserId,
        to_user_id: toUserId,
        offered_books: buildSnapshot(),
        offered_libris: offeredLibris,
        target_listing_id: targetListing.id,
        status: 'pending',
        created_at: new Date().toISOString(),
      }

      const { data: inserted, error: insertErr } = await supabaseClient
        .from('swaps')
        .insert([payload])
        .select('*')
        .single()
      if (insertErr) throw insertErr

      setStatusMessage('Oferta enviada correctamente')
      onComplete(inserted)
    } catch (e) {
      console.error('Swap submit error', e)
      setError(e.message || 'No se pudo enviar la oferta')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <LocalShippingIcon fontSize="large" />
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Intercambio con {targetListing?.user_email || 'contraparte'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Libro objetivo: {targetListing?.book?.title || '—'}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} mb={3}>
        <Paper elevation={2} sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Tu oferta
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Elegí libro(s) y/o libris.
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {userListings.map(l => {
              const selected = !!offeredBooks.find(b => b.id === l.id)
              return (
                <Chip
                  key={l.id}
                  label={l.book?.title || ''}
                  variant={selected ? 'filled' : 'outlined'}
                  color={selected ? 'primary' : 'default'}
                  onClick={() => toggleOfferedBook(l)}
                  avatar={
                    <Avatar
                      src={l.book?.thumbnail_url || undefined}
                      sx={{ width: 24, height: 32 }}
                    />
                  }
                  clickable
                />
              )
            })}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TextField
              label="Libris adicionales"
              type="number"
              size="small"
              value={offeredLibris}
              onChange={e => {
                const v = parseInt(e.target.value, 10)
                if (!isNaN(v)) setOfferedLibris(Math.max(0, v))
              }}
              inputProps={{ min: 0, max: userLibrisBalance }}
              helperText={`Tenés ${userLibrisBalance} libris`}
              sx={{ width: 150 }}
            />
          </Box>

          <Divider sx={{ my: 1 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Valor libros:</Typography>
            <Typography fontWeight={600}>{valuationOfferedBooks} libris</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Libris:</Typography>
            <Typography fontWeight={600}>{offeredLibris} libris</Typography>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">Total ofrecido:</Typography>
            <Typography variant="subtitle2" fontWeight={700}>
              {valuationOfferedBooks + offeredLibris} libris
            </Typography>
          </Stack>
        </Paper>

        {/* Recibís */}
        <Paper elevation={2} sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Lo que recibís
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
            <Avatar
              variant="rounded"
              src={targetListing?.book?.thumbnail_url || undefined}
              sx={{ width: 64, height: 90 }}
            />
            <Box>
              <Typography fontWeight={600}>
                {targetListing?.book?.title || '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {targetListing?.book?.authors}
              </Typography>
              <Typography variant="caption" display="block" mt={1}>
                Condición: {targetListing?.condition}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Valor estimado:</Typography>
            <Typography fontWeight={600}>{valuationTarget} libris</Typography>
          </Stack>
        </Paper>
      </Stack>

      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1">Diferencia</Typography>
            <Typography color={diff >= 0 ? 'success.main' : 'error.main'}>
              {diff >= 0
                ? `Estás ofreciendo ${diff} libris de más`
                : `Te faltan ${Math.abs(diff)} libris`}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">Saldo: {userLibrisBalance} libris</Typography>
          </Box>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}
      {statusMessage && (
        <Alert severity="info" sx={{ mb: 1 }}>
          {statusMessage}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <Button
          variant="contained"
          startIcon={<LocalShippingIcon />}
          disabled={!canSubmit || isSubmitting}
          onClick={handleSubmitOffer}
        >
          Enviar oferta
        </Button>
        <Box sx={{ flex: 1 }} />
      </Stack>
    </Box>
  )
}

export default Swap
