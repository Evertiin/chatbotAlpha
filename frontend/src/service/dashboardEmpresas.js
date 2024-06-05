import { AdminListarEmpresas, AdminListarEmpresasActive, ListarWhatsappsAdmin } from 'src/service/empresas'
import { AdminListarUsuarios } from 'src/service/user'
import { CountMensage } from 'src/service/tickets'

export async function getQuantidadeTenants () {
  try {
    const response = await AdminListarEmpresas()
    return response.data.length
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getWhatsapp () {
  try {
    const response = await ListarWhatsappsAdmin()
    return response.data.length
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getQuantidadeTenantsActive () {
  try {
    const response = await AdminListarEmpresasActive('active')
    return response.data.filter(item => item.status === 'active').length
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getQuantidadeUsuarios () {
  try {
    const response = await AdminListarUsuarios()
    return response.data.users.length
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getMesagem () {
  try {
    const response = await CountMensage()
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
