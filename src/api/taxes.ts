import axios from 'axios'
import { _Collection, _Tax, _TaxInputCreate, _TaxInputUpdate } from '@jimmyjames88/freebooks-types'

const url = `${import.meta.env.VITE_API}/taxes`

export default {
  async index(): Promise<_Collection<_Tax>> {
    const response = await axios.get(`${url}/`) 
    return response.data
  },
  async show(taxId: number): Promise<_Tax> { 
    const response = await axios.get(`${url}/${taxId}`)
    return response.data
  },
  async store(tax: _TaxInputCreate): Promise<_Tax> { 
    const response = await axios.post(`${url}/`, tax)
    return response.data
  },
  async update(tax: _TaxInputUpdate): Promise<_Tax> { 
    const response = await axios.put(`${url}/${tax.id}`, tax)
    return response.data
  },
  async destroy(taxId: number) { 
    return axios.delete(`${url}/${taxId}`)
  },
}
