import request from 'src/service/request'

export function CriarGrupo(data) {
  return request({
    url: '/group/',
    method: 'post',
    data
  })
}

export function ListarGrupos() {
  return request({
    url: '/group/',
    method: 'get'
  })
}

export function ListarGruposPorUser() {
  return request({
    url: '/group/user',
    method: 'get'
  })
}

export function ListarUsersPorGrupo(gruopId) {
  return request({
    url: `/group/${gruopId}`,
    method: 'get'
  })
}

export function AlterarGrupo(data) {
  return request({
    url: `/group/${data.id}`,
    method: 'put',
    data
  })
}

export function DeletarGrupo(data) {
  return request({
    url: `/group/${data.id}`,
    method: 'delete'
  })
}

export function AddUserGrupo(userId, groupId) {
  return request({
    url: '/group/user',
    method: 'post',
    data: { userId, groupId }
  })
}

export function RemoveUserGrupo(userId, grupoId) {
  return request({
    url: `/group/user/${userId}/${grupoId}`,
    method: 'delete'
  })
}
