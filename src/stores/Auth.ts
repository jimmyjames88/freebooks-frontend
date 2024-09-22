import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import API from '@/api'
import { Profile, User } from '@/classes'
import { _UserInputCreate } from '@jimmyjames88/freebooks-types'
interface _State {
  loggedIn: boolean
  user: Partial<User>
}

const useAuthStore = defineStore('auth', {
  state: (): _State => ({
    loggedIn: false,
    user: {
      id: undefined,
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
    }
  }),
  actions: {
    // Is this necessary? - todo (probably not)
    
    setUser(user: User) {
      this.user = user
    },
    async loadUser(UserId: number) {
      const user = await API.users.show(UserId)
      this.setUser(user)

    },
    async login(email: string, password: string) {
      try {
        const response = await API.auth.login(email, password)
        if (response.status === 200) {
          const { token, user } = response.data
          Cookies.set('token', token)
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