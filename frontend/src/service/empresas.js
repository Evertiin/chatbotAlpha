import request from 'src/service/request'

export function BuscarEmpresa(tenantId) {
  return request({
    url: `/tenants/${tenantId}`,
    method: 'get'
  })
}

export function MostrarHorariosAtendiemento() {
  return request({
    url: '/tenants/business-hours/',
    method: 'get'
  })
}

export function AtualizarHorariosAtendiemento(data) {
  return request({
    url: '/tenants/business-hours/',
    method: 'put',
    data
  })
}

export function AtualizarMensagemHorariosAtendiemento(data) {
  return request({
    url: '/tenants/message-business-hours/',
    method: 'put',
    data
  })
}

export function AdminListarEmpresas() {
  return request({
    url: '/admin/tenants/',
    method: 'get'
  })
}

export function AdminUpdateStatusEmpresa(tenantId, data) {
  return request({
    url: `/admin/status/tenant/${tenantId}`,
    method: 'put',
    data
  })
}

export function AdminUpdateEmpresa(tenantId, data) {
  return request({
    url: `/admin/empresa/${tenantId}`,
    method: 'put',
    data
  })
}

export function AdminListarEmpresasActive(status = 'active') {
  return request({
    url: '/admin/tenants/',
    method: 'get',
    params: {
      status
    }
  })
}

export function AdminListarUsersBytenant(tenantId) {
  return request({
    url: `/admin/users/${tenantId}`,
    method: 'get'
  })
}

export function CriarTenant(data) {
  return request({
    url: '/admin/tenants/',
    method: 'post',
    data
  })
}
export function AtualizarTenant(data) {
  return request({
    url: '/admin/tenants/' + data.id,
    method: 'put',
    data
  })
}
export function DeletarTenant(id) {
  return request({
    url: '/admin/tenants/' + id,
    method: 'delete'
  })
}
export function ListarWhatsappsAdmin() {
  return request({
    url: '/admin/channels',
    method: 'get'
  })
}
