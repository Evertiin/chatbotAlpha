import axios from 'axios'

const service = axios.create({
  timeout: 20000
})

export function validaapi () {
  const username = process.env.USUARIO_API
  const password = process.env.SENHA_API
  return service({
    method: 'post',
    data: {
      username,
      password
    }
  })
}
