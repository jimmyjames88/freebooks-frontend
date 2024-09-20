
import { describe, it, expect } from 'vitest'
import Client from './Client'
import { _InvoiceStatus } from '@jimmyjames88/freebooks-types'
import Invoice from './Invoice'

describe('Client Class', () => {
  it('should create an instance of Client with required properties', () => {
    const client = new Client({
      name: 'John Doe',
      email: 'james@yahoo.com'
    })

    expect(client.name).toBe('John Doe')
    expect(client.email).toBe('james@yahoo.com')
    expect(client.Invoices).toEqual([])
  })
})