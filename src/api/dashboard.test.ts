import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, it, expect, beforeEach } from 'vitest'
import API from '../api'

const host = `${import.meta.env.VITE_API}/dashboard`

describe('dashboard.ts', () => {
  let mock: MockAdapter

  beforeEach(() => {
    // Create a new instance of MockAdapter for each test
    mock = new MockAdapter(axios)
  })

  // test outstandingRevenue method
  it('should return the outstanding revenue', async () => {
    mock.onGet(`${host}/outstanding-revenue`).reply(200, {
      total: 1000
    })
    const total = await API.dashboard.outstandingRevenue()

    // assert that total is 1000
    expect(total).toBe(1000)
  })

})