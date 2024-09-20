import axios from 'axios'
import { _Client, _Collection, _DataTableFilters } from '@jimmyjames88/freebooks-types'
import { Client } from '@/classes'

const URL = `${import.meta.env.VITE_API}/clients`

export default {
  async index(filters: _DataTableFilters): Promise<_Collection<Client>> {
    const response = await axios.get(`${URL}/`, { params: filters })
    return {
      items: response.data.items.map((client: Client) => new Client(client)),
      total: response.data.total
    }
  },

  async list(): Promise<_Collection<{ id: number, name: string }>> {
    const response = await axios.get(`${URL}/list`)
    const { items, total } = response.data
    return { items, total }
  },

  async show(ClientId: number, options?: any): Promise<Client> {
    const response = await axios.get(`${URL}/${ClientId}`, { params: options })
    return new Client(response.data)
  },

  async store(client: Omit<Client, 'id'>): Promise<Client> {
    const response = await axios.post(`${URL}`, client)
    return new Client(response.data)
  },

  async update(client: _Client): Promise<Client> {
    const response = await axios.put(`${URL}/${client.id}`, client)
    return new Client(response.data)
  },

  async destroy(ClientId: number): Promise<void> {
    return axios.delete(`${URL}/${ClientId}`)
  }
}
