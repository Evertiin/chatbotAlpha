import request from 'src/service/request'

export function CriarTemplates(data) {
  return request({
    url: 'message-templates',
    method: 'post',
    data
  })
}

export function ListarTemplates() {
  return request({
    url: 'message-templates',
    method: 'get'
  })
}

export function UpdateTemplate() {
  return request({
    url: 'message-templates',
    method: 'put'
  })
}
