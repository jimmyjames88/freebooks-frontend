import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import API from '@/api'
import { _User } from '@jimmyjames88/freebooks-types'

interface _State {
  loggedIn: boolean
  user: Partial<_User>
}

const useAuthStore = defineStore('auth', {
  state: (): _State => ({
    loggedIn: false,
    user: {
      id: undefined,
      email: '',
      name: '',
      profile: {
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
      }
    }
  }),
  actions: {
    // Is this necessary? - todo
    
    setUser(user: _User) {
      const allowed = [ 
      'id', 'email', 'name', 'profile', 'displayName', 'displayEmail',  'phone',
      'address', 'line1', 'line2', 'city', 'state', 'postal', 'country'
    ]

      function addAllowed(target: any, source: any) {
        Object.keys(source).filter(key => allowed.includes(key)).forEach(key => {
          console.log(key)
          if (typeof source[key] === 'object') {
            addAllowed(target[key], source[key])
            return
          }
          target[key] = source[key]
        })
      }

      addAllowed(this.user, user)
    },
    async loadUser(userId: number) {
      const response = await API.users.show(userId)
      if (response.status === 200) {
        this.user = response.data
        return true
      }
      return false
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

    async register(user: _User) {
      try {
        const response = await API.auth.register(user)
        if (response.status === 201) {
          return true
        }
      } catch {
        return false
      }
      return false
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