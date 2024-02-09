import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createVuetify } from "vuetify";
import { vi } from 'vitest'
import Show from './Show.vue'
import API from '@/api'

vi.mock('axios')

const mockClientResponse = {
  _id: 1,
  name: 'Test Name',
  email: 'test@example.com',
  phone: '1234567890',
  website: 'https://example.com',
  address: {
    line1: 'Address Line 1',
    line2: 'Address Line 2',
    city: 'Calgary',
    state: 'Alberta',
    postal: 'T1T1T1',
    country: 'Canada'
  },
  invoices: []
}

vi.spyOn(API.clients, 'show').mockResolvedValue({ data: mockClientResponse })

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

describe('Show.vue', () => {
  const vuetify = createVuetify()
  const $route = { params: { ClientId: 1 }}
  let wrapper
  const $router = {
    go: vi.fn()
  }

  beforeEach(() => { 
    wrapper = mount(Show, {
      global: {
        plugins: [vuetify],
        mocks: { $route, $router }
      },
    })

  })

  it('Renders properly', async () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
