import axios from 'axios'

const url = `${import.meta.env.VITE_API}/dashboard`

export default {
  async outstandingRevenue() {
    const response = await axios.get(`${url}/outstanding-revenue`)
    return response.data.total
  }
}