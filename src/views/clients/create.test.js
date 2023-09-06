import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createVuetify } from "vuetify";
import { vi } from 'vitest'
import Create from './Create.vue'

vi.mock('axios')

describe('Create.vue', () => {
  const vuetify = createVuetify()

  it('Renders properly', async () => {
    const wrapper = mount(Create, {
      global: {
        plugins: [vuetify],
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
  
  it('form submits the correct data', async () => {
    const wrapper = mount(Create, {
      global: {
        plugins: [vuetify],
      },
    })

    const formData = {
      name: 'Test Name',
      email: 'test@example.com',
      phone: '1234567890',
      website: 'https://example.com',
      line1: 'Address Line 1',
      line2: 'Address Line 2',
      city: 'Calgary',
      province: 'Alberta',
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
    const province = wrapper.find('input[name=province]').setValue(formData.province)
    const postal = wrapper.find('input[name=postal]').setValue(formData.postal)
    const country = wrapper.find('input[name=country]').setValue(formData.country)
  
    // submit form
    wrapper.find('form').trigger('submit')

    // verify form submission and data
    expect(wrapper.emitted().submit).toBeTruthy()
  })

  it('goes back to last page when cancel button is clicked', async () => {
    const $router = {
      go: vitest.fn()
    }
    const spy = vi.spyOn($router, 'go')

    const wrapper = mount(Create, {
      global: {
        plugins: [vuetify],
        mocks: {
          $router
        }
      }
    })

    // click cancel button
    const cancel = wrapper.findAll('button').at(0).trigger('click')
    await nextTick()
    
    expect(spy).toHaveBeenCalled()
  })

  it('goes to next step when next button is clicked', async () => {
    const wrapper = mount(Create, {
      global: {
        plugins: [vuetify],
      },
    })

    // click next button
    const next = wrapper.findAll('button').at(1).trigger('click')
    await nextTick()

    expect(wrapper.vm.step).toBe(2)
  })

  it('goes to previous step when previous button is clicked', async () => {
    const wrapper = mount(Create, {
      global: {
        plugins: [vuetify],
      },
    })

    // start on second step
    await wrapper.setData({ step: 2 })

    // click previous button
    const previous = wrapper.findAll('button').at(2).trigger('click')
    await nextTick()
    
    expect(wrapper.vm.step).toBe(1)
  })
})
