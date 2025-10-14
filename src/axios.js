// src/axios.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080',
})

// Gắn token vào header cho mọi request

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})


// Xử lý lỗi 401
instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
export default instance
