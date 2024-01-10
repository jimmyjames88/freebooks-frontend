import { defineStore } from 'pinia'

const useAppStore = defineStore('app', {
  state: () => ({
    navOpen: false
  }),
  actions: {
    toggleNav(value: boolean | undefined = undefined) {
      if (value === undefined) {
        this.navOpen = !this.navOpen
      } else {
        this.navOpen = value
      }
    }
  }
})

export default useAppStore