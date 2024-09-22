import axios from 'axios'
import {
  _Client, _ClientInputCreate, _ClientInputUpdate, _Collection, _DataTableFilters
} from '@jimmyjames88/freebooks-types'

const URL = `${import.meta.env.VITE_API}/clients`

const handleError = (error: any) => {
  console.error('Clients API Error:', error)
  throw error
}

export default {
  async index(filters?: _DataTableFilters) {
    try {
      return await axios.get(`${URL}/`, { params: filters })
    } catch (error) {
      handleError(error)
    }
  },

  async list() {
    try {
      return await axios.get(`${URL}/list`)
    } catch (error) {
      handleError(error)
    }
  },

  async show(ClientId: number, options?: any) {
    try {
      return await axios.get(`${URL}/${ClientId}`, { params: options })
    } catch (error) {
      handleError(error)
    }
  },

  async store(client: _ClientInputCreate) {
    try {
      return await axios.post(`${URL}`, client)
    } catch (error) {
      handleError(error)
    }
  },

  async update(client: _ClientInputUpdate) {
    try {
      return await axios.put(`${URL}/${client.id}`, client)
    } catch (error) {
      handleError(error)
    }
  },

  async destroy(ClientId: number) {
    try {
      return await axios.delete(`${URL}/${ClientId}`)
    } catch (error) {
      handleError(error)
    }
  }
}
