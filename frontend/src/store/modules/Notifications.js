// import { Notify } from 'quasar'
// import $router from 'src/router'
// import { orderBy } from 'lodash'
// import { parseISO } from 'date-fns'
import { EventBus } from './eventBus'

const Notifications = {
  state: {
    notifications: [],
    notifications_p: [],
    notificacoesChat: 0,
    notificacaoTicket: 0
  },
  mutations: {
    // OK
    UPDATE_NOTIFICATIONS (state, payload) {
      state.notifications = payload
      state.notificacaoTicket += 1
    },
    UPDATE_NOTIFICATIONS_P (state, payload) {
      state.notifications_p = payload
    },
    INCREMENTAR_NOTIFICACAO(state, routeName) {
      const notificationKey = `notificationsCount_${routeName}`
      const currentCount = parseInt(localStorage.getItem(notificationKey)) || 0
      localStorage.setItem(notificationKey, currentCount + 1)

      // Emita um evento para informar sobre a nova notificação
      EventBus.$emit('nova-notificacao', routeName)
    },
    RESET_CONTADOR_CHAT_INTERNO(state) {
      const notificationKey = 'notificationsCount_chat-interno'
      localStorage.setItem(notificationKey, 0)
      EventBus.$emit('remover-notificacao', 'chat-interno')
    },
    RESET_CONTADOR_ATENDIMENTO(state) {
      const notificationKey = 'notificationsCount_atendimento'
      localStorage.setItem(notificationKey, 0)
      EventBus.$emit('remover-notificacao', 'atendimento')
    }
  }
}

export default Notifications
