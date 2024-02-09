import axios from 'axios'
import { _Expense } from '@jimmyjames88/freebooks-types'

const url = `${import.meta.env.VITE_API}/expenses`

export default {
  index(params: any) { 
    return axios.get(`${url}`, { params })
  },
  store(expense: Partial<_Expense>) {
    return axios.post(`${url}`, expense)
  }
}
