import { io } from 'socket.io-client'

const socketIO = io(process.env.URL_API, {
  reconnection: true,
  autoConnect: true,
  transports: ['websocket'],
  auth: (cb) => {
    const tokenItem = localStorage.getItem('token')
    const token = tokenItem ? JSON.parse(tokenItem) : null
    // eslint-disable-next-line standard/no-callback-literal
    cb({ token })
  }
})

export default socketIO
