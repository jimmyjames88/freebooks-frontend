import axios from 'axios'
import { _Client } from '@jimmyjames88/freebooks-types'

const url = `${import.meta.env.VITE_API}/clients`

export default {
  index(filters: any) {
    return axios.get(`${url}/`, {
      params: {
        ...filters
      }
    })
  },

  list() {
    return axios.get(`${url}/list`)
  },

  show(clientId: number) {
    return axios.get(`${url}/${clientId}`)
  },

  store(client: _Client) {
    return axios.post(`${url}`, {
      ...client
    })
  },

  update(client: _Client) {
    return axios.put(`${url}/${client.id}`, {
      ...client
    })
  },

  destroy(clientId: number) {
    return axios.delete(`${url}/${clientId}`)
  }
}
