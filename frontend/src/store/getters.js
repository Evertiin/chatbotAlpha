import { orderBy } from 'lodash'
import { parseISO } from 'date-fns'

const orderTickets = (tickets) => {
  const newOrder = orderBy(tickets, (obj) => parseISO(obj.updatedAt), ['desc'])
  return newOrder
}

const getters = {
  notifications: state => state.notifications.notifications,
  notifications_p: state => state.notifications.notifications_p,
  tickets: state => orderTickets(state.atendimentoTicket.tickets),
  mensagensTicket: state => state.atendimentoTicket.mensagens,
  ticketFocado: state => state.atendimentoTicket.ticketFocado,
  hasMore: state => state.atendimentoTicket.hasMore,
  whatsapps: state => state.whatsapp.whatsApps,
  isSuporte: state => state.user.isSuporte,
  isAdmin: state => state.user.isAdmin,
  empresas: state => state.empresa.empresas,
  listaUsuarios: state => state.chatInterno.listaUsuarios,
  listaGrupos: state => state.chatInterno.listaGrupos,
  unreadMessageInterna: state => state.chatInterno.unreadMessageInterna,
  mensagemChatInterno: state => state.chatInterno.mensagemChatInterno,
  userChat: state => state.chatInterno.userChat,
  chatFocado: state => state.chatInterno.chatFocado,
  notificacaoChatInterno: state => state.chatInterno.notificacaoChatInterno,
  notificacoesChat: state => state.chatInterno.notificacoesChat,
  showMenu: state => state.usersApp.showMenu,
  notificacaoTicket: state => state.notifications.notificacaoTicket
}
export default getters
