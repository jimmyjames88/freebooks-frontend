import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import API from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedIn: false
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await API.auth.login(email, password)
        if (response.status === 200) {
          const { token } = response.data
          Cookies.set('token', token)
          this.loggedIn = true
          return true
        }
      } catch {
        return false
      }
      return false
    },

    async logout() {
      Cookies.remove('token')
      this.loggedIn = false
      return true
    }
  }
})