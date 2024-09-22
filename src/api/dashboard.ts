import axios from 'axios'

const url = `${import.meta.env.VITE_API}/dashboard`

const handleError = (error: any) => {
  console.error('Dashboard API Error:', error)
  throw error
}

export default {
  async outstandingRevenue() {
    try {
      return await axios.get(`${url}/outstanding-revenue`)
    } catch (error) {
      handleError(error)
    }
  }
}