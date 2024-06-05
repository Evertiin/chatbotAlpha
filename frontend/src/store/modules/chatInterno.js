const chatInterno = {
  state: {
    mensagemChatInterno: {},
    unreadMessageInterna: {},
    listaUsuarios: [],
    listaGrupos: [],
    chatFocado: {},
    notificacaoChatInterno: {},
    notificacoesChat: 0
  },
  mutations: {
    LISTA_USUARIOS_CHAT_INTERNO(state, payload) {
      if (payload.action === 'create') {
        payload.data.sort((a, b) => new Date(Number(b.timestamp)) - new Date(Number(a.timestamp)))
        // state.listaUsuarios = [...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data]
        state.listaUsuarios = payload.data
      } else if (payload.action === 'update') {
        const index = state.listaUsuarios.findIndex(user => user.id === payload.data.id)
        state.listaUsuarios[index] = payload.data
        state.listaUsuarios.sort((a, b) => new Date(Number(b.date)) - new Date(Number(a.date)))
      } else if (payload.action === 'updateAllUsers') {
        const users = [...state.listaUsuarios]
        users.map(user => {
          user.isOnline = false
          return user
        })
        state.listaUsuarios = users
      }
    },
    LISTA_GRUPOS_CHAT_INTERNO(state, payload) {
      if (payload.action === 'create') {
        payload.data.sort((a, b) => new Date(Number(b.timestamp)) - new Date(Number(a.timestamp)))
        // state.listaUsuarios = [...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data, ...payload.data]
        state.listaGrupos = payload.data
      } else if (payload.action === 'update') {
        const index = state.listaGrupos.findIndex(user => user.id === payload.data.id)
        state.listaGrupos[index] = payload.data
        state.listaGrupos.sort((a, b) => new Date(Number(b.date)) - new Date(Number(a.date)))
      }
    },
    CHAT_FOCADO_UPDATE(state, payload) {
      state.chatFocado = payload
    },
    UNREAD_MENSAGEM_INTERNA_UPDATE(state, payload) {
      state.unreadMessageInterna = payload.data
    },
    MENSAGEM_INTERNA_UPDATE(state, payload) {
      state.mensagemChatInterno = payload.data
    },
    NOTIFICACAO_CHAT_INTERNO_UPDATE(state, payload) {
      state.notificacaoChatInterno = payload.data
    },
    LISTA_NOTIFICACOES_CHAT_INTERNO(state, payload) {
      if (payload.action === 'create') {
        state.notificacoesChat = parseInt(payload.data)
      } else if (payload.action === 'update') {
        state.notificacoesChat += parseInt(payload.data)
      } else if (payload.action === 'remove') {
        state.notificacoesChat -= parseInt(payload.data)
      }
    }
  }
}

export default chatInterno
