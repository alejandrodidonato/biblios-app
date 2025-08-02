import { useState, createContext, useEffect } from 'react';
import useSupabase from '../hooks/useSupabase';
import useProfile from '../hooks/useProfile';

const BooksContext = createContext();

const BooksProvider = ({ children }) => {
  const supabase = useSupabase();
  const { profile } = useProfile();

  const [allBooks, setAllBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [userSearchedBooks, setUserSearchedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Traer todos los libros de la base
  useEffect(() => {
    const fetchAllBooks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*');
      setAllBooks(data || []);
      setLoading(false);
    };
    fetchAllBooks();
  }, [supabase]);

  // Traer libros publicados por el usuario (listings)
  useEffect(() => {
    const fetchUserBooks = async () => {
      if (!profile?.id) return;
      const { data, error } = await supabase
        .from('listings')
        .select('*, books(*)')
        .eq('user_id', profile.id)
        .eq('status', 'disponible');
        console.log('Listings:', data);
        
      // Extrae el libro de cada listing
      
      setUserBooks(data?.map(l => l.books) || []);
    };
    fetchUserBooks();
  }, [supabase, profile]);

  // Traer libros buscados por el usuario (searches activas)
  useEffect(() => {
    const fetchUserSearchedBooks = async () => {
      if (!profile?.id) return;
      const { data, error } = await supabase
        .from('searches')
        .select('*, books(*)')
        .eq('user_id', profile.id)
        .eq('active', true);
        
      setUserSearchedBooks(data?.map(s => s.books) || []);
    };
    fetchUserSearchedBooks();
  }, [profile, supabase]);

  return (
    <BooksContext.Provider
      value={{
        allBooks,
        userBooks,
        userSearchedBooks,
        loading
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export { BooksProvider };
export default BooksContext;