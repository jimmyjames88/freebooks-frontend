import axios from 'axios'
import { _User } from '@jimmyjames88/freebooks-types'

const url = import.meta.env.VITE_AUTH_API

export default {
  login: (email: String, password: String) => {
    return axios.post(`${url}/auth/login`, { email, password })
  },
  checkEmail: (email: String) => {
    return axios.post(`${url}/auth/check-email`, { email })
  },
  register: (user: Omit<_User, 'id' | 'createdAt' | 'updatedAt'>) => {
    return axios.post(`${url}/auth/register`, user)
  }
}
