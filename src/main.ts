import Vue, { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import axios from 'axios'
import Cookies from 'js-cookie'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { useAuthStore } from './stores/Auth'

loadFonts()

export const pinia = createPinia()

if (Cookies.get('token')) useAuthStore(pinia).loggedIn = true

axios.interceptors.request.use(
  config => {
    const token = Cookies.get('token')
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  err => Promise.reject(err)
)

axios.interceptors.response.use(
  response => response,
  async err => {
    const token = Cookies.get('token')
    if (token && err.response?.status === 401) {
      useAuthStore().logout()
      router.push({ name: 'Auth/Login', query: { ref: location.href }})
    }
    return Promise.reject(err)
  }
)

createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(router)
  .mount('#app')
