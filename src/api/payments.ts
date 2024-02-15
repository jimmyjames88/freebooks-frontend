import axios from 'axios'
import { _Collection, _PaymentType } from '@jimmyjames88/freebooks-types'
import { Payment } from '@/classes'

const url = `${import.meta.env.VITE_API}/payments`

export default {
  async index(): Promise<_Collection<Payment>> {
    const response = await axios.get(`${url}`)
    return {
      items: response.data.items.map((payment: Payment) => new Payment(payment)),
      total: response.data.total
    }
  },
  async show(PaymentId: number): Promise<Payment> {
    const response = await axios.get(`${url}/${PaymentId}`)
    return new Payment(response.data)
  },
  async store(payment: Partial<Payment>): Promise<Payment> {
    const response = await axios.post(`${url}`, payment)
    return new Payment(response.data)
  },
  async update(payment: Payment): Promise<Payment> {
    const response = await axios.put(`${url}/${payment.id}`, payment)
    return new Payment(response.data)
  },
  async destroy(PaymentId: number): Promise<void> {
    axios.delete(`${url}/${PaymentId}`)
    return
  },
  async types(): Promise<_Collection<_PaymentType>> {
    const response = await axios.get(`${url}/types`)
    return {
      items: response.data.items,
      total: response.data.total
    }
  }
}
