import request from './request'

export function listarMensagens(contactId, isGroup) {
  return request({
    url: `/chat-interno/mensagens/${contactId}?isGroup=${isGroup}`,
    method: 'get'
  })
}

export function enviarMensagem(data) {
  return request({
    url: '/chat-interno/mensagens',
    method: 'post',
    data
  })
}

export function marcarMensagemComoLida(contactId, isGroup) {
  return request({
    url: `/chat-interno/mensagens/${contactId}`,
    method: 'put',
    data: {
      isGroup
    }
  })
}

export function listCountUnreadMessage() {
  return request({
    url: '/chat-interno/count/mensagens',
    method: 'get'
  })
}

export function listarGrupos(userId) {
  return request({
    url: `/users/groups/${userId}`,
    method: 'get'
  })
}
