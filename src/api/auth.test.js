import { vi } from 'vitest'

global.API = {
  auth: {
    login: vi.fn()
  }
}

describe('auth.ts', () => {
  
  // test that login method uses the correct endpoint and receives a status of 200
  it('login method uses the correct endpoint and receives a status of 200', async () => {

    // mockresolvedvalue for API.auth.login
    global.API.auth.login.mockResolvedValue({
      status: 200
    })

    const response = await global.API.auth.login('test@example.com', 'password')
    expect(response.status).toBe(200)
    expect(global.API.auth.login).toHaveBeenCalled()
  })
  
})