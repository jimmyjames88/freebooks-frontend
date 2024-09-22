import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, it, expect, beforeEach } from 'vitest'
import API from '.'
import Invoice from '@/classes/Invoice'
import Client from '@/classes/Client'
import { _InvoiceStatus } from '@jimmyjames88/freebooks-types'

const host = `${import.meta.env.VITE_API}/invoices`

describe('invoices.ts', () => {
  let mock: MockAdapter

  beforeEach(() => {
    // Create a new instance of MockAdapter for each test
    mock = new MockAdapter(axios)
  })

  // test index method
  it('should return an array of invoices', async () => {
    mock.onGet(`${host}/`).reply(200, {
      items: [
        { id: 1, Client: { id: 1 }},
        { id: 2, Client: { id: 1 }}
      ],
      total: 2
    })
    const { items, total } = await API.invoices.index()

    // assert that invoices is an array with 2 objects
    expect(total).toBe(2)
    expect(items).toBeInstanceOf(Array)
    expect(items[0]).toBeInstanceOf(Invoice)
    expect(items[0].Client).toBeInstanceOf(Client)
    expect(items[0].Client.id).toBe(1)
  })

  // test store method
  it('should create a new invoice', async () => {
    mock.onPost(`${host}/`).reply(200, {
      id: 1,
      name: 'invoice1'
    })
    const invoice = await API.invoices.store({
      refNo: '123456',
      issueDate: new Date(),
      dueDate: new Date(),
      status: _InvoiceStatus.DRAFT,
      notes: 'Thanks for your business',
      LineItems: [],
      ClientId: 1,
      UserId: 1,  
    })

    expect(invoice).toBeInstanceOf(Object)
  })

  // test show method
  it('should return a single invoice object', async () => {
    mock.onGet(`${host}/1`).reply(200, { id: 1, name: 'invoice1' })
    const invoice = await API.invoices.show(1)

    expect(invoice).toBeInstanceOf(Invoice)
  })

  // test update method
  it('should update an invoice', async () => {
    mock.onPut(`${host}/1`).reply(200, { id: 1, name: 'invoice1' })
    const invoice = await API.invoices.update({
      id: 1,
      refNo: '123456',
      issueDate: new Date(),
      dueDate: new Date(),
      status: _InvoiceStatus.DRAFT,
      notes: 'Thanks for your business',
      LineItems: [],
      ClientId: 1,
      UserId: 1
    })

    expect(invoice).toBeInstanceOf(Invoice)
  })

  // test destroy method
  it('should delete an invoice', async () => {
    mock.onDelete(`${host}/1`).reply(200)
    const response = await API.invoices.destroy(1)

    // expect status 200
    expect(response.status).toBe(200)
  })

  // test latestRefNo method
  it('should return the latest reference number', async () => {
    mock.onGet(`${host}/latest-ref-no`).reply(200, '123')
    const refNo = await API.invoices.latestRefNo()

    expect(refNo).toBe(123)
  })

})