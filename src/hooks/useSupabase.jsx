import { useContext } from 'react';
import SupabaseContext from '../context/SupabaseProvider';

const useSupabase = () => {
  const context = useContext(SupabaseContext);
  return context.supabaseClient;
};

export default useSupabase;