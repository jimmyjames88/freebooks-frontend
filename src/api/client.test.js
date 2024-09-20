// tests for client.ts
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, it, expect, beforeEach } from 'vitest'
import API from '../api'
import Client from '../classes/Client'

const host = import.meta.env.VITE_API

describe('client.ts', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  // test index method
  it('should return an array of Client objects', async () => {
    mock.onGet(`${host}/clients/`).reply(200, {
      items: [
        { id: 1, name: 'client1' },
        { id: 2, name: 'client2' }
      ],
      total: 2
    })
    const { items, total } = await API.clients.index()

    // assert that clients is an array with 2 Client class objects
    expect(total).toBe(2)
    expect(items).toBeInstanceOf(Array)
    expect(items[0]).toBeInstanceOf(Client)
    expect(items[0].name).toBe('client1')
  })

  // test list method
  it('should return an array of client ids and names', async () => {
    mock.onGet(`${host}/clients/list`).reply(200, {
      items: [
        { id: 1, name: 'client1' },
        { id: 2, name: 'client2' }
      ],
      total: 2
    })
    const { items, total } = await API.clients.list()

    expect(total).toBe(2)
    expect(items).toBeInstanceOf(Array)
    expect(items[0]).toStrictEqual(
      { id: 1, name: 'client1' },
      { id: 2, name: 'client2' }
    )
    expect(items[0].name).toBe('client1')
  })

  // test show method
  it('should return a single Client object', async () => {
    mock.onGet(`${host}/clients/1`).reply(200, { id: 1, name: 'client1' })
    const client = await API.clients.show(1)

    // assert that client is an instance of Client class
    expect(client).toBeInstanceOf(Client)
    expect(client.name).toBe('client1')
  })

  // test store
  it('should return a Client object', async () => {
    mock.onPost(`${host}/clients`).reply(200, { id: 1, name: 'client1' })
    const client = await API.clients.store({ name: 'client1' })

    // assert that client is an instance of Client class
    expect(client).toBeInstanceOf(Client)
    expect(client.name).toBe('client1')
  })
  
  // test update
  it('should return a Client object', async () => {
    mock.onPut(`${host}/clients/1`).reply(200, { id: 1, name: 'client1' })
    const client = await API.clients.update({ id: 1, name: 'client1' })

    // assert that client is an instance of Client class
    expect(client).toBeInstanceOf(Client)
    expect(client.name).toBe('client1')
  })

  // test destroy
  it('should return a status of 204', async () => {
    mock.onDelete(`${host}/clients/1`).reply(204)
    const response = await API.clients.destroy(1)

    expect(response.status).toBe(204)
  })
})