// import { nextTick } from 'vue'
// import { mount, shallowMount } from '@vue/test-utils'
// import { createVuetify } from "vuetify";
// import { expect, vi } from 'vitest'
// import Index from './Index.vue'
// import API from '@/api'

// // Mocks
// vi.mock('axios')
// vi.mock('@/api', () => ({
//   default: { 
//     clients: {
//       index: vi.fn()
//     } 
//   } 
// }))

// describe('Index.vue', () => {
//   const vuetify = createVuetify()

//   it('Renders properly', async () => {
//     const wrapper = mount(Index, {
//       global: {
//         plugins: [vuetify]
//       },
//     })
//     expect(wrapper.html()).toMatchSnapshot()
//   })
  
//   it('calls the clients endpoint when mounted', async () => {
//     const wrapper = mount(Index, {
//       global: {
//         plugins: [vuetify],
//       }
//     })

//     global.API = {
//       clients: {
//         index: vi.fn()
//       }
//     }
//     await nextTick()

//     expect(API.get).toHaveBeenCalledWith('/clients')
//   })


// })
