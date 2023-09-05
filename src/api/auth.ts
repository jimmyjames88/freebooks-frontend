import axios from 'axios'

const url = import.meta.env.VITE_AUTH_API

export default {
  login: (email: String, password: String) => {
    return axios.post(`${url}/auth/login`, { email, password })
  }
}
