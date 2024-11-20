import axios from 'axios'
import store from '../store'
import router from '../router'

// Create axios instance
const axiosInstance = axios.create({
  baseURL: '/api'
})

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    const token = store.getters.getToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      store.commit('setAuth', null)
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance 