import { createContext } from 'react'
import supabaseClient from '../supabase.js';

const SupabaseContext = createContext()

const SupabaseProvider = ({ children }) => {

  return (
    <SupabaseContext.Provider
      value={{supabaseClient}}
    >
      {children}
    </SupabaseContext.Provider>
  )
}

export { SupabaseProvider }
export default SupabaseContext
