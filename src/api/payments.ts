import axios from 'axios'
import { _Payment } from '@jimmyjames88/freebooks-types'

const url = `${import.meta.env.VITE_API}/payments`

export default {
  index() { return axios.get(`${url}`) },
  show(paymentId: number) { return axios.get(`${url}/${paymentId}`) },
  store(payment: Partial<_Payment>) { return axios.post(`${url}`, payment) },
  update(payment: _Payment) { return axios.put(`${url}/${payment.id}`, payment) },
  destroy(paymentId: number) { return axios.delete(`${url}/${paymentId}`) },
}
