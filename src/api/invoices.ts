import axios from 'axios'
import {
  _Collection, _DataTableFilters, _Invoice, _InvoiceInputCreate, _InvoiceInputUpdate
} from '@jimmyjames88/freebooks-types'

const URL = `${import.meta.env.VITE_API}/invoices`

const handleError = (error: any) => {
  console.error('Invoices API Error:', error)
  throw error
}

interface _InvoiceFilters extends _DataTableFilters {
  ClientId?: number
}

export default {
  async index(filters?: _InvoiceFilters) {
    try {
      return await axios.get(`${URL}/`, { params: filters })
    } catch (error) {
      handleError(error)
    }
  },

  async store(invoice: _InvoiceInputCreate) {
    try {
      return await axios.post(`${URL}/`, invoice)
    } catch (error) {
      handleError(error)
    }
  },

  async update(invoice: _InvoiceInputUpdate) {
    try {
      return await axios.put(`${URL}/${invoice.id}`, invoice)
    } catch (error) {
      handleError(error)
    }
  },

  async updateStatus(ClientId: number, status: string) {
    try {
      return await axios.put(`${URL}/${ClientId}/status`, { status })
    } catch (error) {
      handleError(error)
    }
  },
  
  async show(InvoiceId: number) {
    try {
      return await axios.get(`${URL}/${InvoiceId}`)
    } catch (error) {
      handleError(error)
    }
  },

  async destroy(InvoiceId: number) {
    try {
      return await axios.delete(`${URL}/${InvoiceId}`)
    } catch (error) {
      handleError(error)
    }
  },

  async latestRefNo() {
    try {
      return await axios.get(`${URL}/latest-ref-no`)
    } catch (error) {
      handleError(error)
    }
  }
}
