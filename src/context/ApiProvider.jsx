import { useState, createContext } from 'react'
import axios from 'axios'


const ApiContext = createContext()

const ApiProvider = ({children}) => {

    const [search, setSearch] = useState({
        query: ''
    })

    const [loading, setLoading] = useState(false)
    const [bookData, setBookData] = useState([])


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
    

    const clearBookList = () => {
        setBookData([]);
    };
    



    return (
        <ApiContext.Provider value={{ getBookList, clearBookList, bookData, search, setSearch, loading, setLoading }}>
            {children}
        </ApiContext.Provider>
    )
}

export { ApiProvider }

export default ApiContext