import axios from 'axios'

const url = `${import.meta.env.VITE_API}/invoices`

export default {
  index(filters: any) {
    return axios.get(`${url}/`, {
      params: {
        ...filters
      }
    })
  },

  store(invoice: any) {
    return axios.post(`${url}`, {
      ...invoice
    })
  },

  update(invoice: any) {
    return axios.put(`${url}/${invoice.id}`, {
      ...invoice
    })
  },
  
  show(invoiceId: string) {
    return axios.get(`${url}/${invoiceId}`)
  },

  latestRefNo() {
    return axios.get(`${url}/latest-ref-no`)
  }
}
