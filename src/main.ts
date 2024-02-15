import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import axios from 'axios'
import Cookies from 'js-cookie'
import Toast from 'vue-toastification';
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { useAuthStore } from './stores'
import { decodeJWT } from './utils'
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

loadFonts()

export const pinia = createPinia()

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

// If token exists, attempt to load the user
const token = Cookies.get('token')
if (token) {
  useAuthStore(pinia).loggedIn = true
  const { UserId } = decodeJWT(token)
  await useAuthStore(pinia).loadUser(UserId)
}

createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(router)
  .use(Toast, { position: 'bottom-right' })
  .mount('#app')
