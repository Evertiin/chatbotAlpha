const usuario = JSON.parse(localStorage.getItem('usuario'))
import Router from 'src/router/index'
import socket from '../utils/socket'
import { ConsultarTickets } from 'src/service/tickets'
import { ListarUsuariosChatInterno } from 'src/service/user'
import checkTicketFilter from 'src/utils/checkTicketFilter'

const userId = +localStorage.getItem('userId')

export default {
  data() {
    return {
      socket
    }
  },
  created() {
    this.socket.on(`tokenInvalid:${this.socket.id}`, () => {
      this.socket.disconnect()
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('profile')
      localStorage.removeItem('userId')
      localStorage.removeItem('usuario')
      setTimeout(() => {
        Router.push({
          name: 'login'
        })
      }, 1000)
    })

    this.socket.emit(`${usuario.tenantId}:joinNotification`)

    this.socket.on(`${usuario.tenantId}:ticket`, data => {
      if (data.action === 'update' && data.ticket.userId === userId) {
        if (data.ticket.status === 'open' && !data.ticket.isTransference) {
          this.$store.commit('TICKET_FOCADO', data.ticket)
        }
      }
    })

    this.socket.on(`${usuario.tenantId}:user-online`, data => {
      if (data.action === 'update' && data.data.userId !== usuario.userId) {
        this.$store.commit('USER_CHAT_UPDATE', data)
      }
    })

    this.socket.on(`${usuario.tenantId}:mensagem-chat-interno`, data => {
      if (data.action === 'update' && (data.data.receiverId == usuario.userId || data.data.groupId != null)) {
        this.$store.commit('MENSAGEM_INTERNA_UPDATE', data)
      }
    })

    this.socket.on(`${usuario.tenantId}:unread-mensagem-chat-interno`, data => {
      if (data.action === 'update' && data.data.senderId == usuario.userId) {
        this.$store.commit('UNREAD_MENSAGEM_INTERNA_UPDATE', data)
      }
    })

    this.socket.on(`${usuario.tenantId}:mensagem-chat-interno-notificacao`, data => {
      if (data.action === 'update' && (data.data.receiverId == usuario.userId || data.data.groupId != null)) {
        this.$store.commit('NOTIFICACAO_CHAT_INTERNO_UPDATE', data)
      }
    })

    this.socket.on(`${usuario.tenantId}:whatsapp`, data => {
      if (data.action === 'update') {
        this.$store.commit('UPDATE_WHATSAPPS', data.whatsapp)
      }
    })

    this.socket.on(`${usuario.tenantId}:whatsapp`, data => {
      if (data.action === 'delete') {
        this.$store.commit('DELETE_WHATSAPPS', data.whatsappId)
      }
    })

    this.socket.on(`${usuario.tenantId}:whatsappSession`, data => {
      if (data.action === 'update') {
        this.$store.commit('UPDATE_SESSION', data.session)
        this.$root.$emit('UPDATE_SESSION', data.session)
      }

      if (data.action === 'readySession') {
        this.$q.notify({
          position: 'top',
          icon: 'mdi-wifi-arrow-up-down',
          message: `A conexão com o WhatsApp está pronta e o mesmo está habilitado para enviar e receber mensagens. Conexão: ${data.session.name}. Número: ${data.session.number}.`,
          type: 'positive',
          color: 'primary',
          html: true,
          progress: true,
          timeout: 7000,
          actions: [{
            icon: 'close',
            round: true,
            color: 'white'
          }],
          classes: 'text-body2 text-weight-medium'
        })
      }
    })

    this.socket.on(`${usuario.tenantId}:change_battery`, data => {
      this.$q.notify({
        message: `Bateria do celular do whatsapp ${data.batteryInfo.sessionName} está com bateria em ${data.batteryInfo.battery}%. Necessário iniciar carregamento.`,
        type: 'negative',
        progress: true,
        position: 'top',
        actions: [{
          icon: 'close',
          round: true,
          color: 'white'
        }]
      })
    })

    // this.socket.on(`${usuario.tenantId}:ticketList`, async data => {
    //   var verify = []
    //   if (data.type === 'notification:new') {
    //     // Atualiza notificações de mensagem
    //     // var data_noti = []
    //     const params = {
    //       searchParam: '',
    //       pageNumber: 1,
    //       status: ['pending'],
    //       showAll: false,
    //       count: null,
    //       queuesIds: [],
    //       withUnreadMessages: false,
    //       isNotAssignedUser: false,
    //       includeNotQueueDefined: true
    //       // date: new Date(),
    //     }
    //     try {
    //       const data_noti = await ConsultarTickets(params)
    //       this.$store.commit('UPDATE_NOTIFICATIONS_P', data_noti.data)
    //       verify = data_noti
    //     } catch (err) {
    //       this.$notificarErro('Algum problema', err)
    //       console.error(err)
    //     }
    //     // Faz verificação para se certificar que notificação pertence a fila do usuário
    //     var pass_noti = false
    //     verify.data.tickets.forEach((element) => { pass_noti = (element.id == data.payload.id ? true : pass_noti) })
    //     // Exibe Notificação
    //     if (pass_noti) {
    //       const message = new self.Notification('Novo cliente pendente', {
    //         body: 'Cliente: ' + data.payload.contact.name,
    //         tag: 'simple-push-demo-notification'
    //       })
    //       console.log(message)
    //     }
    //   }
    // })

    this.socket.on(`${usuario.tenantId}:ticketList`, async data => {
      if (data.type === 'chat:create') {
        if (
          !data.payload.read &&
          (data.payload.ticket.userId === userId || !data.payload.ticket.userId) &&
          data.payload.ticket.id !== this.$store.getters.ticketFocado.id
        ) {
          if (checkTicketFilter(data.payload.ticket)) {
            this.$store.commit('UPDATE_NOTIFICATIONS', data)
          }
        }
        console.log('Estado da Conexão:', this.socket.connected)
        this.$store.commit('UPDATE_MESSAGES', data.payload)
        this.scrollToBottom()
        // Atualiza notificações de mensagem
        const params = {
          searchParam: '',
          pageNumber: 1,
          status: ['open'],
          showAll: false,
          count: null,
          queuesIds: [],
          withUnreadMessages: true,
          isNotAssignedUser: false,
          includeNotQueueDefined: true
          // date: new Date(),
        }

        try {
          const { data } = await ConsultarTickets(params)

          this.countTickets = data.count // count total de tickets no status

          // this.ticketsList = data.tickets
          // this.$store.commit('UPDATE_NOTIFICATIONS', data)

          // this.$store.commit('SET_HAS_MORE', data.hasMore)
          // console.log(this.notifications)
        } catch (err) {
          console.log('error try')
          this.$notificarErro('Algum problema', err)
          console.error(err)
        }
      }

      if (data.type === 'chat:ack' || data.type === 'chat:delete') {
        this.$store.commit('UPDATE_MESSAGE_STATUS', data.payload)
      }

      if (data.type === 'ticket:update') {
        if (data.payload.tenantId === usuario.tenantId) {
          this.$store.commit('UPDATE_TICKET', data.payload)
        }
      }
    })

    this.socket.on('verifyOnlineUsers', data => {
      this.$store.commit('LISTA_USUARIOS_CHAT_INTERNO', { action: 'updateAllUsers', data: {} })
      this.socket.emit(`${usuario.tenantId}:userVerified`, usuario)
    })

    this.socket.on(`${usuario.tenantId}:updateStatusUser`, async () => {
      const { data } = await ListarUsuariosChatInterno()
      this.$store.commit('LISTA_USUARIOS_CHAT_INTERNO', { action: 'create', data: data.users })
    })
  },
  methods: {
    scrollToBottom() {
      setTimeout(() => {
        this.$root.$emit('scrollToBottomMessageChat')
      }, 200)
    },
    disconnectSocket() {
      console.log('disconnectSocket')
      this.socket.disconnect()
    }
  }
}
