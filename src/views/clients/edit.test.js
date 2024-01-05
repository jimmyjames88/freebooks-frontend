import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createVuetify } from "vuetify";
import { vi } from 'vitest'
import Edit from './Edit.vue'
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
  }
}

vi.spyOn(API.clients, 'index').mockResolvedValue({ data: mockClientResponse })
vi.spyOn(API.clients, 'update').mockResolvedValue({ data: mockClientResponse })

describe('Edit.vue', () => {
  const vuetify = createVuetify()
  const $route = { params: { clientId: 1 }}
  let wrapper
  const $router = {
    go: vi.fn()
  }

  beforeEach(() => { 
    wrapper = mount(Edit, {
      global: {
        plugins: [vuetify],
        mocks: { $route, $router }
      },
    })

  })

  it('Renders properly', async () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  
  it('form submits the correct data', async () => {
    const formData = {
      name: 'Test Name',
      email: 'test@example.com',
      phone: '1234567890',
      website: 'https://example.com',
      line1: 'Address Line 1',
      line2: 'Address Line 2',
      city: 'Calgary',
      state: 'Alberta',
      postal: 'T1T1T1',
      country: 'Canada'
    }

    // fill out form
    const name = wrapper.find('input[name=name]').setValue(formData.name)
    const email = wrapper.find('input[name=email]').setValue(formData.email)
    const phone = wrapper.find('input[name=phone]').setValue(formData.phone)
    const website = wrapper.find('input[name=website]').setValue(formData.website)

    // click next button
    const next = wrapper.findAll('button').at(1).trigger('click')
    await nextTick()

    const line1 = wrapper.find('input[name=line1]').setValue(formData.line1)
    const line2 = wrapper.find('input[name=line2]').setValue(formData.line2)
    const city = wrapper.find('input[name=city]').setValue(formData.city)
    const state = wrapper.find('input[name=state]').setValue(formData.state)
    const postal = wrapper.find('input[name=postal]').setValue(formData.postal)
    const country = wrapper.find('input[name=country]').setValue(formData.country)
  
    // submit form
    wrapper.find('form').trigger('submit')

    // verify form submission and data
    expect(wrapper.emitted().submit).toBeTruthy()
  })

  it('goes back to last page when cancel button is clicked', async () => {
    const spy = vi.spyOn($router, 'go')

    // click cancel button
    const cancel = wrapper.findAll('button').at(0).trigger('click')
    await nextTick()
    
    expect(spy).toHaveBeenCalled()
  })

  it('goes to next step when next button is clicked', async () => {
    // click next button
    const next = wrapper.findAll('button').at(1).trigger('click')
    await nextTick()

    expect(wrapper.vm.step).toBe(2)
  })

  it('goes to previous step when previous button is clicked', async () => {
    // start on second step
    await wrapper.setData({ step: 2 })

    // click previous button
    const previous = wrapper.findAll('button').at(2).trigger('click')
    await nextTick()
    
    expect(wrapper.vm.step).toBe(1)
  })
})
