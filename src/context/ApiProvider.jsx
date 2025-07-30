import { useState, createContext, useCallback } from 'react'
import axios from 'axios'

const ApiContext = createContext()

const ApiProvider = ({ children }) => {
 const [search, setSearch] = useState({ query: "" });
 const [searchType, setSearchType]     = useState("titulo") 
  const [loading, setLoading] = useState(false)
  const [bookData, setBookData] = useState([])

    const getBookList = useCallback(async (query = search.query, type = searchType) => {
    if (!query.trim()) {
      setBookData([])
      return
    }

    setLoading(true)
    try {

        let qualifier
      switch (type) {
        case "titulo":
          qualifier = `intitle:"${query}"`
          break
        case "autor":
          qualifier = `inauthor:"${query}"`
          break
        case "ISBN":
          qualifier = `isbn:${query}`
          break
        default:
          qualifier = `intitle:"${query}"`
      }

      // 2️⃣ Llamada usando axios.get + params
      const { data: res } = await axios.get(
        "https://www.googleapis.com/books/v1/volumes",
        {
          params: {
            q: qualifier,
            key: process.env.REACT_APP_GOOGLE_BOOKS_API_KEY,
            maxResults: 40,
            printType: "books",
            orderBy: "relevance",
          },
        }
      )

      console.log(query)

      // 3️⃣ Filtrado en cliente para descartar ebooks y asegurar ISBN
      const filteredBooks = (res.items || []).filter(book => {
        const info = book.volumeInfo || {}
        return (
          info.industryIdentifiers?.some(id =>
            ["ISBN_10", "ISBN_13"].includes(id.type)
          )
        )
      })

      
    setBookData(filteredBooks);

    } catch (error) {
      console.error("Error en getBookList:", error)
      setBookData([])
    } finally {
      setLoading(false)
    }
  }, [search, searchType])

  const clearBookList = () => {
    setBookData([])
  }

  return (
    <ApiContext.Provider
      value={{
        getBookList,
        clearBookList,
        bookData,
        search,
        setSearch,
        searchType,  
        setSearchType,
        loading,
      }}
    >
      {children}
    </ApiContext.Provider>
  )
}

export { ApiProvider }
export default ApiContext
