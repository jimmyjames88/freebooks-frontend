import axios from 'axios'
import { _User } from '@jimmyjames88/freebooks-types'

const url = `${import.meta.env.VITE_API}/users`

export default {
  show(UserId: number) {
    return axios.get(`${url}/${UserId}`)
  },
  
  update(user: Partial<_User>) {
    return axios.put(`${url}/${user.id}`, {
      ...user
    })
  }
}
