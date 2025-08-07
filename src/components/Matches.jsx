// Matches.jsx
import React, { useEffect, useState, useMemo } from 'react'
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material'
import supabaseClient from '../supabase.js'
import { useNavigate } from 'react-router-dom'
import appTheme from '../theme.js'
import ConfirmSwapModal from './ConfirmSwapModal'


const MatchCard = ({ match, isSearchOwner, currentUserId, navigate, lastMessage, isNew }) => {

  const otherBook = isSearchOwner
    ? {
        title: match.listing_book_title,
        authors: match.listing_book_authors,
        thumbnail_url: match.listing_book_thumbnail,
        published_year: match.listing_book_year,
        id: match.listing_book_id,
      }
    : {
        title: match.search_book_title,
        authors: match.search_book_authors,
        thumbnail_url: match.search_book_thumbnail,
        published_year: match.search_book_year,
        id: match.search_book_id,
      }

  const counterparty = isSearchOwner
    ? { avatar: match.listing_user_avatar, email: match.listing_user_email }
    : { avatar: match.search_user_avatar, email: match.search_user_email }

    


  return (
    <Card variant="outlined" sx={{ position: 'relative', borderColor: appTheme.palette.primary.main }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">

          <Box flex={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar variant="rounded" src={otherBook.thumbnail_url} sx={{ width: 56, height: 80 }} />
              <Box alignItems="center" gap={1} >
                <Typography fontWeight={600}>{otherBook.title}</Typography>
                <Typography variant="body2">
                  {otherBook.authors}
                  {otherBook.published_year && ` · ${otherBook.published_year}`}
                </Typography>
              </Box>
            </Stack>
            <Box mt={1} display="flex" alignItems="center" gap={1} justifyContent="space-between">
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                <Avatar src={counterparty.avatar || undefined} sx={{ width: 32, height: 32 }} />
                <Typography variant="body1" sx={{maxWidth: '160px', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {counterparty.email || 'Usuario desconocido'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end', backgroundColor: appTheme.palette.primary.main, padding: '4px 8px', borderRadius: '4px' }}>
            <Button size="small" onClick={() => navigate(`/chat/${match.match_id}`)} sx={{color: appTheme.palette.primary.white }}>
              Ir al chat
            </Button>
          </Box>
            </Box>
          </Box>
        </Stack>
        {isNew && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 15,
            height: 15,
            borderRadius: '50%',
            backgroundColor: appTheme.palette.primary.main,
          }}
        />
      )}
      </CardContent>
    </Card>
  )
}

const Matches = () => {
  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [matches, setMatches] = useState([])
  const [chats, setChats] = useState([])
  const [lastMessagesMap, setLastMessagesMap] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState(0)
  const navigate = useNavigate()
  const [swapToConfirm, setSwapToConfirm] = useState(null)
  const [loadingConfirm, setLoadingConfirm] = useState(false)

  


  const [swaps, setSwaps] = useState([])

useEffect(() => {
  if (!session?.user?.id) return

  const fetchSwaps = async () => {
    const { data, error } = await supabaseClient
      .from('swaps')
      .select(`
        *,
        match:match_id (
          id,
          listing:listing_id (
            id,
            user: user_id (id, email, avatar_url),
            book: book_id (id, title, authors, thumbnail_url)
          ),
          search:search_id (
            id,
            user: user_id (id, email, avatar_url),
            book: book_id (id, title, authors, thumbnail_url)
          )
        )
      `)
      .or(`from_user_id.eq.${session.user.id},to_user_id.eq.${session.user.id}`)
      .in('status', ['pending', 'countered', 'accepted'])

      .order('created_at', { ascending: false })

    if (!error && data) {
      setSwaps(data)
    } else {
      console.error('Error cargando swaps:', error)
    }
  }

  fetchSwaps()
}, [session])


  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingSession(false)
    })
  }, [])

  useEffect(() => {
    if (!session?.user?.id) return
    fetchMatches()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const fetchMatches = async () => {
    setLoading(true)
    setError(null)
    const user_id = session.user.id

    try {
      const { data: matchesData, error: matchesErr } = await supabaseClient
        .from('user_matches_with_profiles')
        .select('*')
        .or(`listing_user_id.eq.${user_id},search_user_id.eq.${user_id}`)
        .order('match_created_at', { ascending: false })

      if (matchesErr) throw matchesErr
      setMatches(matchesData || [])

      const matchIds = (matchesData || []).map(m => m.match_id)
      if (matchIds.length) {
        const { data: chatsData, error: chatsErr } = await supabaseClient
          .from('chats')
          .select('id, match_id, created_at')
          .in('match_id', matchIds)
        if (chatsErr) throw chatsErr
        setChats(chatsData || [])

        const chatIds = (chatsData || []).map(c => c.id)
        if (chatIds.length) {
          const { data: messagesData, error: messagesErr } = await supabaseClient
            .from('messages')
            .select('chat_id, content, created_at, sender:sender_id (avatar_url,email)')
            .in('chat_id', chatIds)
            .order('created_at', { ascending: false })
          if (messagesErr) throw messagesErr

          const map = {}
          for (const msg of messagesData) {
            if (!map[msg.chat_id]) {
              map[msg.chat_id] = {
                content: msg.content,
                created_at: msg.created_at,
                sender: msg.sender,
              }
            }
          }
          setLastMessagesMap(map)
        }
      }
    } catch (err) {
      console.error('Error cargando matches/chats:', err)
      setError(err.message || 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }

  const confirmSwap = async swap => {
  setLoadingConfirm(true)
  try {
    const updates = []

    updates.push(
      supabaseClient
        .from('swaps')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', swap.id)
    )

    if (swap.offered_libris > 0) {
      updates.push(
        supabaseClient.rpc('decrease_libris', {
          user_id_input: swap.from_user_id,
          amount_input: swap.offered_libris,
        })
      )
    }

    const offeredBookIds = (swap.offered_books || []).map(b => b.listing_id)
    if (offeredBookIds.length > 0) {
      updates.push(
        supabaseClient
          .from('listings')
          .update({ status: 'no disponible' })
          .in('id', offeredBookIds)
      )
    }

    updates.push(
      supabaseClient
        .from('listings')
        .update({ status: 'no disponible' })
        .eq('id', swap.target_listing_id)
    )

if (swap.match?.search?.id) {
  updates.push(
    supabaseClient
      .from('searches')
      .update({ active: false })
      .eq('id', swap.match.search.id)
  )
}


    console.log('Confirming swap with updates:', swap)

    await Promise.all(updates)
    fetchSwaps()
  } catch (error) {
    console.error('Error al confirmar intercambio:', error)
  } finally {
    setSwapToConfirm(null)
    setLoadingConfirm(false)
  }
}

const fetchSwaps = async () => {
  try {
    const { data, error } = await supabaseClient
      .from('swaps')
      .select(`
        *,
        match:match_id (
          id,
          listing:listing_id (
            id,
            user: user_id (id, email, avatar_url),
            book: book_id (id, title, authors, thumbnail_url)
          ),
          search:search_id (
            id,
            user: user_id (id, email, avatar_url),
            book: book_id (id, title, authors, thumbnail_url)
          )
        )
      `)
      .or(`from_user_id.eq.${session.user.id},to_user_id.eq.${session.user.id}`)
      .in('status', ['pending', 'countered', 'accepted'])
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error cargando swaps:', error)
    } else {
      setSwaps(data)
    }
  } catch (err) {
    console.error('Error al cargar swaps:', err)
  }
}



  const [viewedTabs, setViewedTabs] = useState({
      matches: false,
      offers: false,
      intercambios: false,
    })

  const handleTabChange = (_, newVal) => {
  setTab(newVal)

  setViewedTabs(prev => {
    const updated = { ...prev }
    if (newVal === 0) updated.matches = true
    if (newVal === 1) updated.offers = true
    if (newVal === 2) updated.intercambios = true
    return updated
  })
}


  // derivaciones con useMemo (siempre se llaman en el mismo orden)
  const searchMatches = useMemo(
    () => matches.filter(m => m.search_user_id === session?.user?.id),
    [matches, session]
  )
  const listingMatches = useMemo(
    () => matches.filter(m => m.listing_user_id === session?.user?.id),
    [matches, session]
  )
  const matchesWithLastMessage = useMemo(() => {
  const enriched = matches.map(match => {
    const chat = chats.find(c => c.match_id === match.match_id)
    const lastMessage = chat ? lastMessagesMap[chat.id] : null
    const isNew = lastMessage && lastMessage.sender?.email !== session?.user?.email
    return {
      match,
      lastMessage,
      isNew,
    }
  })

 return enriched.sort((a, b) => {
  const dateA = new Date(a.lastMessage?.created_at || a.match.match_created_at)
  const dateB = new Date(b.lastMessage?.created_at || b.match.match_created_at)
  return dateB - dateA
})

}, [matches, chats, lastMessagesMap, session])



  if (loadingSession) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (!session?.user?.id) {
    return (
      <Typography sx={{ mt: 4, textAlign: 'center' }}>
        Tenés que estar logueado.
      </Typography>
    )
  }

  const newMatchesCount = matchesWithLastMessage.filter(m => m.isNew).length
  const newOffersCount = swaps.filter(s => s.to_user_id === session.user.id && s.status !== 'accepted').length
  const newIntercambiosCount = 0


  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="matches vs chats" centered>
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                Matches
                {!viewedTabs.matches && newMatchesCount > 0 && (
                  <Box
                    sx={{
                      backgroundColor: appTheme.palette.primary.main,
                      color: 'white',
                      borderRadius: '50%',
                      fontSize: '0.7rem',
                      width: 20,
                      height: 20,
                      padding: '',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {newMatchesCount}
                  </Box>
                )}
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                Ofertas
                {!viewedTabs.offers && newOffersCount > 0 && (
                  <Box
                    sx={{
                      backgroundColor: appTheme.palette.primary.main,
                      color: 'white',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {newOffersCount}
                  </Box>
                )}
              </Box>
            }
          />
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                Intercambios
                {!viewedTabs.intercambios && newIntercambiosCount > 0 && (
                  <Box
                    sx={{
                      backgroundColor: appTheme.palette.primary.main,
                      color: 'white',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {newIntercambiosCount}
                  </Box>
                )}
              </Box>
            }
          />
        </Tabs>

      </Box>

      {tab === 0 && (
        <Stack spacing={4} my={4}>
          <Box >
            <Typography variant="h2" color={appTheme.palette.primary.main}  sx={{ mb: 4, fontWeight: 700, textAlign: 'center', textDecoration: 'underline', textUnderlineOffset: '10px' }}>
              Tienen el libro que buscás:
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress />
              </Box>
            ) : searchMatches.length === 0 ? (
              <Typography color={appTheme.palette.primary.main}  sx={{ textAlign: 'center' }}>
                No tenés matches de búsquedas aún.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {matchesWithLastMessage
                  .filter(m => m.match.search_user_id === session.user.id)
                  .map(({ match, lastMessage, isNew }) => (
                    <MatchCard
                      key={`search-${match.match_id}`}
                      match={match}
                      isSearchOwner={true}
                      currentUserId={session.user.id}
                      navigate={navigate}
                      lastMessage={lastMessage}
                      isNew={isNew}
                    />
                ))}

              </Stack>
            )}
          </Box>

          <Box>
            <Typography variant="h2" color={appTheme.palette.primary.main}  sx={{ mb: 4, fontWeight: 700, textAlign: 'center', textDecoration: 'underline', textUnderlineOffset: '10px' }}>
              Quieren tu libro:
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress />
              </Box>
            ) : listingMatches.length === 0 ? (
              <Typography color={appTheme.palette.primary.main} sx={{ textAlign: 'center' }}>
                No tenés matches de tus libros aún.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {matchesWithLastMessage
                .filter(m => m.match.listing_user_id === session.user.id)
                .map(({ match, lastMessage, isNew }) => (
                  <MatchCard
                    key={`listing-${match.match_id}`}
                    match={match}
                    isSearchOwner={false}
                    currentUserId={session.user.id}
                    navigate={navigate}
                    lastMessage={lastMessage}
                    isNew={isNew}
                  />
              ))}

              </Stack>
            )}
          </Box>

          {error && (
            <Box mt={2} textAlign="center">
              <Typography color="error">Error: {error}</Typography>
              <Button onClick={fetchMatches} sx={{ mt: 1 }}>
                Reintentar
              </Button>
            </Box>
          )}
        </Stack>
      )}

      {tab === 1 && (
  <Box>
    <Stack spacing={4} my={4}>
    <Typography variant="h2" color={appTheme.palette.primary.main}  sx={{ mb: 4, fontWeight: 700, textAlign: 'center', textDecoration: 'underline', textUnderlineOffset: '10px' }}>
      Ofertas
    </Typography>
    {loading ? (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress />
      </Box>
    ) : swaps.length === 0 ? (
       <Typography color={appTheme.palette.primary.main} sx={{ textAlign: 'center' }}>No tenés ofertas activas.</Typography>
    ) : (
      <Stack spacing={2}>
        {swaps.map(swap => {
  const isSender = swap.from_user_id === session.user.id

  const counterpartyUser = isSender
    ? swap.match.search.user
    : swap.match.listing.user

  const counterpartyBook = isSender
    ? swap.match.search.book
    : swap.match.listing.book

  return (
    <Card key={swap.id} variant="outlined" sx={{ borderColor: appTheme.palette.primary.main }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar variant="rounded" src={counterpartyBook?.thumbnail_url} sx={{ width: 48, height: 68 }} />
          <Box flex={1}>
            <Typography fontWeight={600}>Libro: {counterpartyBook?.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {counterpartyUser?.email || 'Usuario'}
            </Typography>
            <Typography variant="caption">
              Estado: {swap.status === 'countered' ? 'Contraoferta' : 'Pendiente'}
            </Typography>
          </Box>
          
        </Stack>
        <Stack direction="row" alignContent="center" alignItems="center" justifyContent="center" mt={2}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate(`/chat/${swap.match_id}`)}
          >
            Ver chat
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
})}
      </Stack>
    )}
    </Stack>
  </Box>
)}

{tab === 2 && (
  <Box>
    <Stack spacing={4} my={4}>
    <Typography variant="h2" color={appTheme.palette.primary.main}  sx={{ mb: 4, fontWeight: 700, textAlign: 'center', textDecoration: 'underline', textUnderlineOffset: '10px' }}>
      Intercambios aceptados
    </Typography>
    {loading ? (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress />
      </Box>
    ) : (
      <Stack spacing={2}>
        {swaps
          .filter(swap => swap.status === 'accepted')
          .map(swap => {
            const isSender = swap.from_user_id === session.user.id

            const counterpartyUser = isSender
              ? swap.match.search.user
              : swap.match.listing.user

            const counterpartyBook = isSender
              ? swap.match.search.book
              : swap.match.listing.book

            return (
              <Card key={swap.id} variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      variant="rounded"
                      src={counterpartyBook?.thumbnail_url}
                      sx={{ width: 48, height: 68 }}
                    />
                    <Box flex={1}>
                      <Typography fontWeight={600}>
                        Libro: {counterpartyBook?.title} 
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {counterpartyUser?.email || 'Usuario'}
                      </Typography>
                      <Typography variant="caption">
                        Estado: Aceptado
                      </Typography>
                    </Box>
                    
                  </Stack>
                  <Stack spacing={1} direction="row" alignItems="center" justifyContent="center" mt={2}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/chat/${swap.match_id}`)}
                      >
                        Ver chat
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ backgroundColor: appTheme.palette.primary.main, color: 'white' }}
                        onClick={() => setSwapToConfirm(swap)}
                      >
                        Confirmar
                      </Button>

                    </Stack>
                </CardContent>
              </Card>
            )
          })}
      </Stack>
    )}
    </Stack>
  </Box>
)}

<ConfirmSwapModal
  open={!!swapToConfirm}
  onClose={() => setSwapToConfirm(null)}
  onConfirm={() => confirmSwap(swapToConfirm)}
/>


    </Box>
    
  )
}

export default Matches