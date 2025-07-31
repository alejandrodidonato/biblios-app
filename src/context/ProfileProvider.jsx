import { useState, createContext, useEffect } from 'react'
import useSupabase from '../hooks/useSupabase';

const ProfileContext = createContext()

const ProfileProvider = ({ children }) => {

  const supabase = useSupabase();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener perfil del usuario
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const user = session?.user;
      if (!user) {
        setProfile(null);
        return;
      }
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profileError) throw profileError;
      setProfile(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar perfil
  const updateProfile = async (updates) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();
      if (updateError) throw updateError;
      setProfile(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Suscripción real-time a cambios en el perfil del usuario
    let subscription;
    supabase.auth.getSession().then(({ data: { session } }) => {
      const userId = session?.user?.id;
      if (userId) {
        subscription = supabase
          .channel(`public:profiles:id=eq.${userId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${userId}`
          }, (payload) => {
            setProfile(payload.new);
          })
          .subscribe();
      }
    });

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);


  return (
    <ProfileContext.Provider
      value={{profile, loading, error, refresh: fetchProfile, updateProfile}}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export { ProfileProvider }
export default ProfileContext
