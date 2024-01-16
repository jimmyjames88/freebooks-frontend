import axios from 'axios'
import { _Tax } from '@jimmyjames88/freebooks-types'

const url = `${import.meta.env.VITE_API}/taxes`

export default {
  index() { return axios.get(`${url}`)  },
  show(taxId: number) { 
    return axios.get(`${url}/${taxId}`)
  },
  store(tax: _Tax) { return axios.post(`${url}`, tax) },
  update(tax: _Tax) { return axios.put(`${url}/${tax.id}`, tax) },
  destroy(taxId: number) { return axios.delete(`${url}/${taxId}`) },
}
