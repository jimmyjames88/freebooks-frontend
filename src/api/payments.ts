import axios from 'axios'
import { _Collection, _PaymentInputCreate, _PaymentInputUpdate, _PaymentType } from '@jimmyjames88/freebooks-types'

const url = `${import.meta.env.VITE_API}/payments`

const handleError = (error: any) => {
  console.error('Payments API Error:', error)
  throw error
}

export default {
  async index() {
    try {
      return await axios.get(`${url}/`)
    } catch (error) {
      handleError(error)
    }
  },
  async show(PaymentId: number) {
    try {
      return await axios.get(`${url}/${PaymentId}`)
    } catch (error) {
      handleError(error)
    }
  },
  async store(payment: _PaymentInputCreate) {
    try {
      return await axios.post(`${url}/`, payment)
    } catch (error) {
      handleError(error)
    }
  },
  async update(payment: _PaymentInputUpdate) {
    try {
      return await axios.put(`${url}/${payment.id}`, payment)
    } catch (error) {
      handleError(error)
    }
  },
  async destroy(PaymentId: number) {
    try {
      return await axios.delete(`${url}/${PaymentId}`)
    } catch (error) {
      handleError(error)
    }
  },
  async types() {
    try {
      return await axios.get(`${url}/types`)
    } catch (error) {
      handleError(error)
    }
  }
}
