import axios from 'axios'

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

  show(clientId: string) {
    return axios.get(`${url}/${clientId}`)
  },

  store(client: any) {
    return axios.post(`${url}`, {
      ...client
    })
  },

  edit(clientId: string) {
    return axios.get(`${url}/${clientId}/edit`)
  },

  update(client: any) {
    return axios.put(`${url}/${client.id}`, {
      ...client
    })
  },

  destroy(clientId: string) {
    return axios.delete(`${url}/${clientId}`)
  }
}
