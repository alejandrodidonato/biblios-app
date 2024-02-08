import { useContext } from 'react'
import BookContext from '../context/BookProvider'

const useBook = () => {
    return useContext(BookContext)
}

export default useBook