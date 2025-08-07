import React, { useMemo } from 'react'
import { Box, Stack, Typography, CircularProgress } from '@mui/material'
import MatchCard from './MatchCard'
import appTheme from '../theme'

const Offers = ({ swaps, session, navigate, loading }) => {
  const activeOffers = useMemo(() => {
    return swaps.filter(s =>
      ['pending', 'countered', 'rejected'].includes(s.status)
    )
  }, [swaps])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography
        variant="h2"
        color={appTheme.palette.primary.main}
        sx={{
          mb: 4,
          fontWeight: 700,
          textAlign: 'center',
          textDecoration: 'underline',
          textUnderlineOffset: '10px'
        }}
      >
        Tus Ofertas
      </Typography>

      {activeOffers.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
          No tenés ofertas activas.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {activeOffers.map(swap => (
            <MatchCard
              key={swap.id}
              swap={swap}
              currentUserId={session.user.id}
              navigate={navigate}
            />
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default Offers
