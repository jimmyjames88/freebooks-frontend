import axios from 'axios'
import { _UserInputCreate } from '@jimmyjames88/freebooks-types'

const url = import.meta.env.VITE_AUTH_API

const handleError = (error: any) => {
  console.error('Auth API Error:', error)
  throw error
}

export default {
  async login(email: String, password: String) {
    try {
      return axios.post(`${url}/auth/login`, { email, password })
    } catch (error) {
      handleError(error)
    }
  },

  checkEmail(email: String) {
    try {
      return axios.post(`${url}/auth/check-email`, { email })
    } catch (error) {
      return handleError(error)
    }
  },

  async register (user: _UserInputCreate) {
    try {
      return await axios.post(`${url}/auth/register`, user)
    } catch (error) {
      handleError(error)
    }
  },

  async refresh (refreshToken: String) {
    try {
      return await axios.post(`${url}/auth/refresh`, { refreshToken })
    } catch (error) {
      handleError(error)
    }
  }
}
