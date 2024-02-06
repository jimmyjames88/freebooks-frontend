import axios from 'axios'
import { _Collection, _Invoice } from '@jimmyjames88/freebooks-types'
import Invoice from '@/classes/Invoice'

const URL = `${import.meta.env.VITE_API}/invoices`

interface _InvoiceFilters {
  groupBy?: any[]
  itemsPerPage?: number
  page?: number
  search?: string
  sortBy?: any[]
}

export default {
  async index(filters: _InvoiceFilters): Promise<_Collection<Invoice>>{
    const response = await axios.get(`${URL}/`, { params: filters })
    return {
      items: response.data.items.map((invoice: _Invoice) => new Invoice(invoice)),
      total: response.data.total
    }
  },

  async store(invoice: _Invoice): Promise<Invoice> {
    const response = await axios.post(`${URL}`, invoice)
    return new Invoice(response.data)
  },

  async update(invoice: Partial<_Invoice>): Promise<Invoice> {
    const response = await axios.put(`${URL}/${invoice.id}`, invoice)
    return new Invoice(response.data)
  },
  
  async show(invoiceId: string | number): Promise<Invoice> {
    const response = await axios.get(`${URL}/${invoiceId}`)
    return new Invoice(response.data)
  },

  async destroy(invoiceId: string | number): Promise<void> {
    await axios.delete(`${URL}/${invoiceId}`)
    return
  },

  async latestRefNo(): Promise<string> {
    const response = await axios.get(`${URL}/latest-ref-no`)
    return response.data.refNo
  }
}
