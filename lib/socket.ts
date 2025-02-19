import { io } from 'socket.io-client'
import { env } from '../config'
import secureLocalStorage from 'react-secure-storage'

const socket = io(env.apiUrl, {
  transports: ['websocket', 'polling', 'flashsocket'],
  autoConnect: false,
  query: {
    token: String(secureLocalStorage.getItem('token')) || 'test'
  }
})

export default socket
