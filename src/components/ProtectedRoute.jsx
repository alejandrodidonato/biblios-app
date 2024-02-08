import useAuth from '../hooks/useAuth'
import {Navigate} from 'react-router-dom'
import Loading from './Loading'

export function ProtectedRoute({ children }) {

    const { session, loading } = useAuth()

    if(loading) return <Loading/>

    if(!session) return <Navigate to="/login" />

    return <>{children}</>

}