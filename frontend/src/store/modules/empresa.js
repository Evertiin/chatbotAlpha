const empresa = {
  state: {
    empresas: []
  },
  mutations: {
    EMPRESAS_ADMIN(state, payload) {
      if (payload.action == 'create') {
        state.empresas = payload.data
      } else if (payload.action == 'add') {
        state.empresas.push(payload.data)
      } else if (payload.action == 'update-status') {
        const index = state.empresas.findIndex(item => item.id == payload.data.id)
        state.empresas[index].status = payload.data.status
      } else if (payload.action == 'update') {
        const index = state.empresas.findIndex(item => item.id == payload.data.id)
        state.empresas[index].name = payload.data.name
        state.empresas[index].cnpj = payload.data.cnpj
        state.empresas[index].maxUsers = payload.data.maxUsers
        state.empresas[index].maxConnections = payload.data.maxConnections
        state.empresas[index].enableIa = payload.data.enableIa
        state.empresas[index].apiKey = payload.data.apiKey
      }
    }
  }
}

export default empresa
