// Axios custom instance
import axios from 'axios'
import { env } from '../config'
import router from 'next/router'
import { message } from 'antd'
import secureLocalStorage from 'react-secure-storage'

const client = axios.create({
  baseURL: `${env.apiUrl}/api`,
  withCredentials: true
})

client.interceptors.response.use(
  (response) => {
    if (response.data.message) {
      message.success(response.data.message)
    }

    if (response.data.authtoken) {
      secureLocalStorage.setItem('token', response.data.authtoken)
    }

    if (response.data.status === 200) {
      message.success('Success')
    }

    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      if (router.pathname.indexOf('/auth') === -1) {
        router.push('/auth/login')
      }
    }

    if (error.response?.status === 403) {
      message.error('You do not have permission to perform this action')
    }

    if (error.response?.status === 400) {
      message.error(error.response?.data.message)
    }

    return Promise.reject(error)
  }
)

client.interceptors.request.use((request) => {
  request.headers.set('Authorization', String(secureLocalStorage.getItem('token')) || '')

  return request
})

export default client
