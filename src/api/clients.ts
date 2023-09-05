import axios from 'axios'

const url = `${import.meta.env.VITE_API}/clients`

export default {
  index() {
    return axios.get(`${url}/`)
  },

  list() {
    return axios.get(`${url}/list`)
  },

  show(clientId: string) {
    return axios.get(`${url}/${clientId}`)
  },

  store(client: any) {
    return axios.post(`${url}`, {
      ...client
    })
  },

  destroy(clientId: string) {
    return axios.delete(`${url}/${clientId}`)
  }
}
