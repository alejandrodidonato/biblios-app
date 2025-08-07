import { useState, createContext, useEffect } from 'react';
import useSupabase from '../hooks/useSupabase';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const supabaseClient = useSupabase();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async ({ email, password }) => {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const logOut = () => supabaseClient.auth.signOut();

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, [supabaseClient]);

  return (
    <AuthContext.Provider value={{ session, loading, register, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;