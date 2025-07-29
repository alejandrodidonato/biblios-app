import { useState, createContext, useEffect } from 'react';
import supabaseClient from '../supabase.js';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async ({ email, password }) => {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;
    setSession(data.session);
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
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, register, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;