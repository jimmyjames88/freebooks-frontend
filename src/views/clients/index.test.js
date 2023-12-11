import { nextTick } from 'vue'
import { mount, shallowMount } from '@vue/test-utils'
import { createVuetify } from "vuetify";
import { beforeEach, expect, vi } from 'vitest'
import Index from './Index.vue'
import API from '@/api'

// Mocks
vi.mock('axios')

const mockClientResponse = [{
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
  }
}]

vi.spyOn(API.clients, 'index').mockResolvedValue({ data: mockClientResponse })

describe('Index.vue', () => {
  const vuetify = createVuetify()
  let wrapper

  beforeEach(() => {
    wrapper = mount(Index, {
      global: {
        plugins: [vuetify],
        // mocks: { $route, $router }
      },
    })
  })

  it('Renders properly', async () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
