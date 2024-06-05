<template>
  <q-layout view="hHh Lpr lFf">

    <q-header class="bg-white text-grey-8 q-py-xs " height-hint="58" bordered v-if="showMenu">
      <q-toolbar>
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="menu">
          <q-tooltip>Menu</q-tooltip>
        </q-btn>

        <q-btn flat no-caps no-wrap dense class="q-ml-sm" v-if="$q.screen.gt.xs">
          <q-img src="/izing-logo_5_transparent.png" spinner-color="primary" style="height: 80px; width: 140px" />
        </q-btn>

        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating
              v-if="(parseInt(notifications.count) + parseInt(notifications_p.count) + parseInt(notificacoesChat)) > 0">
              {{ parseInt(notifications.count) + parseInt(notifications_p.count) + parseInt(notificacoesChat) }}
            </q-badge>
            <q-menu>
              <q-list style="min-width: 300px">
                <q-item
                  v-if="(parseInt(notifications.count) + parseInt(notifications_p.count) + parseInt(notificacoesChat)) == 0">
                  <q-item-section style="cursor: pointer;">
                    Nada de novo por aqui!
                  </q-item-section>
                </q-item>
                <q-item v-if="parseInt(notificacoesChat) > 0">
                  <q-item-section avatar @click="() => $router.push({ name: 'interno' })" style="cursor: pointer;">
                    <q-avatar style="width: 60px; height: 60px" color="blue" text-color="white">
                      {{ notificacoesChat }}
                    </q-avatar>
                  </q-item-section>
                  <q-item-section @click="() => $router.push({ name: 'chat-interno' })" style="cursor: pointer;">
                    Mensagens não lidas no chat interno!
                  </q-item-section>
                </q-item>
                <q-item v-if="parseInt(notifications_p.count) > 0">
                  <q-item-section avatar @click="() => $router.push({ name: 'atendimento' })" style="cursor: pointer;">
                    <q-avatar style="width: 60px; height: 60px" color="blue" text-color="white">
                      {{ notifications_p.count }}
                    </q-avatar>
                  </q-item-section>
                  <q-item-section @click="() => $router.push({ name: 'atendimento' })" style="cursor: pointer;">
                    Clientes pendentes na fila
                  </q-item-section>
                </q-item>
                <q-item v-for="ticket in notifications.tickets" :key="ticket.id"
                  style="border-bottom: 1px solid #ddd; margin: 5px;">
                  <q-item-section avatar @click="abrirAtendimentoExistente(ticket.name, ticket)" style="cursor: pointer;">
                    <q-avatar style="width: 60px; height: 60px">
                      <img :src="ticket.profilePicUrl">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section @click="abrirAtendimentoExistente(ticket.name, ticket)" style="cursor: pointer;">
                    <q-list>
                      <q-item style="text-align:center; font-size: 17px; font-weight: bold; min-height: 0">{{ ticket.name
                      }}</q-item>
                      <q-item style="min-height: 0; padding-top: 0"><b>Mensagem: </b> {{ ticket.lastMessage }}</q-item>
                    </q-list>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <q-tooltip>Notificações</q-tooltip>
          </q-btn>
          <q-avatar :color="usuario.status === 'offline' ? 'negative' : 'positive'" text-color="white" size="25px"
            :icon="usuario.status === 'offline' ? 'mdi-account-off' : 'mdi-account-check'" rounded class="q-ml-lg">
            <q-tooltip>
              {{ usuario.status === 'offline' ? 'Usuário Offiline' : 'Usuário Online' }}
            </q-tooltip>
          </q-avatar>
          <q-btn round flat class="bg-padrao text-bold q-mx-sm q-ml-lg">
            <q-avatar size="26px">
              {{ $iniciaisString(username) }}
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item-label header> Olá! <b> {{ username }} </b> </q-item-label>
                <q-item clickable v-close-popup>
                  <q-item-section>
                    <q-toggle color="blue" :value="$q.dark.isActive" label="Modo escuro"
                      @input="$setConfigsUsuario({ isDark: !$q.dark.isActive })" />
                  </q-item-section>
                </q-item>
                <cStatusUsuario @update:usuario="atualizarUsuario" :usuario="usuario" />
                <q-item clickable v-close-popup @click="abrirModalUsuario">
                  <q-item-section>Perfil</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="efetuarLogout">
                  <q-item-section>Sair</q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                  <q-item-section>
                    <cSystemVersion />
                  </q-item-section>
                </q-item>

              </q-list>
            </q-menu>

            <q-tooltip>Usuário</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :mini="miniState" @mouseover="miniState = false"
      v-if="showMenu" @mouseout="miniState = true" mini-to-overlay content-class="bg-white text-grey-9">
      <q-scroll-area class="fit">
        <q-list padding :key="userProfile">
          <!-- Seu código existente -->
          <EssentialLink v-for="item in menuData" :key="item.title" v-bind="item" />

          <div v-if="userProfile === 'admin'">
            <q-separator spaced />
            <div class="q-mb-lg"></div>
            <!-- Seu código existente -->
            <template v-for="item in menuDataAdmin">
              <EssentialLink v-if="exibirMenuBeta(item) && validaTelaAdmin(item)" :key="item.title" v-bind="item" />
            </template>
          </div>

          <!-- Movido para fora do loop -->
          <q-avatar
            v-if="notificacoesChat > 0"
            size="20px"
            color="red"
            text-color="white"
            class="absolute-top-right"
          >
            {{ notificacoesChat }}
          </q-avatar>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <audio ref="audioNotification">
      <source :src="alertSound" type="audio/mp3">
    </audio>
    <ModalUsuario :isProfile="true" :modalUsuario.sync="modalUsuario" :usuarioEdicao.sync="usuario" />
  </q-layout>
</template>

<script>
// const userId = +localStorage.getItem('userId')
import cSystemVersion from '../components/cSystemVersion.vue'
import { ListarWhatsapps } from 'src/service/sessoesWhatsapp'
import EssentialLink from 'components/EssentialLink.vue'
import socketInitial from './socketInitial'
import alertSound from 'src/assets/sound.mp3'
import alertInterno from 'src/assets/chatInterno.mp3'
import { format } from 'date-fns'
const username = localStorage.getItem('username')
import ModalUsuario from 'src/pages/usuarios/ModalUsuario'
import { mapGetters } from 'vuex'
import { ListarConfiguracoes } from 'src/service/configuracoes'
import { RealizarLogout } from 'src/service/login'
import cStatusUsuario from '../components/cStatusUsuario.vue'
import { ConsultarTickets } from 'src/service/tickets'
import axios from 'axios'

const objMenu = [
  {
    title: 'Dashboard',
    caption: '',
    icon: 'mdi-home',
    routeName: 'home-dashboard'
  },
  {
    title: 'Atendimentos',
    caption: 'Lista de atendimentos',
    icon: 'mdi-forum-outline',
    routeName: 'atendimento',
    notificacoesChat: 0,
    showNotification: true
  },
  {
    title: 'Chat Interno',
    caption: 'Chat Interno',
    icon: 'mdi-message-text',
    routeName: 'chat-interno',
    notificacoesChat: 0,
    showNotification: true
  },
  {
    title: 'Contatos',
    caption: 'Lista de contatos',
    icon: 'mdi-card-account-mail',
    routeName: 'contatos'
  }
]

const objMenuAdmin = [
  {
    title: 'Canais',
    caption: 'Canais de Comunicação',
    icon: 'mdi-cellphone-wireless',
    routeName: 'sessoes'
  },
  {
    title: 'Empresas',
    caption: 'Lista de empresas',
    icon: 'mdi-office-building',
    routeName: 'empresas',
    submenu: [
      {
        title: 'Subitem 1',
        caption: 'Descrição do Subitem 1',
        icon: 'mdi-office-building',
        routeName: 'empresas'
      },
      {
        title: 'Subitem 2',
        caption: 'Descrição do Subitem 2',
        icon: 'mdi-office-building',
        routeName: 'empresas'
      }
    ]
  },
  {
    title: 'Painel Atendimentos',
    caption: 'Visão geral dos atendimentos',
    icon: 'mdi-view-dashboard-variant',
    routeName: 'painel-atendimentos'
  },
  {
    title: 'Relatórios',
    caption: 'Relatórios gerais',
    icon: 'mdi-file-chart',
    routeName: 'relatorios'
  },
  {
    title: 'Usuarios',
    caption: 'Admin de usuários',
    icon: 'mdi-account-group',
    routeName: 'usuarios'
  },
  {
    title: 'Filas | Grupos',
    caption: 'Cadastro de Filas',
    icon: 'mdi-arrow-decision-outline',
    routeName: 'filas'
  },
  {
    title: 'Mensagens Rápidas',
    caption: 'Mensagens pré-definidas',
    icon: 'mdi-reply-all-outline',
    routeName: 'mensagens-rapidas'
  },
  {
    title: 'Chatbot',
    caption: 'Robô de atendimento',
    icon: 'mdi-robot',
    routeName: 'chat-flow'
  },
  {
    title: 'Templates',
    caption: 'Cadastro de templates',
    icon: 'mdi-message',
    routeName: 'templates'
  },
  {
    title: 'Etiquetas',
    caption: 'Cadastro de etiquetas',
    icon: 'mdi-tag-text',
    routeName: 'etiquetas'
  },
  {
    title: 'Horário de Atendimento',
    caption: 'Horário de funcionamento',
    icon: 'mdi-calendar-clock',
    routeName: 'horarioAtendimento'
  },
  {
    title: 'Configurações',
    caption: 'Configurações gerais',
    icon: 'mdi-cog',
    routeName: 'configuracoes'
  },
  /// / criar rotina para liberar pelo backend
  {
    title: 'Campanha',
    caption: 'Campanhas de envio',
    icon: 'mdi-message-bookmark-outline',
    routeName: 'campanhas'
    // isBeta: true
  },
  {
    title: 'API',
    caption: 'Integração sistemas externos',
    icon: 'mdi-call-split',
    routeName: 'api-service'
    // isBeta: true
  }
]

export default {
  name: 'MainLayout',
  mixins: [socketInitial],
  components: { EssentialLink, ModalUsuario, cStatusUsuario, cSystemVersion },
  data() {
    return {
      username,
      domainExperimentalsMenus: ['@'],
      miniState: true,
      userProfile: 'user',
      modalUsuario: false,
      usuario: {},
      alertSound,
      alertInterno,
      leftDrawerOpen: false,
      menuData: objMenu,
      menuDataAdmin: objMenuAdmin,
      countTickets: 0,
      ticketsList: [],
      notificacoesChat: 0
    }
  },
  created() {
    // Verifica se a contagem para 'chat-interno' está presente no localStorage
    const notificationKey = 'notificationsCount_chat-interno'
    const currentCount = parseInt(localStorage.getItem(notificationKey))

    // Se não estiver presente ou o valor for nulo, define o valor inicial como 0
    if (isNaN(currentCount) || currentCount === null) {
      localStorage.setItem(notificationKey, 0)
    }
  },
  computed: {
    ...mapGetters(['notifications', 'notifications_p', 'whatsapps', 'showMenu', 'chatFocado', 'notificacaoChatInterno', 'notificacoesChat', 'notificacaoTicket']),
    cProblemaConexao() {
      const idx = this.whatsapps.findIndex(w =>
        ['PAIRING', 'TIMEOUT', 'DISCONNECTED'].includes(w.status)
      )
      return idx !== -1
    },
    cQrCode() {
      const idx = this.whatsapps.findIndex(
        w => w.status === 'qrcode' || w.status === 'DESTROYED'
      )
      return idx !== -1
    },
    cOpening() {
      const idx = this.whatsapps.findIndex(w => w.status === 'OPENING')
      return idx !== -1
    },
    cUsersApp() {
      return this.$store.state.usersApp
    },
    cObjMenu() {
      if (this.cProblemaConexao) {
        return objMenu.map(menu => {
          if (menu.routeName === 'sessoes') {
            menu.color = 'negative'
          }
          return menu
        })
      }
      return objMenu
    }
  },
  watch: {
    notificacaoChatInterno: {
      async handler(data) {
        // Obtendo usuarioID, áudio de notificação e registrationToken
        const usuarioAtualId = localStorage.getItem('userId')
        const registrationToken = localStorage.getItem('fcmToken')
        const audio = new Audio(alertInterno)

        if (
          this.$router.currentRoute.fullPath.indexOf('atendimento-Interno') < 0 || !this.chatFocado.id || this.chatFocado.id !== this.notificacaoChatInterno.senderId) {
          this.$store.commit('LISTA_NOTIFICACOES_CHAT_INTERNO', { action: 'update', data: 1 })

          // Verificar se o usuário atual é o remetente
          if (Number(data.senderId) === Number(usuarioAtualId)) {
            console.log('ENTROU AQUI')
            return // Não enviar notificação se o remetente é o usuário atual
          }

          // Enviando a notificação se o token estiver disponível
          if (registrationToken) {
            // Use axios para fazer a solicitação HTTP POST para a rota do back-end
            try {
              await axios.post('https://apiweb.omniathostec.com.br/send-notification', {
                registrationToken,
                title: 'Nova mensagem de um grupo.',
                body: `${data.sender.name}: ${data.text}`
              })
              console.log('Notificação enviada com sucesso.')
            } catch (error) {
              console.error('Erro ao enviar notificação:', error)
            }
          }

          // Se a permissão de notificação está garantida, exiba a notificação nativa
          if (Notification.permission === 'granted' && data.senderId !== usuarioAtualId) {
            const notification = new Notification('Nova mensagem de um grupo.', {
              body: `${data.sender.name}: ${data.text}.`
            })

            notification.onclick = (e) => {
              e.preventDefault()
              window.focus()
              this.$router.push({ name: 'chat-interno' })
            }
          } else if (Notification.permission !== 'denied') {
            // Se a permissão não está negada, solicite permissão ao usuário
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted' && data.senderId !== usuarioAtualId) {
                const notification = new Notification('Nova mensagem de um grupo.', {
                  body: `${data.sender.name}: ${data.text}.`
                })

                notification.onclick = (e) => {
                  e.preventDefault()
                  window.focus()
                  this.$router.push({ name: 'chat-interno' })
                }
              }
            })
          }
          // Reproduza o áudio
          if (data.senderId !== usuarioAtualId) {
            audio.play().catch((error) => {
              console.error('Erro ao reproduzir áudio:', error)
            })
          }
          this.$store.commit('INCREMENTAR_NOTIFICACAO', 'chat-interno')
        }
      }
    },
    notificacaoTicket: {
      handler() {
        this.$nextTick(() => {
          this.$refs.audioNotification.play()
        })
      }
    }
  },
  methods: {
    exibirMenuBeta(itemMenu) {
      if (!itemMenu?.isBeta) return true
      for (const domain of this.domainExperimentalsMenus) {
        if (this.usuario.email.indexOf(domain) !== -1) return true
      }
      return false
    },
    validaTelaAdmin(itemMenu) {
      const user = JSON.parse(localStorage.getItem('usuario'))
      if (itemMenu.routeName === 'empresas' && user.tenantId != 1) return false
      return true
    },
    async listarWhatsapps() {
      const { data } = await ListarWhatsapps()
      this.$store.commit('LOAD_WHATSAPPS', data)
    },
    async handlerNotifications(data) {
      const registrationToken = localStorage.getItem('fcmToken')
      // Enviando a notificação se o token estiver disponível
      if (registrationToken) {
        // Use axios para fazer a solicitação HTTP POST para a rota do back-end
        try {
          await axios.post('https://apiweb.omniathostec.com.br/send-notification', {
            registrationToken,
            title: `Nova mensagem recebida! - ${data.ticket.id}`,
            body: `${data.body} - ${format(new Date(), 'HH:mm')}`
          })
        } catch (error) {
          console.error('Erro ao enviar notificação:', error)
        }
      }
      const options = {
        body: `${data.body} - ${format(new Date(), 'HH:mm')}`,
        icon: data.ticket.contact.profilePicUrl,
        tag: data.ticket.id,
        renotify: true
      }
      const notification = new Notification(
        `Mensagem de ${data.ticket.contact.name}`,
        options
      )
      setTimeout(() => {
        notification.close()
      }, 10000)

      notification.onclick = e => {
        e.preventDefault()
        window.focus()
        this.$store.dispatch('AbrirChatMensagens', data.ticket)
        this.$router.push({ name: 'atendimento' })
        // history.push(`/tickets/${ticket.id}`);
      }

      this.$nextTick(() => {
        // utilizar refs do layout
        this.$refs.audioNotificationPlay.play()
      })
      this.$store.commit('INCREMENTAR_NOTIFICACAO', 'atendimento')
    },
    async abrirModalUsuario() {
      this.modalUsuario = true
    },
    async efetuarLogout() {
      try {
        await RealizarLogout(this.usuario)
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('profile')
        localStorage.removeItem('userId')
        localStorage.removeItem('queues')
        localStorage.removeItem('usuario')
        localStorage.removeItem('filtrosAtendimento')

        this.$router.go({ name: 'login', replace: true })
      } catch (error) {
        this.$notificarErro('Não foi possível realizar logout', error)
      }
    },
    async listarConfiguracoes() {
      const { data } = await ListarConfiguracoes()
      localStorage.setItem('configuracoes', JSON.stringify(data))
    },
    conectarSocket(usuario) {
      this.socket.on(`${usuario.tenantId}:chat:updateOnlineBubbles`, data => {
        this.$store.commit('SET_USERS_APP', data)
      })
    },
    atualizarUsuario() {
      this.usuario = JSON.parse(localStorage.getItem('usuario'))
      if (this.usuario.status === 'offline') {
        this.socket.emit(`${this.usuario.tenantId}:setUserIdle`)
      }
      if (this.usuario.status === 'online') {
        this.socket.emit(`${this.usuario.tenantId}:setUserActive`)
      }
    },
    async consultarTickets() {
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
        // console.log(data)
        // this.$store.commit('UPDATE_NOTIFICATIONS', data)
        // this.$store.commit('SET_HAS_MORE', data.hasMore)
        // console.log(this.notifications)
      } catch (err) {
        this.$notificarErro('Algum problema', err)
        console.error(err)
      }
      const params2 = {
        searchParam: '',
        pageNumber: 1,
        status: ['pending'],
        showAll: false,
        count: null,
        queuesIds: [],
        withUnreadMessages: false,
        isNotAssignedUser: false,
        includeNotQueueDefined: true
        // date: new Date(),
      }
      try {
        const { data } = await ConsultarTickets(params2)
        this.countTickets = data.count // count total de tickets no status
        // this.ticketsList = data.tickets
        // console.log(data)
        this.$store.commit('UPDATE_NOTIFICATIONS_P', data)
        // this.$store.commit('SET_HAS_MORE', data.hasMore)
        // console.log(this.notifications)
      } catch (err) {
        this.$notificarErro('Algum problema', err)
        console.error(err)
      }
    },
    abrirChatContato(ticket) {
      // caso esteja em um tamanho mobile, fechar a drawer dos contatos
      if (this.$q.screen.lt.md && ticket.status !== 'pending') {
        this.$root.$emit('infor-cabecalo-chat:acao-menu')
      }
      if (!(ticket.status !== 'pending' && (ticket.id !== this.$store.getters.ticketFocado.id || this.$route.name !== 'chat'))) return
      this.$store.commit('SET_HAS_MORE', true)
      this.$store.dispatch('AbrirChatMensagens', ticket)
    },
    abrirAtendimentoExistente(contato, ticket) {
      this.$q.dialog({
        title: 'Atenção!!',
        message: `${contato} possui um atendimento em curso (Atendimento: ${ticket.id}). Deseja abrir o atendimento?`,
        cancel: {
          label: 'Não',
          color: 'primary',
          push: true
        },
        ok: {
          label: 'Sim',
          color: 'negative',
          push: true
        },
        persistent: true
      }).onOk(async () => {
        try {
          this.abrirChatContato(ticket)
        } catch (error) {
          this.$notificarErro(
            'Não foi possível atualizar o token',
            error
          )
        }
      })
    }
  },
  async mounted() {
    this.atualizarUsuario()
    await this.listarWhatsapps()
    await this.listarConfiguracoes()
    await this.consultarTickets()
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected. Trying to reconnect...')
      this.socket.connect()
    })
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        await Notification.requestPermission()
      }

      this.usuario = JSON.parse(localStorage.getItem('usuario'))
      this.userProfile = localStorage.getItem('profile')

      await this.conectarSocket(this.usuario)

      this.atualizarUsuario()
      await this.listarWhatsapps()
      await this.listarConfiguracoes()
      await this.consultarTickets()

      this.socket.on('chat:update', this.handlerNotifications)
    }
  }
}
</script>
<style scoped>
.q-img__image {
  background-size: contain;
}
.absolute-top-right {
  position: absolute;
  right: 0;
}
</style>
