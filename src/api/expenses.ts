import axios from 'axios'
import { _Collection, _DataTableFilters } from '@jimmyjames88/freebooks-types'
import { Expense } from '@/classes'

const url = `${import.meta.env.VITE_API}/expenses`

export default {
  async index(params: _DataTableFilters): Promise<_Collection<Expense>> { 
    const response = await axios.get(`${url}`, { params })
    return {
      items: response.data.items.map((expense: Expense) => new Expense(expense)),
      total: response.data.total
    }
  },
  async store(expense: Partial<Expense>): Promise<Expense> {
    const response = await axios.post(`${url}`, expense)
    return new Expense(response.data)
  }
}
