import axios, { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores'
import { pinia } from '@/main'
import router from '@/router'
import API from '@/api'

export const decodeJWT = (token: string) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export const formatDateMMDDYYYY = (date?: Date | string) => {
  if (typeof date === 'string') date = new Date(date)
  if (!date) date = new Date()
  return date?.toLocaleDateString('en-US', { timeZone: 'UTC' })
}

export const formatCurrency = (amount: number) => {
  if (isNaN(amount))
    return '$0.00'

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  return formatter.format(amount)
}

const expiredLogout = () => {
  Cookies.remove('token')
  Cookies.remove('refreshToken')
  useAuthStore(pinia).loggedIn = false
  router.push({ name: 'Auth/Login' })
}

export const axiosInterceptors = () => {
  axios.interceptors.request.use(
    config => {
      const token = Cookies.get('token')
      if (token) { 
        config.headers['Authorization'] = token
      }
      return config
    },
    err => Promise.reject(err)
  )
  
  axios.interceptors.response.use(
    response => response,
    async err => {
      const token = Cookies.get('token')
      const refreshToken = Cookies.get('refreshToken')
      if (token && err.response?.status === 401 && refreshToken) {
        try {
          const response = await API.auth.refresh(refreshToken)
          if (response?.status === 200) {
            Cookies.set('token', response.data.token)
            return axios(err.config)
          }
          expiredLogout()
        } catch {
          expiredLogout()
      }
      return Promise.reject(err)
    }
  })
}