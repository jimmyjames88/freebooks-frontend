import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, it, expect, beforeEach } from 'vitest'
import API from '../api'
import { _Tax, _TaxInputUpdate, _TaxType } from '@jimmyjames88/freebooks-types'

const host = `${import.meta.env.VITE_API}/taxes`

describe('taxes.ts', () => {
  let mock: MockAdapter

  beforeEach(() => {
    // Create a new instance of MockAdapter for each test
    mock = new MockAdapter(axios)
  })

  // test index method
  it('should return an array of taxes', async () => {
    mock.onGet(`${host}/`).reply(200, {
      items: [
        {
          id: 1,
          UserId: 1,
          name: 'GST',
          rate: 5,
          type: 'percentage',
          default: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          UserId: 1,
          name: 'PST',
          rate: 7,
          type: 'percentage',
          default: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      total: 2
    })
    const { items, total } = await API.taxes.index()

    // assert that taxes is an array with 2 objects
    expect(total).toBe(2)
    expect(items[0].name).toBe('GST')
  })

  // test show method
  it('should return a tax', async () => {
    mock.onGet(`${host}/1`).reply(200, {
      id: 1,
      UserId: 1,
      name: 'GST',
      rate: 5,
      type: 'percentage',
      default: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const tax = await API.taxes.show(1)
    expect(tax.name).toBe('GST')
  })

  // test create method
  it('should create a tax', async () => {
    const tax: Omit<_Tax, 'id' | 'createdAt' | 'updatedAt'> = {
      UserId: 1,
      name: 'GST',
      rate: 5,
      type: _TaxType.PERCENTAGE,
      default: true
    }

    mock.onPost(`${host}/`).reply(201, {
      id: 1,
      UserId: 1,
      name: 'GST',
      rate: 5,
      type: 'percentage',
      default: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const newTax = await API.taxes.store(tax)
    expect(newTax.name).toBe('GST')
  })

  // test update method
  it('should update a tax', async () => {
    const tax: _TaxInputUpdate = {
      id: 1,
      name: 'GST',
      rate: 5,
      type: _TaxType.PERCENTAGE,
      default: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    mock.onPut(`${host}/1`).reply(200, {
      id: 1,
      UserId: 1,
      name: 'GST',
      rate: 5,
      type: _TaxType.PERCENTAGE,
      default: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const updatedTax = await API.taxes.update(tax)
    expect(updatedTax.name).toBe('GST')
  })

  // test destroy method
  it('should delete a tax', async () => {
    mock.onDelete(`${host}/1`).reply(204)
    const response = await API.taxes.destroy(1)

    // assert that the delete request was successful
    expect(response.status).toBe(204)
  })

})