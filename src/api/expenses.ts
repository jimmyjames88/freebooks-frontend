import axios from 'axios'
import {
  _Collection, _DataTableFilters, _Expense, _ExpenseInputCreate, _ExpenseInputUpdate
} from '@jimmyjames88/freebooks-types'

const url = `${import.meta.env.VITE_API}/expenses`

const handleError = (error: any) => {
  console.error('Expenses API Error:', error)
  throw error
}

interface _ExpensesFilters extends _DataTableFilters {
  unattached?: boolean
}

export default {
  async index(params?: _ExpensesFilters) { 
    try {
      return await axios.get(`${url}`, { params })
    } catch (error) {
      handleError(error)
    }
  },
  async show(id: number) {
    try {
      return await axios.get(`${url}/${id}`)
    } catch (error) {
      handleError(error)
    }
  },
  async store(expense: _ExpenseInputCreate) {
    try {
      return await axios.post(`${url}`, expense)
    } catch (error) {
      handleError(error)
    }
  },
  async update(expense: _ExpenseInputUpdate) {
    try {
      return await axios.put(`${url}/${expense.id}`, expense)
    } catch (error) {
      handleError(error)
    }
  },
  async destroy(id: number) {
    try {
      return await axios.delete(`${url}/${id}`)
    } catch (error) {
      handleError(error)
    }
  }
}
