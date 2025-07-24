import { useState, createContext, useEffect } from 'react';
import supabaseClient from '../supabase.js';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registro del usuario, creación del perfil y login inmediato
  const register = async ({ email, password }) => {
    // signup en Auth
    const { data: signUpData, error: signUpError } =
      await supabaseClient.auth.signUp({ email, password });

    if (signUpError) throw signUpError;

    // si no hay sesión, hacemos login inmediato
    if (!signUpData.session) {
      const { data: signInData, error: signInError } =
        await supabaseClient.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      setSession(signInData.session);
    } else {
      setSession(signUpData.session);
    }

    // 3) insert en profiles
    const userId = signUpData.user.id;
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert([{ id: userId }]);

    if (profileError) throw profileError;

    return signUpData;
  };

  const logOut = () => supabaseClient.auth.signOut();

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, loading, register, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
