import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, it, expect, beforeEach } from 'vitest'
import API from '../api'
import Expense from '@/classes/Expense'

const host = `${import.meta.env.VITE_API}/expenses`
const testExpenses = [
  {
    id: 5,
    UserId: 1,
    InvoiceId: 2,
    paymentTypeId: 3,
    date: new Date(),
    description: 'Vitest expenses',
    subtotal: 49.99,
    Taxes: [{
      name: 'GST',
      rate: 5,
      type: 'percentage'
    }]
  },
  {
    id: 3,
    UserId: 4,
    InvoiceId: 5,
    paymentTypeId: 6,
    date: new Date(),
    description: 'Gas',
    subtotal: 96.50,
    Taxes: [{
      name: 'GST',
      rate: 5,
      type: 'percentage'
    }]
  }
]

describe('expenses.ts', () => {
  let mock

  beforeEach(() => {
    // Create a new instance of MockAdapter for each test
    mock = new MockAdapter(axios)
  })

  // Test index method
  it('should return an array of expenses', async () => {
    mock.onGet(host).reply(200, {
      items: testExpenses,
      total: 2
    })
    const { items, total } = await API.expenses.index()
    expect(total).toBe(2)
    expect(items[0].id).toBe(5)
    expect(items[0].UserId).toBe(1)
  })

  // Test store method
  it('should create a new expense', async () => {
    const data = {
      UserId: 1,
      InvoiceId: 4,
      paymentTypeId: 3,
      date: new Date().toString(),
      description: 'Vitest expenses',
      subtotal: 49.99,
      Taxes: [{
        name: 'GST',
        rate: 5,
        type: 'percentage'
      }]
    }
    mock.onPost(host).reply(201, data)
    const expense = await API.expenses.store(data)
    expect(expense).toEqual(new Expense(data))
  })

})