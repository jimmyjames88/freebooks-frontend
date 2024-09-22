import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, it, expect, beforeEach } from 'vitest'
import API from '.'
import { User } from '@/classes'

const host = import.meta.env.VITE_AUTH_API

describe('auth.ts', () => {
  let mock: MockAdapter

  beforeEach(() => {
    // Create a new instance of MockAdapter for each test
    mock = new MockAdapter(axios)
  })

  // Test login method
  it('login method uses the correct endpoint and receives a status of 200', async () => {
    const url = `${host}/auth/login`
    mock.onPost(url).reply(200, { status: 200 })

    const response = await API.auth.login('test', 'test')
    expect(response.status).toBe(200)
    expect(mock.history.post.length).toBe(1)
    expect(mock.history.post[0].url).toBe(url)
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      email: 'test',
      password: 'test'
    })
  })

  // Test checkEmail method
  it('checkEmail method uses the correct endpoint and receives a status of 200', async () => {
    const url = `${host}/auth/check-email`
    mock.onPost(url).reply(200, { status: 200 })
  
    const response = await API.auth.checkEmail('me@james-allen.ca')
  
    expect(response.status).toBe(200)
    expect(mock.history.post.length).toBe(1)
    expect(mock.history.post[0].url).toBe(url)
    expect(JSON.parse(mock.history.post[0].data)).toEqual({ email: 'me@james-allen.ca' })
  })

  // Test register method handles successful response
  it('register method handles successful response', async () => {
    const url = `${host}/auth/register`
    const user = {
      id: 1,
      email: 'james@yahoo.com',
      password: 'password',
      name: 'Jimbo'
    }
    mock.onPost(url).reply(200, new User(user))

    const newUser = await API.auth.register(user)
    expect(newUser).toBeInstanceOf(User)
    expect(newUser.id).toBe(1)
  })
})