import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import API from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedIn: false
  }),
  actions: {
    async login(email: string, password: string) {
      const response = await API.auth.login(email, password)
      const { token } = response.data
      Cookies.set('token', token)
      this.loggedIn = true
      return true
    },

    async logout() {
      Cookies.remove('token')
      this.loggedIn = false
      return true
    }
  }
})