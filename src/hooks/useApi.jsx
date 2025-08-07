import { useContext } from 'react'
import ApiContext from '../context/ApiProvider'

const useApi = () => {
    return useContext(ApiContext)
}

export default useApi