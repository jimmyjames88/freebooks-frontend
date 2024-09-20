import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, it, expect, beforeEach } from 'vitest'
import API from '.'
import Payment from '@/classes/Payment'

const host = `${import.meta.env.VITE_API}/payments`

describe('payments.ts', () => {
  let mock: MockAdapter

  beforeEach(() => {
    // Create a new instance of MockAdapter for each test
    mock = new MockAdapter(axios)
  })

  // test index method
  it('should return an array of payments', async () => {
    mock.onGet(`${host}/`).reply(200, {
      items: [
        { id: 1, ClientId: 1 },
        { id: 2, ClientId: 1 }
      ],
      total: 2
    })
    const { items, total } = await API.payments.index()

    // assert that payments is an array with 2 objects
    expect(total).toBe(2)
    expect(items).toBeInstanceOf(Array)
    expect(items[0]).toBeInstanceOf(Payment)
    expect(items[0].ClientId).toBe(1)
  })

  // test show method
  it('should return a single payment object', async () => {
    mock.onGet(`${host}/1`).reply(200, { id: 1, name: 'payment1' })
    const payment = await API.payments.show(1)

    expect(payment).toBeInstanceOf(Payment)
  })

  // test store method
  it('should create a new payment', async () => {
    const data = {
      UserId: 1,
      paymentTypeId: 2,
      date: new Date(),
      description: 'Deposit',
      amount: 12.34
    }
    mock.onPost(`${host}/`).reply(200, { ...data, id: 1 })
    const payment = await API.payments.store(data)

    expect(payment).toBeInstanceOf(Payment)
  })

  // test update method
  it('should update a payment', async () => {
    const data = {
      UserId: 1,
      paymentTypeId: 2,
      date: new Date(),
      description: 'Deposit',
      amount: 12.34
    }
    
    mock.onPut(`${host}/1`).reply(200, { ...data, id: 1 })
    const payment = await API.payments.update({ ...data, id: 1 })

    expect(payment).toBeInstanceOf(Payment)
  })

  // test destroy method
  it('should delete a payment', async () => {
    mock.onDelete(`${host}/1`).reply(200, { id: 1, name: 'payment1' })
    const response = await API.payments.destroy(1)
    expect(response.status).toBe(200)
  })

  // test types method
  it('should return an array of payment types', async () => {
    mock.onGet(`${host}/types`).reply(200, {
      items: [
        { id: 1, name: 'Cash' },
        { id: 2, name: 'Credit Card' }
      ],
      total: 2
    })
    const { items, total } = await API.payments.types()

    expect(total).toBe(2)
    expect(items).toBeInstanceOf(Array)
    expect(items[0].name).toBe('Cash')
  })

})