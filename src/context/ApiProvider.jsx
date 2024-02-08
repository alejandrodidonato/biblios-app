import { useState, createContext } from 'react'
import axios from 'axios'


const ApiContext = createContext()

const ApiProvider = ({children}) => {

    const [search, setSearch] = useState({
        query: ''
    })

    const [loading, setLoading] = useState(false)
    const [bookData, setBookData] = useState([])
    const [bookDetails, setBookDetails] = useState({})
    

    const getBookList = async datos => {
       
        setLoading(true)

        try {
            
            const url = `https://www.googleapis.com/books/v1/volumes?q=${search.query}&key=${process.env.REACT_APP_GOOGLE_BOOKS_API_KEY}&maxResults=40&printType=books`;
            const { data: res } = await axios(url);
    
           
            if (res && res.items) {
                const filteredBooks = res.items.filter(book => {
                    return (
                        book.volumeInfo.imageLinks &&
                        book.volumeInfo.industryIdentifiers &&
                        book.volumeInfo.industryIdentifiers.some(
                            identifier =>
                                identifier.type === "ISBN_10" || identifier.type === "ISBN_13"
                        )
                    );
                });
    
                setBookData(filteredBooks);
            } else {
                
                setBookData([]);
            }
        }
        catch{
            console.log()
        }
        finally{
            setLoading(false)
        }       
    }
    
    const getBookById = async (bookId) => {
        setLoading(true);
      
        try {
          const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${process.env.REACT_APP_GOOGLE_BOOKS_API_KEY}`;
          const { data: book } = await axios(url);
      
          if (book && book.volumeInfo) {
            if (!areBookDetailsEqual(bookDetails, book)) {
              setBookDetails(book);
            }
          }
      
        } catch (error) {
          console.error('Error al obtener detalles del libro:', error);
        } finally {
          setLoading(false);
        }
      };
      
      const areBookDetailsEqual = (bookDetails1, bookDetails2) => {
        return (
          bookDetails1.id === bookDetails2.id
        );
      };

    const clearBookList = () => {
        setBookData([]);
    };
    



    return (
        <ApiContext.Provider value={{ getBookList, clearBookList, bookData, search, setSearch, loading, setLoading, getBookById, bookDetails }}>
            {children}
        </ApiContext.Provider>
    )
}

export { ApiProvider }

export default ApiContext