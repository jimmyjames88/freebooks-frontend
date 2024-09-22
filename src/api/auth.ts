import axios from 'axios'
import { _UserInputCreate } from '@jimmyjames88/freebooks-types'
import { User } from '@/classes'

const url = import.meta.env.VITE_AUTH_API

export default {
  login: (email: String, password: String) => {
    return axios.post(`${url}/auth/login`, { email, password })
  },
  checkEmail: (email: String) => {
    return axios.post(`${url}/auth/check-email`, { email })
  },
  async register (user: _UserInputCreate) {
    const response = await axios.post(`${url}/auth/register`, user)
    return new User(response.data)
  }
}
