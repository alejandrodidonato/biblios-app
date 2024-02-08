import { useState, createContext, useEffect } from 'react'
import supabaseClient from '../supabase.js'


const BookContext = createContext()

const BookProvider = ({children}) => {

    const [categories, setCategories] = useState([]);

    
  
      useEffect(() => {
        const getCategories = async () => {
            try {
              const { data, error } = await supabaseClient.from('categories').select('category_name');
              if (error) {
                throw error;
              }
              setCategories(data);
            } catch (error) {
              console.error('Error al obtener las categorías:', error.message);
            }
          };

          getCategories();
      }, []);


    return (
        <BookContext.Provider value={{ categories }}>
            {children}
        </BookContext.Provider>
    )
}

export { BookProvider }

export default BookContext