import axios from 'axios'
import { _Collection, _Tax, _TaxInputCreate, _TaxInputUpdate } from '@jimmyjames88/freebooks-types'

const url = `${import.meta.env.VITE_API}/taxes`

const handleError = (error: any) => {
  console.error('Taxes API Error:', error)
  throw error
}

export default {
  async index() {
    try {
      return await axios.get(`${url}/`)
    } catch (error) {
      return handleError(error)
    }
  },
  async show(taxId: number) { 
    try {
      return await axios.get(`${url}/${taxId}`)
    } catch (error) {
      handleError(error)
    }
  },
  async store(tax: _TaxInputCreate) { 
    try {
      return await axios.post(`${url}/`, tax)
    } catch (error) {
      handleError(error)
    }
  },
  async update(tax: _TaxInputUpdate) { 
    try {
      return await axios.put(`${url}/${tax.id}`, tax)
    } catch (error) {
      handleError(error)
    }
  },
  async destroy(taxId: number) {
    try {
      return await axios.delete(`${url}/${taxId}`)
    } catch (error) {
      handleError(error)
    }
  },
}
