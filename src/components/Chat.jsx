// Chat.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Dialog,
  IconButton,
  Fab,
  Alert,
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import supabaseClient from '../supabase.js'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { styled } from '@mui/material/styles'
import Swap from './Swap' // ajustá el path si corresponde

const MessageBubble = styled('div', {
  shouldForwardProp: prop => prop !== 'isOwn',
})(({ theme, ownerState }) => {
  const isOwn = ownerState?.isOwn
  const bg = isOwn ? 'rgba(119,154,74,0.5)' : '#779A4A'
  const color = isOwn ? theme.palette.text.primary : '#fff'
  return {
    position: 'relative',
    padding: '10px 14px',
    borderRadius: 8,
    backgroundColor: bg,
    color,
    maxWidth: '70%',
    alignSelf: isOwn ? 'flex-end' : 'flex-start',
    fontSize: '0.9rem',
    lineHeight: 1.2,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    '&:after': isOwn
      ? {
          content: '""',
          position: 'absolute',
          right: -6,
          top: 12,
          width: 0,
          height: 0,
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderLeft: `6px solid ${bg}`,
        }
      : {
          content: '""',
          position: 'absolute',
          left: -6,
          top: 12,
          width: 0,
          height: 0,
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderRight: `6px solid ${bg}`,
        },
  }
})

const Chat = () => {
  const { id: chatId } = useParams()
  const navigate = useNavigate()

  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [chatData, setChatData] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [currentUserProfile, setCurrentUserProfile] = useState(null)
  const [userListings, setUserListings] = useState([])
  const [userLibrisBalance, setUserLibrisBalance] = useState(0)
  const [showSwap, setShowSwap] = useState(false)
  const [existingSwap, setExistingSwap] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)

  // obtener sesión
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingSession(false)
    })
  }, [])

  // traer perfil y listings propios
  useEffect(() => {
    if (!session?.user?.id) return
    const fetchProfileAndListings = async () => {
      const { data: profile, error: profileErr } = await supabaseClient
        .from('profiles')
        .select('avatar_url,email,token_balance')
        .eq('id', session.user.id)
        .single()
      if (!profileErr && profile) {
        setCurrentUserProfile(profile)
        setUserLibrisBalance(profile.token_balance || 0)
      }

      const { data: listingsData, error: listingsErr } = await supabaseClient
        .from('listings')
        .select(`
          id,
          condition,
          status,
          price_libris,
          user_id,
          book:book_id (id, title, authors, thumbnail_url, published_year)
        `)
        .eq('user_id', session.user.id)
        .eq('status', 'disponible')
      if (!listingsErr && listingsData) {
        setUserListings(listingsData)
      }
    }
    fetchProfileAndListings()
  }, [session])

  // fetch inicial de chat y mensajes
  const fetchChatAndMessages = useCallback(async () => {
    if (!session?.user?.id) return
    setLoading(true)
    setError(null)
    try {
      const { data: chatRes, error: chatErr } = await supabaseClient
        .from('chats')
  .select(`
    id,
    match:match_id (
      id,
      listing:listing_id (
        id,
        condition,
        status,
        price_libris,
        user: user_id (id, avatar_url, email),
        book: book_id (id, title, authors, thumbnail_url, published_year)
      ),
      search:search_id (
        id,
        active,
        user: user_id (id, avatar_url, email),
        book: book_id (id, title, authors, thumbnail_url, published_year)
      )
    )
  `)
  .eq('id', chatId)
  .maybeSingle()

// Si no existe, lo creamos
if (!chatRes) {
  try {
    const { data: inserted, error: insertErr } = await supabaseClient
      .from('chats')
      .insert([{ id: chatId, match_id: chatId }]) // ⚠️ match_id == chatId en tu modelo actual
      .select(`
        id,
        match:match_id (
          id,
          listing:listing_id (
            id,
            condition,
            status,
            price_libris,
            user: user_id (id, avatar_url, email),
            book: book_id (id, title, authors, thumbnail_url, published_year)
          ),
          search:search_id (
            id,
            active,
            user: user_id (id, avatar_url, email),
            book: book_id (id, title, authors, thumbnail_url, published_year)
          )
        )
      `)
      .single()

    if (insertErr) throw insertErr
    chatRes = inserted
  } catch (e) {
    console.error('Error creando chat:', e)
    setError('No se pudo crear el chat.')
    setLoading(false)
    return
  }
}

      setChatData(chatRes)

      const currentUserId = session.user.id
      const isListingOwner = chatRes.match.listing?.user?.id === currentUserId
      const isSearchOwner = chatRes.match.search?.user?.id === currentUserId
      if (!isListingOwner && !isSearchOwner) {
        setError('No tenés permiso para ver este chat')
        setLoading(false)
        return
      }

      const { data: messagesRes, error: messagesErr } = await supabaseClient
        .from('messages')
        .select('id, chat_id, content, created_at, sender_id')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (messagesErr) throw messagesErr
      setMessages(messagesRes || [])
    } catch (err) {
      console.error('Error cargando chat:', err)
      setError(err.message || 'Error al cargar chat')
    } finally {
      setLoading(false)
    }
  }, [chatId, session])

  useEffect(() => {
    if (session?.user?.id) {
      fetchChatAndMessages()
    }
  }, [session, fetchChatAndMessages])

  // realtime mensajes
  useEffect(() => {
    if (!chatId) return
    const channel = supabaseClient
      .channel(`public:messages:chat_id=eq.${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        payload => {
          setMessages(prev => {
            if (prev.some(m => m.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
        }
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [chatId])

  // realtime swaps (ofertas) para este match
  useEffect(() => {
    if (!chatData?.match?.id) return
    const matchId = chatData.match.id

    // cargar la swap existente inicial
    const fetchExisting = async () => {
      try {
        const { data: swapsData, error: swapsErr } = await supabaseClient
          .from('swaps')
          .select('*')
          .eq('match_id', matchId)
          .in('status', ['pending', 'countered'])
          .order('created_at', { ascending: false })
          .limit(1)
        if (!swapsErr && swapsData?.length) {
          setExistingSwap(swapsData[0])
        }
      } catch (e) {
        console.warn('Error cargando swap existente', e)
      }
    }
    fetchExisting()

    // suscripción real-time
    const channel = supabaseClient
      .channel(`public:swaps:match_id=eq.${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'swaps',
          filter: `match_id=eq.${matchId}`,
        },
        payload => {
          const updated = payload.new
          setExistingSwap(prev => {
            if (!prev || prev.id !== updated.id) return updated
            return { ...prev, ...updated }
          })
          if (session?.user?.id === updated.to_user_id) {
            setStatusMessage('Tenés una nueva oferta / actualización pendiente')
          }
        }
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [chatData, session])

  const handleSend = async e => {
    e.preventDefault()
    if (!newMessage.trim() || !session?.user?.id) return
    setSending(true)
    try {
      const payload = {
        chat_id: chatId,
        sender_id: session.user.id,
        content: newMessage.trim(),
      }
      const { data: inserted, error: insertErr } = await supabaseClient
        .from('messages')
        .insert([payload])
        .select('id, chat_id, content, created_at, sender_id')
        .single()

      if (insertErr) throw insertErr
      setMessages(prev => [...prev, inserted])
      setNewMessage('')
    } catch (err) {
      console.error('Error enviando mensaje:', err)
      setError(err.message || 'No se pudo enviar el mensaje')
    } finally {
      setSending(false)
    }
  }

  if (loadingSession || loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 700, margin: '0 auto' }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="outlined" onClick={fetchChatAndMessages}>
          Reintentar
        </Button>
      </Box>
    )
  }

  if (!chatData) return null

  const currentUserId = session.user.id
  const isListingOwner = chatData.match.listing?.user?.id === currentUserId
  const isSearchOwner = chatData.match.search?.user?.id === currentUserId

  const counterpartyUser = isListingOwner
    ? chatData.match.search?.user
    : chatData.match.listing?.user

  const counterpartyBook = isListingOwner
    ? chatData.match.search?.book
    : chatData.match.listing?.book

  const counterpartyEmail = counterpartyUser?.email || 'Usuario'
  const counterpartyAvatar = counterpartyUser?.avatar_url || ''

  // solo para search owner: el listing objetivo que quiere
  const targetListing = isSearchOwner
    ? {
        ...chatData.match.listing,
        user_email: chatData.match.listing?.user?.email,
        user_id: chatData.match.listing?.user?.id,
        book: chatData.match.listing?.book,
      }
    : null

  const handleExchange = () => {
    if (isSearchOwner) {
      setShowSwap(true)
    } else {
      alert('Vender tu libro por libris aún no está implementado aquí.')
    }
  }

  // para mostrar oferta recibida si sos destinatario
  const isRecipient = existingSwap && session?.user?.id === existingSwap.to_user_id
  const isSender = existingSwap && session?.user?.id === existingSwap.from_user_id

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          maxWidth: 900,
          mx: 'auto',
          minHeight: '90vh',
        }}
      >
        {statusMessage && (
          <Alert severity="info" sx={{ position: 'sticky', top: 0, zIndex: 5 }}>
            {statusMessage}
          </Alert>
        )}

        {/* Header */}
        <Box
          sx={{
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 3,
            px: 2,
            backgroundColor: '#779A4A',
          }}
        >
          <Avatar
            sx={{ border: '2px solid #fff', width: 50, height: 50 }}
            src={counterpartyAvatar || undefined}
            alt={counterpartyEmail}
          />
          <Box flex={1} sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              color="#fff"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {counterpartyEmail}
            </Typography>
            <Typography variant="body2" color="#fff">
              Libro: {counterpartyBook?.title}
            </Typography>
          </Box>
          <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIosNewIcon sx={{ color: '#fff' }} />} />
        </Box>

        {/* Oferta recibida / contraoferta (si aplica) */}
        {existingSwap && isRecipient && existingSwap.status === 'pending' && (
  <Box
    sx={{
      mb: 2,
      p: 2,
      border: '1px solid',
      borderColor: 'primary.main',
      borderRadius: 2,
      backgroundColor: 'rgba(119,154,74,0.05)',
    }}
  >
    <Typography variant="subtitle1" fontWeight={600}>
      Oferta recibida
    </Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>
      {`Te ofrecieron:`}
    </Typography>

    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
      {existingSwap.offered_books?.map((b, i) => (
        <Paper key={i} variant="outlined" sx={{ p: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
          <Avatar variant="rounded" src={b.thumbnail_url || undefined} sx={{ width: 40, height: 55 }} />
          <Box>
            <Typography variant="body2">{b.title}</Typography>
            <Typography variant="caption">Condición: {b.condition}</Typography>
            <Typography variant="caption" display="block">
              Valor: {b.valuation} libris
            </Typography>
          </Box>
        </Paper>
      ))}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="body2">Libris: {existingSwap.offered_libris}</Typography>
      </Box>
    </Box>

    <Box sx={{ mt: 1 }}>
      <Typography variant="body2">
        {existingSwap.diff >= 0
          ? `Están ofreciéndote ${existingSwap.diff} libris de más`
          : `Te faltan ${Math.abs(existingSwap.diff)} libris`}
      </Typography>
    </Box>

    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
      <Button
        variant="contained"
        size="small"
        onClick={async () => {
          try {
            await supabaseClient
              .from('swaps')
              .update({ status: 'accepted', updated_at: new Date().toISOString() })
              .eq('id', existingSwap.id)
            setStatusMessage('Oferta aceptada')
          } catch (e) {
            console.error(e)
          }
        }}
      >
        Aceptar
      </Button>
      <Button
        variant="outlined"
        size="small"
        onClick={async () => {
          try {
            await supabaseClient
              .from('swaps')
              .update({ status: 'rejected', updated_at: new Date().toISOString() })
              .eq('id', existingSwap.id)
            setStatusMessage('Oferta rechazada')
          } catch (e) {
            console.error(e)
          }
        }}
      >
        Rechazar
      </Button>
    </Stack>
  </Box>
)}

        {/* Mensajes (sin autoscroll) */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 2,
            py: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            paddingBottom: '160px',
          }}
        >
          {messages.map(msg => {
            const isOwn = msg.sender_id === currentUserId
            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  flexDirection: isOwn ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <MessageBubble ownerState={{ isOwn }}>
                  <Typography variant="body2" sx={{ margin: 0, lineHeight: 1 }}>
                    {msg.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      alignSelf: isOwn ? 'flex-end' : 'flex-start',
                      color: isOwn ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </MessageBubble>
              </Box>
            )
          })}
        </Box>

        {/* Botón de intercambio encima del input */}
        <Box sx={{ display: 'flex', justifyContent: 'center', px: 2, pt: 1, my: 1 }}>
          <Fab
            variant="extended"
            color="primary"
            onClick={handleExchange}
            aria-label="realizar intercambio"
            size="medium"
            sx={{ borderRadius: 10, textTransform: 'none', fontWeight: 600 }}
          >
            <SwapHorizIcon sx={{ mr: 1 }} />
            Realizar oferta
          </Fab>
        </Box>

 

        {/* Input fijo abajo */}
        <Box
          component="form"
          onSubmit={handleSend}
          sx={{
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 3,
            px: 2,
          }}
        >
          <TextField
            placeholder="Escribí un mensaje..."
            fullWidth
            size="small"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(e)
              }
            }}
          />
          <Button type="submit" disabled={sending || !newMessage.trim()} variant="contained">
            Enviar
          </Button>
        </Box>
      </Box>

      {/* Swap modal */}
      <Dialog open={showSwap} onClose={() => setShowSwap(false)} fullWidth maxWidth="lg" scroll="paper">
        <Box sx={{ position: 'relative' }}>
          <IconButton aria-label="cerrar" onClick={() => setShowSwap(false)} sx={{ position: 'absolute', top: 8, right: 8 }}>
            ✕
          </IconButton>
          <Swap
            matchId={chatData?.match?.id}
            targetListing={targetListing}
            currentUserId={session?.user?.id}
            userListings={userListings}
            userLibrisBalance={userLibrisBalance}
            existingSwap={existingSwap}
            onComplete={swapResult => {
              setShowSwap(false)
              if (swapResult) {
                setStatusMessage('Oferta enviada / actualizada')
              }
            }}
          />
        </Box>
      </Dialog>
    </>
  )
}

export default Chat