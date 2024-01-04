import axios from 'axios'

const url = `${import.meta.env.VITE_API}/dashboard`

export default {
  outstandingRevenue() {
    return axios.get(`${url}/outstanding-revenue`)
  }
}