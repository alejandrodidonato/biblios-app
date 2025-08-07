import React, { useMemo } from 'react'
import { Box, Stack, Typography, CircularProgress } from '@mui/material'
import MatchCard from './MatchCard'
import appTheme from '../theme'

const Intercambios = ({ swaps, session, navigate, loading }) => {
  const acceptedSwaps = useMemo(() => {
    return swaps.filter(s => s.status === 'accepted')
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
        Intercambios confirmados
      </Typography>

      {acceptedSwaps.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
          Aún no tenés intercambios aceptados.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {acceptedSwaps.map(swap => (
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

export default Intercambios
