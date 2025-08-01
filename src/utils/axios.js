// src/utils/axios.js
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // Đây là link backend bạn test được bên Postman
  headers: {
    'Content-Type': 'application/json',
  },
})

export default instance
