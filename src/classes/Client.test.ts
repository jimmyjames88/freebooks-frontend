
import { describe, it, expect } from 'vitest'
import Client from './Client'
import { _InvoiceStatus } from '@jimmyjames88/freebooks-types'
import { Address } from './'

describe('Client Class', () => {
  it('should create an instance of Client with required properties', () => {
    const client = new Client({
      UserId: 1,
      phone: '555-555-5555',
      website: 'http://example.com',
      address: new Address({
        line1: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postal: '62701'
      }),
      name: 'John Doe',
      email: 'james@yahoo.com'
    })

    expect(client.name).toBe('John Doe')
    expect(client.email).toBe('james@yahoo.com')
    expect(client.Invoices).toEqual([])
  })
})