import axios from 'axios'
import { _UserInputUpdate } from '@jimmyjames88/freebooks-types'

const url = `${import.meta.env.VITE_API}/users`

const handleError = (error: any) => {
  console.error('Users API Error:', error)
  throw error
}

export default {
  async show(UserId: number) {
    try {
      return await axios.get(`${url}/${UserId}`)
    } catch (error) {
      handleError(error)
    }
  },
  
  async update(user: _UserInputUpdate) {
    try {
      return await axios.put(`${url}/${user.id}`, user)
    } catch (error) {
      handleError(error)
    }
  }
}
