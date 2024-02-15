import axios, { AxiosResponse } from 'axios'
import { _Collection, _DataTableFilters, _Invoice } from '@jimmyjames88/freebooks-types'
import { Invoice } from '@/classes'

const URL = `${import.meta.env.VITE_API}/invoices`

interface _InvoiceFilters extends _DataTableFilters {
  ClientId?: number
}

export default {
  async index(filters: _InvoiceFilters): Promise<_Collection<Invoice>>{
    const response = await axios.get(`${URL}/`, { params: filters })
    return {
      items: response.data.items.map((invoice: Invoice) => new Invoice(invoice)),
      total: response.data.total
    }
  },

  async store(invoice: Invoice): Promise<Invoice> {
    const response = await axios.post(`${URL}`, invoice)
    return new Invoice(response.data)
  },

  async update(invoice: Invoice): Promise<Invoice> {
    const response = await axios.put(`${URL}/${invoice.id}`, invoice)
    return new Invoice(response.data)
  },
  
  async show(InvoiceId: number): Promise<Invoice> {
    const response = await axios.get(`${URL}/${InvoiceId}`)
    return new Invoice(response.data)
  },

  async destroy(InvoiceId: number): Promise<AxiosResponse> {
    return axios.delete(`${URL}/${InvoiceId}`)
  },

  async latestRefNo(): Promise<string> {
    const response = await axios.get(`${URL}/latest-ref-no`)
    return response.data.refNo
  }
}
