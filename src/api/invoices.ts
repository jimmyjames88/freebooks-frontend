import axios from 'axios'
import { _Invoice } from '@jimmyjames88/freebooks-types'

const url = `${import.meta.env.VITE_API}/invoices`

export default {
  index(filters: any) {
    return axios.get(`${url}/`, {
      params: {
        ...filters
      }
    })
  },

  store(invoice: _Invoice) {
    return axios.post(`${url}`, {
      ...invoice
    })
  },

  update(invoice: Partial<_Invoice>) {
    return axios.put(`${url}/${invoice.id}`, {
      ...invoice
    })
  },
  
  show(invoiceId: string | number) {
    return axios.get(`${url}/${invoiceId}`)
  },

  destroy(invoiceId: string | number) {
    return axios.delete(`${url}/${invoiceId}`)
  },

  latestRefNo() {
    return axios.get(`${url}/latest-ref-no`)
  }
}
