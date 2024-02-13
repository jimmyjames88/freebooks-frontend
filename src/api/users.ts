import axios from 'axios'
import User from '@/classes/User'

const url = `${import.meta.env.VITE_API}/users`

export default {
  async show(UserId: number): Promise<User> {
    const response = await axios.get(`${url}/${UserId}`)
    return new User(response.data)
  },
  
  async update(user: Partial<User>): Promise<User> {
    const response = await axios.put(`${url}/${user.id}`, user)
    return new User(response.data)
  }
}
