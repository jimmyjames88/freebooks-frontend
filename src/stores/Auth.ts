import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import API from '@/api'
import { Profile, User } from '@/classes'
import { _UserInputCreate } from '@jimmyjames88/freebooks-types'
interface _State {
  loggedIn: boolean
  user: User
}

const useAuthStore = defineStore('auth', {
  state: (): _State => ({
    loggedIn: false,
    user: new User({
      email: '',
      name: '',
      Profile: new Profile({
        displayName: '',
        displayEmail: '',
        phone: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          postal: '',
          country: ''
        }
      })
    })
  }),
  actions: {
    // Is this necessary? - todo (probably not)
    
    async loadUser(UserId: number) {
      const response = await API.users.show(UserId)
      this.user = new User(response?.data)
    },
    async login(email: string, password: string) {
      try {
        const response = await API.auth.login(email, password)
        if (response?.status === 200) {
          const { token, refreshToken, user } = response.data
          Cookies.set('token', token)
          Cookies.set('refreshToken', refreshToken)
          this.loggedIn = true
          this.user = user
          return true
        }
      } catch {
        return false
      }
      return false
    },

    async logout() {
      Cookies.remove('token')
      Cookies.remove('refreshToken')
      this.loggedIn = false
      return true
    },

    async register(user: _UserInputCreate) {
      try {
        await API.auth.register(user)
        return true
      } catch {
        return false
      }
    },

    async checkEmail(email: string) {
      try {
        const response = await API.auth.checkEmail(email)
        if (response.status === 200) {
          const { exists } = response.data
          return exists
        }
      } catch {
        return false
      }
      return false
    }
  }
})

export default useAuthStore