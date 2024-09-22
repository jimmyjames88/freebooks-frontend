import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, it, expect, beforeEach } from 'vitest'
import API from '.'
import User from '@/classes/User'

const host = `${import.meta.env.VITE_API}/users`

describe('user.ts', () => {
  let mock: MockAdapter

  beforeEach(() => {
    // Create a new instance of MockAdapter for each test
    mock = new MockAdapter(axios)
  })

  // test show
  it('should return a single user object', async () => {
    mock.onGet(`${host}/1`).reply(200, { id: 1, name: 'user1' })
    const user = await API.users.show(1)

    expect(user).toBeInstanceOf(User)
  })

  // test update method
  it('should update a user', async () => {
    mock.onPut(`${host}/1`).reply(200, { id: 1, name: 'user1' })
    const user = await API.users.update({
      id: 1, 
      name: 'user1',
      email: 'user@yahoo.com'
    })

    expect(user).toBeInstanceOf(User)
  })
})