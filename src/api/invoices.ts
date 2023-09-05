import axios from 'axios'

const url = `${import.meta.env.VITE_API}/invoices`

export default {
  index() {
    return axios.get(`${url}/`)
  },
  store(invoice: any) {
    return axios.post(`${url}`, {
      ...invoice
    })
  },
  show(invoiceId: string) {
    return axios.get(`${url}/${invoiceId}`)
  }
}
