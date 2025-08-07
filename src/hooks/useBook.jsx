import { useContext } from 'react'
import BooksContext from '../context/BooksProvider'

const useBooks = () => {
    return useContext(BooksContext)
}

export default useBooks