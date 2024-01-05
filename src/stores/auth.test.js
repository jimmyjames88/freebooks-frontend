import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './auth'
import axios from 'axios'

vi.mock('axios')

describe('AuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should be defined', () => {
    const authStore = useAuthStore()
    expect(authStore).toBeDefined()
  })

  // test the login action
  it('should login', async () => {
    const authStore = useAuthStore()
    axios.post.mockResolvedValue({ status: 200, data: { token: '123' }})
    await authStore.login('test@example.com', 'helloworld')
    expect(authStore.loggedIn).toBe(true)
  })
})

