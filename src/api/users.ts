import axios from 'axios'
import { _User } from '@jimmyjames88/freebooks-types'

const url = `${import.meta.env.VITE_API}/users`

export default {
  show(userId: number) {
    return axios.get(`${url}/${userId}`)
  },

  getProfile(userId: number) {
    return axios.get(`${url}/${userId}/profile`)
  },

  update(user: Partial<_User>) {
    return axios.put(`${url}/${user.id}`, {
      ...user
    })
  }
}
