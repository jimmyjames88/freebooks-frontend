import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import Cookies from 'js-cookie'
import Toast from 'vue-toastification'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import { useAuthStore } from './stores'
import { decodeJWT, axiosInterceptors } from './utils'
import 'vue-toastification/dist/index.css'

// Create the pinia store
export const pinia = createPinia()

// Load webfonts
loadFonts()

// Create the app
createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(router)
  .use(Toast, { position: 'bottom-right' })
  .mount('#app')

// Set up axios interceptors
axiosInterceptors()

// If token exists, attempt to load the user
const token = Cookies.get('token')
if (token) {
  useAuthStore(pinia).loggedIn = true
  const { UserId } = decodeJWT(token)
  await useAuthStore(pinia).loadUser(UserId)
}
